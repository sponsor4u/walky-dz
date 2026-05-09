import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import * as relations from "./relations";

const connectionString = process.env.DATABASE_URL!;

// Merge schema + relations
const fullSchema = { ...schema, ...relations };

// For queries
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema: fullSchema });

// For migrations
const migrationClient = postgres(connectionString, { max: 1 });
export const migrationDb = drizzle(migrationClient, { schema: fullSchema });
