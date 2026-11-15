import { applyD1Migrations, env } from "cloudflare:test";

declare module "cloudflare:test" {
  interface ProvidedEnv {
    TEST_MIGRATIONS: D1Migration[];
  }
}

// Automatically apply D1 migrations to the in-memory Miniflare D1 database before tests run
await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
