import pickle

def save(data, path):
    with open(path + '.pickle', 'wb') as fle:
        pickle.dump(data, fle, protocol=pickle.HIGHEST_PROTOCOL)
        
def load(path):
    with open(path + '.pickle', 'rb') as fle: 
        return pickle.load(fle, protocol=pickle.HIGHEST_PROTOCOL) 