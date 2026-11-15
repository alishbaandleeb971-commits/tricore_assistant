import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./apps/worker/src/db/schema.ts",
  out: "./migrations",
  dialect: "sqlite"
});
