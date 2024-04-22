import pandas as pd
import os
import sys
import glob
from lightfm import LightFM
from lightfm.data import Dataset
from lightfm.cross_validation import random_train_test_split

sys.path.insert(1, "src/logic/")
from features.FeaturesPreprocess import age_to_group
from utils import save, load
from sklearn.preprocessing import OneHotEncoder
from sklearn.preprocessing import MultiLabelBinarizer
from scipy.sparse import csr_matrix, hstack
import numpy as np

LEARNING_RATE = 0.25
NO_EPOCHS = 20
NO_COMPONENTS = 20  # Number of latent factorization
ITEM_ALPHA = 1e-6  # Regularization factor for item features
USER_ALPHA = 1e-6  # Regularization factor for user features


def train(name, type_t, valid=False):
    users = pd.read_csv("data/raw/users.csv")
    posts = pd.read_csv("data/raw/posts.csv")
    users = age_to_group(users, "age")
    os.mkdir(os.path.join("models", name))
    ds = Dataset()
    series_tags_of_posts = (
        posts["tag_ids"].str[1:-1].str.split(", ")
    )  # получения серии с тэгами в типе список
    if type_t != 3:
        list_str_posts_tags_unique = list(
            set(np.concatenate(series_tags_of_posts).ravel())
        )  # выделение уникальных тэгов
        p_userid_unique = posts["user_id"].unique()
        ds.fit_partial(
            users=users["id"],
            items=posts["id"],
            item_features=np.concatenate((list_str_posts_tags_unique, p_userid_unique)),
            user_features=np.concatenate(
                (
                    users["gender"].unique(),
                    users["city"].unique(),
                    users["country"].unique(),
                    users["age_group"].unique(),
                )
            ),
        )
        if type_t == 1:
            list_user_features = [
                (i, [g, c, cn, a])
                for i, g, c, cn, a in zip(
                    users["id"],
                    users["gender"],
                    users["city"],
                    users["country"],
                    users["age_group"],
                )
            ]
            sm_user_features = ds.build_user_features(list_user_features)
        else:
            encoder = OneHotEncoder()
            encoded_data = encoder.fit_transform(
                [[row[1], row[3], row[4], row[5]] for row in users.values]
            )
            sm_user_features = csr_matrix(encoded_data)
            save(encoder, os.path.join("models", name, "user_encoder"))
        list_item_features = [
            (i, np.concatenate((t, [ui])))
            for i, t, ui in zip(posts["id"], series_tags_of_posts, posts["user_id"])
        ]
        sm_item_features = ds.build_item_features(list_item_features)
    else:
        ds.fit_partial(users=users["id"], items=posts["id"])
        encoder = OneHotEncoder()
        encoded_data = encoder.fit_transform(
            [[row[1], row[3], row[4], row[5]] for row in users.values]
        )
        sm_user_features = csr_matrix(encoded_data)
        save(encoder, os.path.join("models", name, "user_encoder"))
        mlb = MultiLabelBinarizer()
        encoded_tags = mlb.fit_transform(series_tags_of_posts)
        mlb_user_id = MultiLabelBinarizer()
        encoded_user_id = mlb_user_id.fit_transform(
            [[uid] for uid in zip(posts["user_id"])]
        )
        sm_item_features = hstack(
            [csr_matrix(encoded_tags), csr_matrix(encoded_user_id)]
        )
        save(mlb, os.path.join("models", name, "mlb_tags"))
        save(mlb_user_id, os.path.join("models", name, "mlb_user_id"))
    md = LightFM(
        loss="warp",
        no_components=NO_COMPONENTS,
        learning_rate=LEARNING_RATE,
        item_alpha=ITEM_ALPHA,
        user_alpha=USER_ALPHA,
        random_state=42,
    )
    dict_inter = {"users": [], "posts": []}
    for f in glob.glob(os.path.join("data/ratings", "ratings_[0-9]*.csv")):
        rt = pd.read_csv(str(f))
        sm_interactions, sm_weights = ds.build_interactions(
            rt[["user_id", "post_id", "rating"]].values
        )
        dict_inter["users"] = np.concatenate([dict_inter["users"], sm_interactions.row])
        dict_inter["posts"] = np.concatenate([dict_inter["posts"], sm_interactions.col])
        # user_id_map, user_feature_map, item_id_map, feature_item_map = ds.mapping()
        if valid:
            sm_interactions, sm_test_interactions = random_train_test_split(
                sm_interactions, test_percentage=0.2, random_state=42
            )
            save(sm_test_interactions, os.path.join("models", name, "valid_data"))
            save(sm_interactions, os.path.join("models", name, "train_data"))
        md.fit_partial(
            interactions=sm_interactions,
            user_features=sm_user_features,
            item_features=sm_item_features,
            epochs=NO_EPOCHS,
        )
    save(md, os.path.join("models", name, "model"))
    save(ds, os.path.join("models", name, "dataset"))
    save(sm_user_features, os.path.join("models", name, "user_features"))
    tmp_pd = pd.DataFrame(columns=["users", "posts"])
    tmp_pd["users"] = dict_inter["users"]
    tmp_pd["posts"] = dict_inter["posts"]
    tmp_pd.to_csv(os.path.join("models", name, "interactions.csv"), index=False)
    save(sm_item_features, os.path.join("models", name, "item_features"))
    # print(list(user_id_map.values()))
    # print(md.predict(list(user_id_map.values())[0], list(item_id_map.values()), item_features=sm_item_features, user_features=sm_user_features))
