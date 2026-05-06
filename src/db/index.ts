import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;

if (!url) {
  console.warn(
    "[bosque] DATABASE_URL not set. DB queries will throw at runtime. " +
      "The homepage works without DB; /tienda, carrito and admin require it.",
  );
}

const sql = neon(url ?? "postgres://invalid:invalid@localhost:5432/invalid");

export const db = drizzle(sql, { schema });
export * from "./schema";

export const isDbConfigured = Boolean(url);
