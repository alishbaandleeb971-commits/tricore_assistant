import { describe, it, expect } from "vitest";
import { generateLeadsCsv, sanitizeCsvCell } from "../src/csvExport";

describe("Browser CSV Export with Formula Injection Protection (TASK-035)", () => {
  it("sanitizes dangerous spreadsheet formula prefixes (=, +, -, @)", () => {
    expect(sanitizeCsvCell("=SUM(A1:B1)")).toBe(`"'=SUM(A1:B1)"`);
    expect(sanitizeCsvCell("+12345")).toBe(`"'+12345"`);
    expect(sanitizeCsvCell("-500")).toBe(`"'-500"`);
    expect(sanitizeCsvCell("@command")).toBe(`"'@command"`);
    expect(sanitizeCsvCell("Normal Name")).toBe(`"Normal Name"`);
  });

  it("generates CSV with UTF-8 BOM and correct headers", () => {
    const csv = generateLeadsCsv([
      {
        id: "l-1",
        name: "Ali",
        email: "ali@example.com",
        phone: "+92 300 1234567",
        service: "AI Services",
        priority: "hot",
        currency: "USD",
        source: "assistant",
        createdAt: "2026-11-15T12:00:00Z"
      }
    ]);

    expect(csv.startsWith("\uFEFF")).toBe(true);
    expect(csv).toContain("Lead ID,Name,Email,Phone,Service");
    expect(csv).toContain('"Ali"');
    expect(csv).toContain('"hot"');
  });
});
