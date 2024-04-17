import click
import pandas as pd
import os
import sys
import glob
from lightfm import LightFM
from lightfm.data import Dataset
from lightfm.cross_validation import random_train_test_split
sys.path.insert(1, 'src')
from features.FeaturesPreprocess import age_to_group
from utils import save, load

import numpy as np

LEARNING_RATE = 0.25
NO_EPOCHS = 20
NO_COMPONENTS = 20  # Number of latent factorization
ITEM_ALPHA = 1e-6   # Regularization factor for item features
USER_ALPHA = 1e-6   # Regularization factor for user features    

@click.command()
@click.option("--out", "-o", "output", default="models", help="path where need save train models: 'models'", type=click.Path(exists=True), required=True)
@click.option("--users", "-u", "users", default="data/raw/users.csv", help="path to users.csv: 'data/raw/users.csv'", type=click.Path(exists=True), required=True)
@click.option("--posts", "-p", "posts", default="data/raw/posts.csv", help="path to users.csv: 'data/raw/posts.csv'", type=click.Path(exists=True), required=True)
@click.option("--ratings", "-r", "ratings", default="data/ratings", help="path to dir with ratings.csv: 'data/ratings'", type=click.Path(exists=True), required=True)
@click.option("--dataset", "-d", "dataset", help="path dataset: 'models/rec-sys v1.0.0/dataset.pickle'", type=click.Path(exists=True))
@click.option("--model", "-m", "model", help="path model: 'models/rec-sys v1.0.0/model.pickle'", type=click.Path(exists=True))
@click.option("--name", "-n", "name", default="rec-sys v1.0.0", help="name of model", required=True)
@click.option('--valid', '-v', is_flag=True, help="Split data to train and test and use for train only train data.")

def train(output, users, posts, ratings, name, dataset, model, valid):
    users = pd.read_csv(users)
    posts = pd.read_csv(posts)
    users = age_to_group(users, "age")
    series_tags_of_posts = posts["tag_ids"].str[1:-1].str.split(",") # получения серии с тэгами в типе список
    list_str_posts_tags_unique = list(set(np.concatenate(series_tags_of_posts).ravel())) # выделение уникальных тэгов
    p_userid_unique = posts['user_id'].unique()
    os.mkdir(os.path.join(output, name))
    if dataset and os.path.exists(dataset):
        ds: Dataset = load(dataset)
    else:
        ds = Dataset()
    ds.fit_partial(users=users['id'], items=posts['id'],
    item_features=np.concatenate((list_str_posts_tags_unique, p_userid_unique)),
    user_features=np.concatenate((users['gender'].unique(), users['city'].unique(), users['country'].unique(), users['age_group'].unique())))
    list_user_features = [(i,[g, c, cn, a]) for i,g,c,cn,a in zip(users['id'], users["gender"], users["city"], users['country'], users['age_group'])]
    sm_user_features = ds.build_user_features(list_user_features)
    list_item_features = [(i, np.concatenate((t, [ui]))) for i,t,ui in zip(posts['id'], series_tags_of_posts, posts['user_id'])]
    sm_item_features = ds.build_item_features(list_item_features)
    for f in glob.glob(os.path.join(ratings, "ratings_[0-9]*.csv")):
        rt = pd.read_csv(str(f))
        sm_interactions, sm_weights = ds.build_interactions(rt[["user_id","post_id","rating"]].values)
        # user_id_map, user_feature_map, item_id_map, feature_item_map = ds.mapping()
        if valid:
            sm_interactions, sm_test_interactions = random_train_test_split(sm_interactions, test_percentage=0.2, random_state=42)
            save(sm_test_interactions, os.path.join(output, name, "valid_data"))
        if model and os.path.exists(model):
            md: LightFM = load(model)
        else:
            md = LightFM(loss="warp",
                    no_components=NO_COMPONENTS, 
                    learning_rate=LEARNING_RATE, 
                    item_alpha=ITEM_ALPHA,
                    user_alpha=USER_ALPHA,
                    random_state=42)
        md.fit_partial(interactions=sm_interactions,
                user_features=sm_user_features,
                item_features=sm_item_features,
                epochs=NO_EPOCHS)
        save(md, os.path.join(output, name, "model"))
        save(ds, os.path.join(output, name, "dataset"))
        # print(list(user_id_map.values()))
        # print(md.predict(list(user_id_map.values())[0], list(item_id_map.values()), item_features=sm_item_features, user_features=sm_user_features))
    
if __name__ == "__main__":
    train()