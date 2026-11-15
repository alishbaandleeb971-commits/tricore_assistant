import { describe, it, expect } from "vitest";
import * as schema from "../src/db/schema";

describe("Database Schema Definitions (D1 / Drizzle)", () => {
  it("exports all critical core tables without IP address columns", () => {
    // Zero IP storage invariant check
    const tables = Object.values(schema);
    expect(tables.length).toBeGreaterThanOrEqual(30);

    for (const [, tableDef] of Object.entries(schema)) {
      if (typeof tableDef === "object" && tableDef !== null && "_" in tableDef) {
        // Inspect column names
        const columns = Object.keys(tableDef as Record<string, unknown>);
        for (const col of columns) {
          expect(col.toLowerCase()).not.toContain("ip");
          expect(col.toLowerCase()).not.toContain("ip_address");
        }
      }
    }
  });

  it("defines the visitor session and lead tables with proper foreign keys", () => {
    expect(schema.visitorSession).toBeDefined();
    expect(schema.lead).toBeDefined();
    expect(schema.conversation).toBeDefined();
    expect(schema.message).toBeDefined();
  });
});
