import grpc
import sys

sys.path.insert(1, "src/proto/")
import dev_pb2
import dev_pb2_grpc
from google.protobuf.empty_pb2 import Empty


def run_client():
    # Устанавливаем соединение с gRPC-сервером
    with grpc.insecure_channel("localhost:50051") as channel:
        # Создаем клиентский объект для взаимодействия с сервисом RecSystem
        stub = dev_pb2_grpc.RecSystemStub(channel)

        # Создаем запрос PredictPostsForOneUser
        # request = dev_pb2.PredictPostsForOneUserRequest(
        #     user_id="cc384e9c-1bd4-4b61-853b-3833a316341c"
        # )

        # # Отправляем запрос и получаем ответ от сервера
        # response = stub.PredictPostsForOneUser(request)

        # stub.ExecuteDataToFiles(Empty())

        # Отправляем запрос и получаем ответ от сервера
        # response = stub.GetAllModelNamesOfFiles(Empty())

        # response = stub.SetModel(dev_pb2.SetModelRequest(name="rs v1.0.1", type=1))
        # response = stub.DeleteModelFromFiles(
        #     dev_pb2.DeleteModelFromFilesRequest(name="rs v1.0.1")
        # )

        response = stub.DeleteModelFromFiles(
            dev_pb2.DeleteModelFromFilesRequest(name="rs v1.0.1")
        )

        response = stub.TrainModel(
            dev_pb2.TrainModelRequest(name="rs v1.0.1", type=1, valid=True)
        )

        response = stub.ValidateModel(dev_pb2.ValidateModelRequest(name="rs v1.0.1"))

        request = dev_pb2.PredictPostsForOneUserRequest(
            user_id="cc384e9c-1bd4-4b61-853b-3833a316341c"
        )
        response = stub.PredictPostsForOneUser(request)
        # Обрабатываем ответ
        if response:
            print("Response received:")
            print(response)
            # print(response.result)
            # print(response.names)
            # Для предикта
            # for key, arr in response.data.items():
            #     print(f"Key: {key}Arr: {arr}")
        else:
            print("No response received.")


if __name__ == "__main__":
    run_client()
