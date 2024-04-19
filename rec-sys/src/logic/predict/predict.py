import pandas as pd
import os
import sys
import glob
from lightfm import LightFM
from lightfm.data import Dataset
from lightfm.cross_validation import random_train_test_split

sys.path.insert(1, "src/logic/")
from utils import save, load
from data_execution.execute import execute_user_by_id
import psycopg2
import yaml

import numpy as np

K_RECOMENDED = 100
K_POPULAR = 100
K_RELEVANT = 100
K_RANDOM = 20


def predict_for_user(models: LightFM, user_id):
    print("predict")
    user_id_map, user_feature_map, item_id_map, feature_item_map = models["model_t1"][
        "dataset"
    ].mapping()
    try:
        # пока степа не отправляет мне список на котором предсказывать

        user_id_map[user_id]
        list_scores = models["model_t1"]["model"].predict(
            user_id_map[user_id],
            list(item_id_map.values()),
            item_features=models["model_t1"]["item_features"],
            user_features=models["model_t1"]["user_features"],
        )
        series_scores = pd.Series(list_scores)
        series_scores.index = item_id_map.keys()
        series_scores.sort_values(ascending=False, inplace=True)
        post_ids = list(series_scores[0:K_RECOMENDED].index)
        popular, top_avg = predict_from_psql_month()
        popular = list(set(popular["post_id"].values) - set(post_ids))
        top_avg = list(set(top_avg["post_id"].values) - set(post_ids) - set(popular))
        print(f"model {post_ids} popular {popular}")
    except KeyError as e:
        user = execute_user_by_id(user_id)

        print(user)


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
