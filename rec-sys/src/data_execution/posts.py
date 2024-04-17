import click
import yaml
import psycopg2
import pandas as pd
import os

#CONFIG interval
INTERVAL = '1 months'
TAGS_LIMIT = 2
#CONFIG most popular tegs

@click.command()
@click.option("--out", "-o", "output", default="data/raw", help="path where need save posts: 'data/raw'", type=click.Path(exists=True), required=True)
@click.option("--col", "-c", "columns", default="id user_id description tag_ids created_at", help="columns to execute: 'id user_id description created_at image_urls'", required=True)
@click.option("--table", "-t", "table", default="post", help="name of table: 'posts'", required=True)
def execute_posts(output, columns, table):
    data = None
    with open('../backend/config/config-docker.yaml') as f:
        data = yaml.load(f, Loader=yaml.FullLoader)
    if data and data["postgres"]:
        postgres = data["postgres"]
        conn = psycopg2.connect(host='localhost', dbname=postgres['DBName'], user=postgres['User'], password=postgres['Password'])
        cursor = conn.cursor()
        columns = columns.split()
        str_select = ", ".join(columns)
        str_select = str_select.replace("created_at", "EXTRACT(EPOCH FROM created_at )")
        cursor.execute(f"""WITH top_tags as (SELECT post_id, ARRAY_AGG(tag_id) as tag_ids from post_tags WHERE tag_id IN (SELECT tag_id from (SELECT tag_id, count(distinct (tag_id, post_id)) as unique_tags
	FROM post_tags
	GROUP BY tag_id
	ORDER By unique_tags DESC limit {TAGS_LIMIT})) GROUP BY post_id)
SELECT {str_select} FROM {table} JOIN top_tags tt ON tt.post_id = id WHERE created_at >= CURRENT_DATE - INTERVAL '{INTERVAL}' AND deleted = false""")
        users = pd.DataFrame(cursor.fetchall(), columns=columns) # A list() of tables.
        users.to_csv(os.path.join(output, "posts.csv"), index=False)
        conn.close()
    
if __name__ == "__main__":
    execute_posts()