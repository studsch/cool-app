import grpc
import sys
sys.path.insert(1, 'src/proto/')
import dev_pb2
import dev_pb2_grpc

def run_client():
    # Устанавливаем соединение с gRPC-сервером
    with grpc.insecure_channel('localhost:50051') as channel:
        # Создаем клиентский объект для взаимодействия с сервисом RecSystem
        stub = dev_pb2_grpc.RecSystemStub(channel)
        
        # Создаем запрос PredictPostsForOneUser
        request = dev_pb2.PredictPostsForOneUserRequest(
            user_id="cc384e9c-1bd4-4b61-853b-3833a316341c",
            post_id=["8afa9da1-8a4c-4c06-9183-cf94d78dfb27", "6d2cb977-dc1c-4385-a21b-b9db8a6d57db"]
        )
        
        # Отправляем запрос и получаем ответ от сервера
        response = stub.PredictPostsForOneUser(request)
        
        # Обрабатываем ответ
        if response:
            print("Response received:")
            for post_id in response.post_id:
                print(post_id)
        else:
            print("No response received.")

if __name__ == '__main__':
    run_client()