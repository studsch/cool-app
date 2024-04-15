import click
import yaml
import psycopg2
import pandas as pd
import os

@click.command()
@click.option("--out", "-o", "output", default="data", help="path where need save posts: '../data'", type=click.Path(exists=True), required=True)
@click.option("--col", "-c", "columns", default="id user_id description created_at", help="columns to execute: 'id user_id description created_at image_urls'", required=True)
@click.option("--table", "-t", "table", default="post", help="name of table: 'posts'", required=True)
def execute_useres(output, columns, table):
    data = None
    with open('../backend/config/config-docker.yaml') as f:
        data = yaml.load(f, Loader=yaml.FullLoader)
    if data and data["postgres"]:
        postgres = data["postgres"]
        conn = psycopg2.connect(host='localhost', dbname=postgres['DBName'], user=postgres['User'], password=postgres['Password'])
        cursor = conn.cursor()
        columns = columns.split()
        str_select = ", ".join(columns)
        cursor.execute(f"""SELECT {str_select} FROM {table};""") # "rel" is short for relation.
        users = pd.DataFrame(cursor.fetchall(), columns=columns) # A list() of tables.
        users.to_csv(os.path.join(output, "posts.csv"), index=False)
        conn.close()
    
if __name__ == "__main__":
    execute_useres()