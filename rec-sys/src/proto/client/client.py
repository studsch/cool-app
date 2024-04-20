import grpc
import sys

sys.path.insert(1, "src/proto/")
import dev_pb2
import dev_pb2_grpc


def run_client():
    # Устанавливаем соединение с gRPC-сервером
    with grpc.insecure_channel("localhost:50051") as channel:
        # Создаем клиентский объект для взаимодействия с сервисом RecSystem
        stub = dev_pb2_grpc.RecSystemStub(channel)

        # Создаем запрос PredictPostsForOneUser
        request = dev_pb2.PredictPostsForOneUserRequest(
            user_id="cc384e9c-1bd4-4b61-853b-3833a316341c"
        )

        # Отправляем запрос и получаем ответ от сервера
        response = stub.PredictPostsForOneUser(request)

        # Обрабатываем ответ
        if response:
            print("Response received:")
            for key, arr in response.data.items():
                print(f"Key: {key} Arr: {arr}")
        else:
            print("No response received.")


if __name__ == "__main__":
    run_client()
