import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

config({ path: ".env.local" });
config({ path: ".env" });

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  const sql = neon(url);

  const dir = "drizzle";
  const files = readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    console.log("No SQL migrations found");
    return;
  }

  for (const file of files) {
    console.log(`Applying ${file}...`);
    const content = readFileSync(join(dir, file), "utf8");
    const statements = content
      .split(/-->\s*statement-breakpoint/gi)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const stmt of statements) {
      try {
        await sql.query(stmt);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (msg.includes("already exists")) {
          console.log(`  - skipped (exists): ${stmt.slice(0, 60)}...`);
          continue;
        }
        console.error(`  - FAILED: ${stmt.slice(0, 80)}`);
        console.error(`    ${msg}`);
        process.exit(1);
      }
    }
  }

  console.log("Migrations done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
