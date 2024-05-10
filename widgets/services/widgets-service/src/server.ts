import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import {
  GetMostLikedUserInfoByUserIdRequest,
  GetMostLikedUserInfoByUserIdResponse,
  MiniUserInfo,
  WidgetsServiceServer,
} from "@widgets/protos/dist/widgets";
import { getUserInfoMostLikedByUserID } from "./db/postgres/queries";
import { validate } from "uuid";
import logger from "./logger";

export function getWidgetServer(): WidgetsServiceServer {
  async function getMostLikedUserInfoByUserId(
    call: ServerUnaryCall<
      GetMostLikedUserInfoByUserIdRequest,
      GetMostLikedUserInfoByUserIdResponse
    >,
    callback: sendUnaryData<GetMostLikedUserInfoByUserIdResponse>
  ) {
    const req = call.request;
    const log = logger.child({
      serviceName: "getMostLikedUserInfoByUserId",
      request: req,
    });

    try {
      const currentUserId = req.currentUserId;
      if (!validate(currentUserId)) {
        const error = Error("cannot validate currentUserId to uuid");
        log.error(error);
        callback(
          { code: status.INVALID_ARGUMENT, message: error.message },
          null
        );
        return null;
      }
      const [userInfo] = await getUserInfoMostLikedByUserID(currentUserId);
      const miniUserInfo = MiniUserInfo.create({
        id: userInfo.id,
        firstName: userInfo.first_name,
        lastName: userInfo.last_name,
        login: userInfo.login,
        avatar: userInfo.avatar,
      });
      const response: GetMostLikedUserInfoByUserIdResponse = {
        userInfo: miniUserInfo,
      };
      callback(null, response);
      log.info({ miniUserInfo }, "operation completed successfully");
    } catch (err) {
      log.error(err);
      callback({ code: status.INTERNAL }, null);
    }
  }

  return { getMostLikedUserInfoByUserId };
}
