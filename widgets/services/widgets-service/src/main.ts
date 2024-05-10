import { Server, ServerCredentials } from "@grpc/grpc-js";
import { WidgetsServiceService } from "@widgets/protos/dist/widgets";
import { getWidgetServer } from "./server";

const server = new Server();
const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT) || 50051;

const address = `${HOST}:${PORT}`;

server.addService(WidgetsServiceService, getWidgetServer());

server.bindAsync(address, ServerCredentials.createInsecure(), (error, port) => {
  if (error) {
    console.error(error);
  }
  console.log("server is running on", port);
});
