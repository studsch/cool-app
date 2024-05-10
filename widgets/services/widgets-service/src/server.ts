import { ServerUnaryCall, sendUnaryData, status } from "@grpc/grpc-js";
import {
  GetMostLikedUserInfoByUserIdRequest,
  GetMostLikedUserInfoByUserIdResponse,
  WidgetsServiceServer,
} from "@widgets/protos/dist/widgets";

export function getWidgetServer(): WidgetsServiceServer {
  async function getMostLikedUserInfoByUserId(
    call: ServerUnaryCall<
      GetMostLikedUserInfoByUserIdRequest,
      GetMostLikedUserInfoByUserIdResponse
    >,
    callback: sendUnaryData<GetMostLikedUserInfoByUserIdResponse>
  ) {
    console.log("qweqwe");
    try {
      console.log("nice try");
    } catch (err) {
      callback({ code: status.INTERNAL }, null);
      console.error(err);
    }
  }
  return { getMostLikedUserInfoByUserId };
}
