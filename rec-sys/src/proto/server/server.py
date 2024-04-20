import grpc
import sys

sys.path.insert(1, "src/proto/")
import dev_pb2_grpc
import dev_pb2

sys.path.insert(1, "src/logic/")
from utils import load
from predict.predict import predict_for_user
from data_execution.execute import execute_all_models
from concurrent import futures
import pandas as pd


class RecSystemServicer(dev_pb2_grpc.RecSystemServicer):
    def __init__(self) -> None:
        self.models = {
            "model_t1": execute_all_models("rs v1.0.1"),
            "model_t2": execute_all_models("rs v1.0.2"),
            "model_t3": execute_all_models("rs v1.0.3"),
        }
        super().__init__()

    def PredictPostsForOneUser(self, request, context):
        predict_for_user(
            self.models, "5f0d48eb-d6b9-49a9-b0e7-eba9cd7d5d3a"
        )  # нет пользователя 5f0d48eb-d6b9-49a9-b0e7-eba9cd7d5d3a, есть 2c0dcabb-8260-4b7f-81f0-92913727cada
        return dev_pb2.PredictPostsForOneUserResponse(post_id=request.post_id)


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    dev_pb2_grpc.add_RecSystemServicer_to_server(RecSystemServicer(), server)
    server.add_insecure_port("[::]:50051")
    server.start()
    print("server start")
    server.wait_for_termination()


if __name__ == "__main__":
    serve()
