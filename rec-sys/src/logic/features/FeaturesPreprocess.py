import pandas as pd
from sklearn.preprocessing import OneHotEncoder
from scipy.sparse import csr_matrix, vstack, hstack


def age_to_group(users: pd.DataFrame, col_name: str):
    """Преобразует возраст в определенную группу например 0-18 группа возрастом от 0 до 18
    users: pd.Dataframe - датафрейм пользователей
    col_name: str - название колонки, где хранится возраст

    return:
        pd.DataFrame который подавался на вход, добавляет колонку группы и удаляет колонку age
    """
    if col_name in users.columns:
        groups = {
            "0-11": (0, 11),
            "12-17": (12, 17),
            "18-24": (18, 24),
            "25-34": (25, 34),
            "35-44": (35, 44),
            "45-54": (45, 54),
            "55-64": (55, 64),
            "64-100": (64, 100),
        }
        for group in groups:
            l, h = groups[group]
            users.loc[
                (l <= users[col_name]) & (users[col_name] <= h), col_name + "_group"
            ] = group
        users = users.drop(col_name, axis=1)
        return users
    return users


def add_user(
    users, encoder, user_features, columns=["gender", "city", "country", "age_group"]
):
    users = age_to_group(users, "age")
    for user in users[columns].values:
        add_feature = []
        for feature_idx in range(len(encoder.categories_)):
            for type_f in encoder.categories_[feature_idx]:
                if user[feature_idx] == type_f:
                    add_feature.append(1)
                else:
                    add_feature.append(0)
        user_features = vstack([user_features, csr_matrix(add_feature)])
    return user_features


def add_posts(posts, mlb_tags, mlb_user_id, item_features):
    series_tags_of_posts = posts["tag_ids"].str[1:-1].str.split(",")
    encoded_tags = mlb_tags.transform(series_tags_of_posts)
    encoded_user_id = mlb_user_id.transform([[uid] for uid in zip(posts["user_id"])])
    sm_item_features = hstack([csr_matrix(encoded_tags), csr_matrix(encoded_user_id)])
    item_features = vstack([item_features, sm_item_features])
    return item_features
