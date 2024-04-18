import pickle
import json

def save_json(data, path):
    with open(path + '.json', 'w') as f:
        json.dump(data, f)
        
def load_json(path):
    with open(path + '.json', 'r') as f:
        return json.load(f)

def save(data, path):
    with open(path + '.pickle', 'wb') as fle:
        pickle.dump(data, fle, protocol=pickle.HIGHEST_PROTOCOL)
        
def load(path):
    with open(path + '.pickle', 'rb') as fle: 
        return pickle.load(fle) 