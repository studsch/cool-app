import click
import yaml
import psycopg2
import pandas as pd
import os

@click.command()
@click.option("--out", "-o", "output", default="data", help="path where need save users: '../data'", type=click.Path(exists=True), required=True)
@click.option("--col", "-c", "columns", default="id gender about city country birthday", help="columns to execute: 'id gender city'", required=True)
@click.option("--table", "-t", "table", default="users", help="name of table: 'users'", required=True)
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
        str_select = str_select.replace('birthday', "date_part('year',age(birthday))")
        cursor.execute(f"""SELECT {str_select} FROM {table};""") # "rel" is short for relation.
        users = pd.DataFrame(cursor.fetchall(), columns=columns) # A list() of tables.
        users.to_csv(os.path.join(output, "users.csv"), index=False)
        conn.close()
    
if __name__ == "__main__":
    execute_useres()