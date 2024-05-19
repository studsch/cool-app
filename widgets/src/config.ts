import * as dotenv from "dotenv";

dotenv.config();

export const config = {
  grpc: {
    host: process.env.GRPC_HOST || "0.0.0.0",
    port: Number(process.env.GRPC_PORT) || 50051,
  },
  postgresql: {
    host: process.env.POSTGRES_HOST || "localhost",
    port: Number(process.env.POSTGRES_PORT) || 5432,
    user: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "postgres",
    db_name: process.env.POSTGRES_DB || "postgres",
    ssl: process.env.POSTGRES_SSL === "true" || false,
  },
};
