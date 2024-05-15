import postgres from "postgres";
import { config } from "../../config";

const db = postgres({
  user: config.postgresql.user,
  password: config.postgresql.password,
  host: config.postgresql.host,
  port: config.postgresql.port,
  db: config.postgresql.db_name,
  ssl: config.postgresql.ssl,
});

export default db;
