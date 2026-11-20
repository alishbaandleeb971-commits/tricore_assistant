export interface LeadRowForExport {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  service: string;
  priority: string;
  currency: string;
  source: string;
  createdAt: string;
}

/**
 * Sanitize cell to protect against spreadsheet formula injection attacks (=, +, -, @)
 */
export function sanitizeCsvCell(value: string | null | undefined): string {
  if (value === null || value === undefined) return "";
  let str = String(value);

  // If first character is a formula trigger, prepend single quote
  if (/^[=+\-@]/.test(str)) {
    str = `'${str}`;
  }

  // Escape double quotes
  return `"${str.replace(/"/g, '""')}"`;
}

export function generateLeadsCsv(leads: LeadRowForExport[]): string {
  // UTF-8 BOM so Excel opens UTF-8 properly
  const bom = "\uFEFF";
  const headers = ["Lead ID", "Name", "Email", "Phone", "Service", "Priority", "Currency", "Source", "Date Created"];

  const rows = leads.map((l) => [
    sanitizeCsvCell(l.id),
    sanitizeCsvCell(l.name),
    sanitizeCsvCell(l.email),
    sanitizeCsvCell(l.phone),
    sanitizeCsvCell(l.service),
    sanitizeCsvCell(l.priority),
    sanitizeCsvCell(l.currency),
    sanitizeCsvCell(l.source),
    sanitizeCsvCell(l.createdAt)
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
  return bom + csvContent;
}
