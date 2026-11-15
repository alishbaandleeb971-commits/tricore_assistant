import fs from "node:fs";
import path from "node:path";
import { v7 as uuidv7 } from "uuidv7";

interface SeedService {
  slug: string;
  name: string;
  sort: number;
  active: boolean;
}

interface SeedBudget {
  label: string;
  min: number;
  meets_hot_threshold?: boolean;
}

interface SeedTimeline {
  label: string;
  within_3_months: boolean;
}

interface SeedSettings {
  services: SeedService[];
  budget_ranges: {
    USD?: SeedBudget[];
    PKR?: SeedBudget[];
  };
  timeline_options: SeedTimeline[];
  [key: string]: unknown;
}

export function generateSeedSql(projectRoot: string): string {
  const settingsPath = path.join(projectRoot, "doc/08-seed/config/settings_seed.json");
  const rawSettings = fs.readFileSync(settingsPath, "utf-8");
  const settings: SeedSettings = JSON.parse(rawSettings);

  const statements: string[] = [];

  // 1. Seed Services
  for (const s of settings.services) {
    const id = uuidv7();
    const isActive = s.active ? 1 : 0;
    statements.push(
      `INSERT OR IGNORE INTO service (id, slug, name, description, is_active, sort_order) ` +
        `VALUES ('${id}', '${s.slug}', '${s.name}', '${s.name} service offering', ${isActive}, ${s.sort});`
    );
  }

  // 2. Seed Budget Ranges (USD and PKR)
  if (settings.budget_ranges.USD) {
    for (const b of settings.budget_ranges.USD) {
      const id = uuidv7();
      const meetsHot = b.meets_hot_threshold ? 1 : 0;
      statements.push(
        `INSERT OR IGNORE INTO budget_range (id, currency, label, min_amount, meets_hot_threshold) ` +
          `VALUES ('${id}', 'USD', '${b.label}', ${b.min}, ${meetsHot});`
      );
    }
  }

  if (settings.budget_ranges.PKR) {
    for (const b of settings.budget_ranges.PKR) {
      const id = uuidv7();
      const meetsHot = b.meets_hot_threshold ? 1 : 0;
      statements.push(
        `INSERT OR IGNORE INTO budget_range (id, currency, label, min_amount, meets_hot_threshold) ` +
          `VALUES ('${id}', 'PKR', '${b.label}', ${b.min}, ${meetsHot});`
      );
    }
  }

  // 3. Seed Timeline Options
  for (const t of settings.timeline_options) {
    const id = uuidv7();
    const within3 = t.within_3_months ? 1 : 0;
    statements.push(
      `INSERT OR IGNORE INTO timeline_option (id, label, within_3_months) ` +
        `VALUES ('${id}', '${t.label}', ${within3});`
    );
  }

  // 4. Seed Settings entries
  const now = Date.now();
  for (const [k, v] of Object.entries(settings)) {
    if (k === "_note") continue;
    const jsonVal = JSON.stringify(v).replace(/'/g, "''");
    statements.push(
      `INSERT OR REPLACE INTO setting (key, value, updated_at) VALUES ('${k}', '${jsonVal}', ${now});`
    );
  }

  // 5. Seed Consent Text
  statements.push(
    `INSERT OR IGNORE INTO consent_text (version, wording, approved_at) ` +
      `VALUES (1, 'I agree to TriCore Digital Tech contacting me regarding my inquiry.', ${now});`
  );

  return statements.join("\n");
}
