import grpc
import sys
sys.path.insert(1, 'src/proto/')
import dev_pb2_grpc
import dev_pb2
sys.path.insert(1, 'src/logic/')
from utils import load
from concurrent import futures

class RecSystemServicer(dev_pb2_grpc.RecSystemServicer):
    def __init__(self) -> None:
        self.md = load("models/rec-model v1.0.0/model")
        self.ds = load("models/rec-model v1.0.0/dataset")
        self.i_f = load("models/rec-model v1.0.0/item_features")
        self.u_f = load("models/rec-model v1.0.0/user_features")
        super().__init__()
    
    def PredictPostsForOneUser(self, request, context):
        print(f"request {request.post_id}")
        return dev_pb2.PredictPostsForOneUserResponse(post_id=request.post_id)

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    dev_pb2_grpc.add_RecSystemServicer_to_server(RecSystemServicer(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    print("server start")
    server.wait_for_termination()

if __name__ == '__main__':
    serve()