import { format, isValid, parseISO } from "date-fns";

/** Backend: Draft=1, Published=2, Archive=3 */
export type LandingPageStatusCategory = "draft" | "published" | "archive";

export type LandingPageDisplayRow = {
  id: number;
  /** Displayed default_lang/defaultLang value. Kept as `language` for table compatibility. */
  language: string;
  title: string;
  statusCategory: LandingPageStatusCategory;
  statusLabel: string;
  createdAtLabel: string;
};

const NUMERIC_STATUS: Record<number, LandingPageStatusCategory> = {
  1: "draft",
  2: "published",
  3: "archive",
};

function parseStatus(value: unknown): LandingPageStatusCategory {
  if (typeof value === "number" && Number.isFinite(value)) {
    const m = NUMERIC_STATUS[value];
    if (m) return m;
  }
  const s = String(value ?? "")
    .trim()
    .toLowerCase();
  if (s.includes("archive")) return "archive";
  if (s.includes("publish")) return "published";
  if (s.includes("draft")) return "draft";
  return "draft";
}

function statusLabel(cat: LandingPageStatusCategory): string {
  const labels: Record<LandingPageStatusCategory, string> = {
    draft: "Draft",
    published: "Published",
    archive: "Archived",
  };
  return labels[cat];
}

function formatCreatedAt(raw: unknown): string {
  if (typeof raw !== "string" || !raw.trim()) return "—";
  const d = parseISO(raw);
  if (!isValid(d)) return raw;
  return format(d, "MMM d, yyyy HH:mm");
}

export function normalizeLandingPageRow(
  row: Record<string, unknown>,
  index: number,
): LandingPageDisplayRow | null {
  const rawId = row.id ?? row.landingPageId;
  const id =
    typeof rawId === "number"
      ? rawId
      : typeof rawId === "string"
        ? Number(rawId)
        : NaN;
  if (!Number.isFinite(id)) return null;

  const title =
    typeof row.title === "string" ? row.title : `Landing page ${index + 1}`;
  const language =
    typeof row.defaultLang === "string"
      ? row.defaultLang
      : typeof row.default_lang === "string"
        ? row.default_lang
        : typeof row.language === "string"
          ? row.language
          : "—";
  const statusCategory = parseStatus(row.status);
  const createdRaw =
    row.createdAt ??
    row.created_at ??
    row.createTime ??
    row.created_time;

  return {
    id,
    language,
    title,
    statusCategory,
    statusLabel: statusLabel(statusCategory),
    createdAtLabel: formatCreatedAt(createdRaw),
  };
}

export function normalizeLandingPageRows(
  rows: Record<string, unknown>[],
): LandingPageDisplayRow[] {
  return rows
    .map((r, i) => normalizeLandingPageRow(r, i))
    .filter((r): r is LandingPageDisplayRow => r != null);
}
