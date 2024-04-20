import pandas as pd
import os
import sys
import glob
from lightfm import LightFM
from lightfm.data import Dataset
from lightfm.cross_validation import random_train_test_split

sys.path.insert(1, "src/logic/")
from utils import save, load
from data_execution.execute import execute_user_by_id, execute_posts_for_user_after
from features.FeaturesPreprocess import add_user, add_posts
import psycopg2
import yaml

import numpy as np

K_RECOMENDED = 100
K_POPULAR = 100
K_RELEVANT = 100
K_RANDOM = 20


def predict_for_user(models: LightFM, user_id):
    print("predict")

    # пока степа не отправляет мне список на котором предсказывать
    # БЛОК ДЛЯ ПРЕДИКТА НЕ НА НОВЫХ ДАННЫХ
    post_ids_t1 = predict_by_model(models["model_t1"], user_id)
    add_user_if_none(models["model_t2"], user_id)
    post_ids_t2 = predict_by_model(models["model_t2"], user_id)
    add_user_if_none(models["model_t3"], user_id)
    posts = execute_posts_for_user_after(models["model_t3"], user_id)
    add_item(models["model_t3"], posts)
    post_ids_t3 = predict_by_model(models["model_t3"], user_id)
    popular, top_avg = predict_from_psql_month()
    popular = list(set(popular["post_id"].values) - set(post_ids_t1))
    top_avg = list(set(top_avg["post_id"].values) - set(post_ids_t1) - set(popular))
    print(f"model {post_ids_t1} popular {popular}")
    print(f"model t2 {post_ids_t2}")
    print(f"model t3 {post_ids_t3}")


def predict_by_model(model_t, user_id):
    try:
        user_id_map, user_feature_map, item_id_map, feature_item_map = model_t[
            "dataset"
        ].mapping()
        # пока степа не отправляет мне список на котором предсказывать

        user_id_map[user_id]
        list_scores = model_t["model"].predict(
            user_id_map[user_id],
            list(item_id_map.values()),
            item_features=model_t["item_features"],
            user_features=model_t["user_features"],
        )
        series_scores = pd.Series(list_scores)
        series_scores.index = item_id_map.keys()
        series_scores.sort_values(ascending=False, inplace=True)
        post_ids = list(series_scores[0:K_RECOMENDED].index)
        return post_ids
    except KeyError:
        return []


def add_user_if_none(model_t, user_id):
    try:
        user_id_map, user_feature_map, item_id_map, feature_item_map = model_t[
            "dataset"
        ].mapping()
        user_id_map[user_id]
    except KeyError:
        user = execute_user_by_id(user_id)
        model_t["dataset"].fit_partial(users=user["id"], items=None)
        model_t["user_features"] = add_user(
            user, model_t["user_encoder"], model_t["user_features"]
        )


def add_item(model_t, posts):
    model_t["dataset"].fit_partial(users=None, items=posts["id"])
    model_t["item_features"] = add_posts(
        posts, model_t["mlb_tags"], model_t["mlb_user_id"], model_t["item_features"]
    )


def predict_from_psql_month():
    with open("../backend/config/config-docker.yaml") as f:
        data = yaml.load(f, Loader=yaml.FullLoader)
    if data and data["postgres"]:
        postgres = data["postgres"]
        conn = psycopg2.connect(
            host="localhost",
            dbname=postgres["DBName"],
            user=postgres["User"],
            password=postgres["Password"],
        )
        cursor = conn.cursor()
        cursor.execute(
            f"""WITH interaction AS (SELECT user_id, post_id FROM like_post
UNION
SELECT user_id, post_id FROM comment WHERE deleted = false)
SELECT post_id, COUNT(i.user_id) FROM interaction i JOIN posts p ON post_id = p.id GROUP BY post_id ORDER BY count DESC limit {K_POPULAR};"""
        )
        popular = pd.DataFrame(
            cursor.fetchall(), columns=["post_id", "count"]
        )  # A list() of tables.
        cursor.execute(
            f"""SELECT post_id, AVG(rating) as average FROM ratings GROUP BY post_id ORDER BY average DESC limit {K_RELEVANT};"""
        )
        top_avg = pd.DataFrame(
            cursor.fetchall(), columns=["post_id", "average"]
        )  # A list() of tables.
        conn.close()
        return popular, top_avg


# if __name__ == "__main__":
#     predict_for_user()
