import glob
import yaml
import psycopg2
import pandas as pd
import os
import sys
sys.path.insert(1, 'src/logic/')
from utils import save_json
import json

#CONFIG interval
INTERVAL = '1 months'
TAGS_LIMIT = 10000
LIMIT_FETCH = 100000
#CONFIG most popular tegs


def execute_data():
    data = None
    with open('../backend/config/config-docker.yaml') as f:
        data = yaml.load(f, Loader=yaml.FullLoader)
    if data and data["postgres"]:
        postgres = data["postgres"]
        conn = psycopg2.connect(host='localhost', dbname=postgres['DBName'], user=postgres['User'], password=postgres['Password'])
        cursor = conn.cursor()
        cursor.execute(f"""DROP VIEW IF EXISTS posts;
CREATE VIEW posts AS SELECT id, user_id, description, location, EXTRACT(EPOCH FROM created_at) as timestamp FROM post WHERE created_at >= CURRENT_DATE - INTERVAL '{INTERVAL}' AND deleted = false;
WITH top_tags as (SELECT post_id, ARRAY_AGG(tag_id) as tag_ids from post_tags WHERE tag_id IN (SELECT tag_id from (SELECT tag_id, count(distinct (tag_id, post_id)) as unique_tags
	FROM post_tags
	GROUP BY tag_id
	ORDER By unique_tags DESC limit {TAGS_LIMIT})) GROUP BY post_id)
SELECT id, user_id, description, location, tag_ids, timestamp FROM posts JOIN top_tags tt on tt.post_id = id ORDER BY timestamp ASC;""")
        posts = pd.DataFrame(cursor.fetchall(), columns=["id", "user_id", "description", "location", "tag_ids", "timestamp"]) # A list() of tables.
        posts.to_csv(os.path.join("data/raw", "posts.csv"), index=False)
        save_json({"last_timestamp": str(posts['timestamp'].iloc[-1])}, "data/last_timestamp")
        cursor.execute(f"""SELECT id, gender, about, city, country, date_part('year',age(birthday)) as age FROM users;""")
        users = pd.DataFrame(cursor.fetchall(), columns=["id", "gender", "about", "city", "country", "age"]) # A list() of tables.
        users.to_csv(os.path.join("data/raw", "users.csv"), index=False)
        cursor.execute(f"""WITH comment_rating AS (SELECT user_id, post_id, 2 as rating
FROM comment WHERE deleted = false),
like_rating as (SELECT user_id, post_id, 1 as rating from like_post)
SELECT r.user_id, r.post_id, r.rating FROM (SELECT user_id, post_id, SUM(rating) as rating FROM (SELECT * FROM comment_rating UNION SELECT * FROM like_rating)
GROUP BY user_id, post_id) r JOIN posts p on r.user_id = p.user_id AND post_id = p.id;""")
        tmp_res = []
        c = 0
        for f in glob.glob("data/ratings/ratings_[0-9]*.csv"):
            os.remove(f)
        for row in cursor:
            tmp_res.append(row)
            tmp_len = len(tmp_res)
            if tmp_len == LIMIT_FETCH:
                ratings = pd.DataFrame(tmp_res, columns=["user_id", "post_id", "rating"]) # A list() of tables.
                ratings.to_csv(os.path.join("data/ratings", f"ratings_{c}.csv"), index=False)
                c += 1
                tmp_res = []
        if tmp_len < LIMIT_FETCH:
            ratings = pd.DataFrame(tmp_res, columns=["user_id", "post_id", "rating"]) # A list() of tables.
            ratings.to_csv(os.path.join("data/ratings", f"ratings_{c}.csv"), index=False)
        conn.close()
    
if __name__ == "__main__":
    execute_data()