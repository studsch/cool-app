import { Server, ServerCredentials } from "@grpc/grpc-js";
import { WidgetsServiceService } from "./protos/widgets";
import { getWidgetServer } from "./server";
import { config } from "./config";
import logger from "./logger";

const server = new Server();

const address = `${config.grpc.host}:${config.grpc.port}`;

server.addService(WidgetsServiceService, getWidgetServer());

server.bindAsync(address, ServerCredentials.createInsecure(), (error, port) => {
  if (error) {
    logger.error(error);
  }
  logger.info(`server is running on port: ${port}`);
});
