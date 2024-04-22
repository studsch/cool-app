import pickle
import json
import os
import shutil


def save_json(data, path):
    with open(path + ".json", "w") as f:
        json.dump(data, f)


def load_json(path):
    with open(path + ".json", "r") as f:
        return json.load(f)


def save(data, path):
    with open(path + ".pickle", "wb") as fle:
        pickle.dump(data, fle, protocol=pickle.HIGHEST_PROTOCOL)


def load(path):
    with open(path + ".pickle", "rb") as fle:
        return pickle.load(fle)


def get_subdirectories(path):
    subdirectories = [
        d for d in os.listdir(path) if os.path.isdir(os.path.join(path, d))
    ]
    return subdirectories


def delete_file(file_path):
    if os.path.exists(file_path):
        os.remove(file_path)


def delete_directory(directory_path):
    if os.path.exists(directory_path):
        shutil.rmtree(directory_path)
