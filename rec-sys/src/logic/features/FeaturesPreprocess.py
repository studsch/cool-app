import pandas as pd

def age_to_group(users :pd.DataFrame, col_name: str):
    """Преобразует возраст в определенную группу например 0-18 группа возрастом от 0 до 18
    users: pd.Dataframe - датафрейм пользователей
    col_name: str - название колонки, где хранится возраст
    
    return:
        pd.DataFrame который подавался на вход, добавляет колонку группы и удаляет колонку age
    """
    if col_name in users.columns:
        groups = {"0-11": (0, 11),"12-17": (12, 17), "18-24": (18, 24), "25-34": (25, 34), "35-44": (35, 44), "45-54": (45, 54), "55-64": (55, 64), "64-100": (64, 100)}
        for group in groups:
            l, h = groups[group]
            users.loc[(l <= users[col_name]) & (users[col_name] <= h), col_name + "_group"] = group
        users = users.drop(col_name, axis=1)
        return users
    return users
    