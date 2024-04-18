import click
import pandas as pd
import os
import sys
import glob
from lightfm import LightFM
from lightfm.data import Dataset
from lightfm.cross_validation import random_train_test_split
from lightfm.evaluation import precision_at_k, auc_score
sys.path.insert(1, 'src/logic/')
from features.FeaturesPreprocess import age_to_group
from utils import save_json, load
import json

import numpy as np

@click.command()
@click.option("--name", "-n", "name", default="rec-sys v1.0.0", help="name of model", required=True)

def train(name):
    md: LightFM = load(os.path.join("models", name, "model"))
    valid = load(os.path.join("models", name, "valid_data"))
    train = load(os.path.join("models", name, "train_data"))
    sm_user_features = load(os.path.join("models", name, "user_features"))
    sm_item_features = load(os.path.join("models", name, "item_features"))
    np_arr_prec = precision_at_k(md,
                             test_interactions=valid,
                             train_interactions=train,
                             user_features=sm_user_features,
                             item_features=sm_item_features)   
    mapk = round(np_arr_prec.mean(), 6)
    auc = round(auc_score(md, valid, train_interactions=train,user_features=sm_user_features,
                             item_features=sm_item_features, num_threads=2).mean(), 6)
    print(f'Results of {name}. AUC: {str(auc)}, MAP@K: {str(mapk)}' )
    save_json({"model": name, "metrics": {"AUC": str(auc), "MAP@K": str(mapk)}}, os.path.join("models", name, "metrics"))
if __name__ == "__main__":
    train()