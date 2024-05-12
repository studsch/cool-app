import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import {
  GetMostLikedTagByUserIdRequest,
  GetMostLikedTagByUserIdResponse,
  GetMostLikedUserInfoByUserIdRequest,
  GetMostLikedUserInfoByUserIdResponse,
  MiniUserInfo,
  TagInfo,
  WidgetsServiceServer,
} from "@widgets/protos/dist/widgets";
import * as db from "./db/postgres/queries";
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
        log.error(error);
        return null;
      }

      const [userInfo] = await db.getUserInfoMostLikedByUserId(currentUserId);
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
      callback({ code: status.INTERNAL }, null);
      log.error(err);
    }
  }
  async function getMostLikedTagByUserId(
    call: ServerUnaryCall<
      GetMostLikedTagByUserIdRequest,
      GetMostLikedTagByUserIdResponse
    >,
    callback: sendUnaryData<GetMostLikedTagByUserIdResponse>
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
        log.error(error);
        return null;
      }

      const [tag] = await db.getMostLikedTagByUserId(currentUserId);
      const tagInfo = TagInfo.create({
        id: tag.id,
        title: tag.title,
        count: Number(tag.count),
      });
      const response: GetMostLikedTagByUserIdResponse = {
        tagInfo: tagInfo,
      };
      callback(null, response);
      log.info({ tagInfo }, "operation completed successfully");
    } catch (err) {
      callback({ code: status.INTERNAL }, null);
      log.error(err);
    }
  }

  return { getMostLikedUserInfoByUserId, getMostLikedTagByUserId };
}
