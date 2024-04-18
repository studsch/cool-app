import click
import yaml
import psycopg2
import pandas as pd
import os
import glob

#CONFIG interval

LIMIT_FETCH = 100000
#CONFIG most popular tegs

@click.command()
@click.option("--out", "-o", "output", default="data/ratings", help="path where need save ratings: 'data/ragings'", type=click.Path(exists=True), required=True)
@click.option("--col", "-c", "columns", default="user_id post_id", help="columns to execute: 'user_id post_id'", required=True)
@click.option("--like_table", "like_table", default="like_post", help="name of table: 'like_post'", required=True)
@click.option("--comment_table", "comment_table", default="comment", help="name of table: 'comment'", required=True)
def execute_ratings(output, columns, like_table, comment_table):
    data = None
    with open('../backend/config/config-docker.yaml') as f:
        data = yaml.load(f, Loader=yaml.FullLoader)
    if data and data["postgres"]:
        postgres = data["postgres"]
        conn = psycopg2.connect(host='localhost', dbname=postgres['DBName'], user=postgres['User'], password=postgres['Password'])
        cursor = conn.cursor()
        columns = columns.split()
        str_select = ", ".join(columns)
        cursor.execute(f"""WITH comment_rating AS (SELECT {str_select}, 2 as rating
FROM {comment_table} WHERE deleted = false),
like_rating as (SELECT {str_select}, 1 as rating from {like_table})
SELECT {str_select}, SUM(rating) as rating FROM (SELECT * FROM comment_rating UNION SELECT * FROM like_rating)
GROUP BY {str_select};""")
        columns.append('rating')
        tmp_res = []
        c = 0
        for f in glob.glob("data/ratings/ratings_[0-9]*.csv"):
            os.remove(f)
        for row in cursor:
            tmp_res.append(row)
            tmp_len = len(tmp_res)
            if tmp_len == LIMIT_FETCH:
                users = pd.DataFrame(tmp_res, columns=columns) # A list() of tables.
                users.to_csv(os.path.join(output, f"ratings_{c}.csv"), index=False)
                c += 1
                tmp_res = []
        if tmp_len < LIMIT_FETCH:
            users = pd.DataFrame(tmp_res, columns=columns) # A list() of tables.
            users.to_csv(os.path.join(output, f"ratings_{c}.csv"), index=False)
        conn.close()
    
if __name__ == "__main__":
    execute_ratings()