import pandas as pd
import os
import sys
import glob
from lightfm import LightFM
from lightfm.data import Dataset
from lightfm.cross_validation import random_train_test_split
sys.path.insert(1, 'src/logic/')
from utils import save, load

import numpy as np



def predict_for_user(md: LightFM, user_id, posts, ds: Dataset, i_f, u_f):
    user_id_map, user_feature_map, item_id_map, feature_item_map = ds.mapping()
    try:
        user_id_map[user_id]
        
    except KeyError as e:
        pass
            
    list_scores = md.predict(user_id_map[user_id], )
    
    
    
# if __name__ == "__main__":
#     predict_for_user()