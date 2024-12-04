import "dotenv/config";
import { drizzle, MySqlDatabase } from "drizzle-orm/mysql2";
import * as schema from "./schema/index";

export const db: MySqlDatabase<any, any, typeof schema> = drizzle({ connection: { uri: process.env.DATABASE_URL! }, logger: true });
