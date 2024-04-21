import pandas as pd
import sys
from lightfm import LightFM

sys.path.insert(1, "src/logic/")
from utils import save, load
from data_execution.execute import (
    execute_user_by_id,
    execute_posts_after,
    execute_ratings_for_user_after,
)
from features.FeaturesPreprocess import add_user, add_posts
import psycopg2
import yaml


K_RECOMENDED = 100
K_POPULAR = 100
K_RELEVANT = 100
K_RANDOM = 20
NO_EPOCHS = 20


def predict_for_user(models: LightFM, user_id):
    print("predict")

    # пока степа не отправляет мне список на котором предсказывать
    # БЛОК ДЛЯ ПРЕДИКТА НЕ НА НОВЫХ ДАННЫХ
    post_ids_t1 = predict_by_model(models["model_t1"], user_id)
    add_user_if_none(models["model_t2"], user_id)
    post_ids_t2 = predict_by_model(models["model_t2"], user_id)
    add_user_if_none(models["model_t3"], user_id)
    posts = execute_posts_after(models["model_t3"])
    ratings = execute_ratings_for_user_after(user_id, posts)
    add_item(models["model_t3"], posts)
    fit_partial_model(models["model_t3"], ratings)
    post_ids_t3 = predict_by_model(models["model_t3"], user_id)
    popular = predict_from_psql_month()
    all = popular
    all["model_t1"] = post_ids_t1
    all["model_t2"] = post_ids_t2
    all["model_t3"] = post_ids_t3
    last_set = set()
    for a_key in all:
        all[a_key] = list(set(all[a_key]).difference(last_set))
        last_set = set(list(last_set) + all[a_key])
    print(f"popular {all}")
    return all


def fit_partial_model(model_t, ratings):
    sm_interactions, sm_weights = model_t["dataset"].build_interactions(
        ratings[["user_id", "post_id", "rating"]].values
    )
    model_t["model"].fit_partial(
        interactions=sm_interactions,
        user_features=model_t["user_features"],
        item_features=model_t["item_features"],
        epochs=NO_EPOCHS,
    )


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
    with open("config/config.yaml") as f:
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
        populars = {
            "30 minutes": [],
            "1 hours": [],
            "2 hours": [],
            "12 hours": [],
            "1 days": [],
            "7 days": [],
            "30 days": [],
            "1 years": [],
        }
        for p_key in populars:
            cursor.execute(
                f"""WITH interaction AS (SELECT user_id, post_id FROM like_post
    UNION
    SELECT user_id, post_id FROM comment WHERE deleted = false)
    SELECT post_id, COUNT(i.user_id) FROM interaction i JOIN post p ON post_id = p.id WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '{p_key}' GROUP BY post_id ORDER BY count DESC limit {K_POPULAR};"""
            )
            popular = pd.DataFrame(
                cursor.fetchall(), columns=["post_id", "count"]
            )  # A list() of tables.
            populars[p_key] = popular["post_id"].values
        conn.close()
        return populars


# if __name__ == "__main__":
#     predict_for_user()
