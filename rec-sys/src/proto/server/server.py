import grpc
import sys
import yaml

sys.path.insert(1, "src/proto/")
import dev_pb2_grpc
import dev_pb2

sys.path.insert(1, "src/logic/")
from utils import load, get_subdirectories, delete_directory
from predict.predict import predict_for_user
from train.train import train
from eval.evaluate import eval
from data_execution.execute import execute_all_models, execute_data
from concurrent import futures
import pandas as pd
from google.protobuf.empty_pb2 import Empty


class RecSystemServicer(dev_pb2_grpc.RecSystemServicer):
    def __init__(self) -> None:
        self.models = {
            "model_t1": None,
            "model_t2": None,
            "model_t3": None,
        }
        # execute_all_models("rs v1.0.2")
        super().__init__()

    def PredictPostsForOneUser(self, request, context):
        all = predict_for_user(self.models, request.user_id)
        response = dev_pb2.PredictPostsForOneUserResponse()
        for a_key in all:
            string_array = dev_pb2.StringArray()
            string_array.values.extend(all[a_key])
            response.data[a_key].CopyFrom(string_array)
        return response

    def ExecuteDataToFiles(self, request, context):
        print("ExecuteDataToFiles")
        execute_data()
        return Empty()

    def GetAllModelNamesOfFiles(self, request, context):
        print("GetsAllModelNamesOfFiles")
        models = get_subdirectories("models")
        return dev_pb2.GetAllModelNamesOfFilesResponse(names=models)

    def SetModel(self, request, context):
        print("SetModel")
        self.models["model_t" + str(request.type)] = execute_all_models(request.name)
        return Empty()

    def DeleteModelFromFiles(self, request, context):
        print("DeleteModelFromFiles")
        delete_directory("models/" + request.name)
        return Empty()

    def TrainModel(self, request, context):
        print("TrainModelRequest")
        train(request.name, request.type, request.valid)
        return Empty()

    def ValidateModel(self, request, context):
        print("ValidateModel")
        result = eval(request.name)
        return dev_pb2.ValidateModelResponse(result=result)


def serve():
    with open("config/config.yaml") as f:
        data = yaml.load(f, Loader=yaml.FullLoader)
    if data and data["grpc_python_server"]:
        server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
        dev_pb2_grpc.add_RecSystemServicer_to_server(RecSystemServicer(), server)
        server.add_insecure_port("[::]:" + str(data["grpc_python_server"]["Port"]))
        server.start()
        print("server start")
        server.wait_for_termination()


if __name__ == "__main__":
    serve()
