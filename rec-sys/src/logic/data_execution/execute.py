import glob
import yaml
import psycopg2
import pandas as pd
import os
import sys

sys.path.insert(1, "src/logic/")
from utils import save_json, load, load_json
import json
from features.FeaturesPreprocess import age_to_group

# CONFIG interval
INTERVAL = "1 months"
TAGS_LIMIT = 10000
LIMIT_FETCH = 100000
# CONFIG most popular tegs


def execute_data():
    data = None
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
            f"""
                       DROP VIEW IF EXISTS ratings;
                       DROP VIEW IF EXISTS posts;
CREATE VIEW posts AS SELECT id, user_id, description, location, EXTRACT(EPOCH FROM created_at) as timestamp FROM post WHERE created_at >= CURRENT_DATE - INTERVAL '{INTERVAL}' AND deleted = false;
WITH top_tags as (SELECT post_id, ARRAY_AGG(tag_id) as tag_ids from post_tags WHERE tag_id IN (SELECT tag_id from (SELECT tag_id, count(distinct (tag_id, post_id)) as unique_tags
	FROM post_tags
	GROUP BY tag_id
	ORDER By unique_tags DESC limit {TAGS_LIMIT})) GROUP BY post_id)
SELECT id, user_id, description, location, tag_ids, timestamp FROM posts LEFT JOIN top_tags tt on tt.post_id = id ORDER BY timestamp ASC;"""
        )
        posts = pd.DataFrame(
            cursor.fetchall(),
            columns=[
                "id",
                "user_id",
                "description",
                "location",
                "tag_ids",
                "timestamp",
            ],
        )  # A list() of tables.
        posts.fillna({"tag_ids": ""}, inplace=True)
        posts.to_csv(os.path.join("data/raw", "posts.csv"), index=False)
        save_json(
            {"last_timestamp": str(posts["timestamp"].iloc[-1])},
            "data/raw/last_timestamp",
        )
        cursor.execute(
            f"""SELECT id, gender, about, city, country, date_part('year',age(birthday)) as age FROM users;"""
        )
        users = pd.DataFrame(
            cursor.fetchall(),
            columns=["id", "gender", "about", "city", "country", "age"],
        )  # A list() of tables.
        users.to_csv(os.path.join("data/raw", "users.csv"), index=False)
        cursor.execute(
            f"""DROP VIEW IF EXISTS ratings;
CREATE VIEW ratings AS
WITH comment_rating AS (SELECT DISTINCT user_id, post_id, 2 as rating
FROM comment WHERE deleted = false),
like_rating as (SELECT user_id, post_id, 1 as rating from like_post)
SELECT r.user_id, r.post_id, r.rating FROM (SELECT user_id, post_id, SUM(rating) as rating FROM (SELECT * FROM comment_rating UNION SELECT * FROM like_rating)
GROUP BY user_id, post_id) r JOIN posts p on r.user_id = p.user_id AND post_id = p.id;
SELECT * from ratings;"""
        )
        tmp_res = []
        c = 0
        for f in glob.glob("data/ratings/ratings_[0-9]*.csv"):
            os.remove(f)
        for row in cursor:
            tmp_res.append(row)
            tmp_len = len(tmp_res)
            if tmp_len == LIMIT_FETCH:
                ratings = pd.DataFrame(
                    tmp_res, columns=["user_id", "post_id", "rating"]
                )  # A list() of tables.
                ratings.to_csv(
                    os.path.join("data/ratings", f"ratings_{c}.csv"), index=False
                )
                c += 1
                tmp_res = []
        if tmp_len < LIMIT_FETCH:
            ratings = pd.DataFrame(
                tmp_res, columns=["user_id", "post_id", "rating"]
            )  # A list() of tables.
            ratings.to_csv(
                os.path.join("data/ratings", f"ratings_{c}.csv"), index=False
            )
        conn.close()


def execute_user_by_id(user_id):
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
            f"""SELECT id, gender, about, city, country, date_part('year',age(birthday)) as age FROM users WHERE id = '{user_id}';"""
        )
        user = pd.DataFrame(
            cursor.fetchall(),
            columns=["id", "gender", "about", "city", "country", "age"],
        )  # A list() of tables.
        user = age_to_group(user, "age")
        conn.close()
        return user


def execute_posts_after(model_t):
    with open("../backend/config/config-docker.yaml") as f:
        data = yaml.load(f, Loader=yaml.FullLoader)
    try:
        model_t["last_timestamp"]
    except KeyError:
        model_t["last_timestamp"] = load_json("data/raw/last_timestamp")[
            "last_timestamp"
        ]
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
            f"""WITH top_tags as (SELECT post_id, ARRAY_AGG(tag_id) as tag_ids from post_tags WHERE tag_id IN (SELECT tag_id from (SELECT tag_id, count(distinct (tag_id, post_id)) as unique_tags
	FROM post_tags
	GROUP BY tag_id
	ORDER By unique_tags DESC limit {TAGS_LIMIT})) GROUP BY post_id),
	tmp_posts as (SELECT id, user_id, description, location, EXTRACT(EPOCH FROM created_at) as timestamp FROM post WHERE EXTRACT(EPOCH FROM created_at) > {model_t["last_timestamp"]} AND deleted = false)
SELECT id, user_id, description, location, tag_ids, timestamp FROM tmp_posts LEFT JOIN top_tags tt on tt.post_id = id ORDER BY timestamp ASC;"""
        )
        posts = pd.DataFrame(
            cursor.fetchall(),
            columns=[
                "id",
                "user_id",
                "description",
                "location",
                "tag_ids",
                "timestamp",
            ],
        )  # A list() of tables.
        model_t["last_timestamp"] = str(posts["timestamp"].iloc[-1])
        posts.fillna({"tag_ids": ""}, inplace=True)
        conn.close()
        return posts


def execute_ratings_for_user_after(user_id, posts):
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
            f"""WITH comment_rating AS (SELECT DISTINCT user_id, post_id, 2 as rating
FROM comment WHERE deleted = false AND user_id = '{user_id}'),
like_rating as (SELECT user_id, post_id, 1 as rating from like_post WHERE user_id = '{user_id}')
SELECT r.user_id, r.post_id, r.rating FROM (SELECT user_id, post_id, SUM(rating) as rating FROM (SELECT * FROM comment_rating UNION SELECT * FROM like_rating)
GROUP BY user_id, post_id) r JOIN post p on r.user_id = p.user_id AND post_id = p.id WHERE EXTRACT(EPOCH FROM p.created_at) >= {str(posts["timestamp"].iloc[0])} AND EXTRACT(EPOCH FROM p.created_at) <= {str(posts["timestamp"].iloc[-1])};"""
        )
        ratings = pd.DataFrame(
            cursor.fetchall(), columns=["user_id", "post_id", "rating"]
        )  # A list() of tables.
        conn.close()
        return ratings


def execute_all_models(model_name):
    data = {}
    for f in glob.glob("models/" + model_name + "/" + "*.pickle"):
        data[os.path.basename(str(f).replace(".pickle", ""))] = load(
            str(f).replace(".pickle", "")
        )
    data["interactions"] = pd.read_csv(
        os.path.join("models", model_name, "interactions.csv")
    )
    return data


if __name__ == "__main__":
    execute_data()
