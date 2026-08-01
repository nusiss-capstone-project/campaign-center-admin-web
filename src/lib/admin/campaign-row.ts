import { format, isValid } from "date-fns";

/** Backend: CampaignStatusDraft=1, CampaignStatusPublished=2 */
export type CampaignStatusCategory = "draft" | "published";

export type CampaignDisplayRow = {
  id: number;
  name: string;
  version: number | null;
  market: string;
  statusCategory: CampaignStatusCategory;
  statusLabel: string;
  periodLabel: string;
};

const NUMERIC_STATUS: Record<number, CampaignStatusCategory> = {
  1: "draft",
  2: "published",
};

function parseStatusCategory(value: unknown): CampaignStatusCategory {
  if (typeof value === "number" && Number.isFinite(value)) {
    const mapped = NUMERIC_STATUS[value];
    if (mapped) return mapped;
  }
  const s = String(value ?? "")
    .trim()
    .toLowerCase();
  if (s.includes("publish")) return "published";
  return "draft";
}

function statusLabelFor(category: CampaignStatusCategory): string {
  return category === "published" ? "Published" : "Draft";
}

function toEpochMs(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value < 1e12 ? value * 1000 : value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    if (Number.isFinite(n)) return toEpochMs(n);
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d.getTime();
  }
  return null;
}

function formatPeriod(start?: unknown, end?: unknown): string {
  const sMs = toEpochMs(start);
  const eMs = toEpochMs(end);
  if (sMs == null || eMs == null) return "—";
  const s = new Date(sMs);
  const e = new Date(eMs);
  if (!isValid(s) || !isValid(e)) return "—";
  return `${format(s, "MMM d, yyyy")} — ${format(e, "MMM d, yyyy")}`;
}

function pickVersion(row: Record<string, unknown>): number | null {
  const v = row.version;
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export function normalizeCampaignRow(
  row: Record<string, unknown>,
  index: number,
): CampaignDisplayRow | null {
  const rawId = row.id ?? row.campaignId;
  let id = Number.NaN;
  if (typeof rawId === "number") id = rawId;
  else if (typeof rawId === "string") id = Number(rawId);
  if (!Number.isFinite(id)) return null;

  const name = typeof row.name === "string" ? row.name : `Campaign ${index + 1}`;
  let market = "—";
  if (typeof row.market === "string") market = row.market;
  else if (typeof row.targetMarket === "string") market = row.targetMarket;

  const statusCategory = parseStatusCategory(row.status);
  const startRaw = row.campaignStartTime ?? row.campaign_start_time;
  const endRaw = row.campaignEndTime ?? row.campaign_end_time;

  return {
    id,
    name,
    version: pickVersion(row),
    market,
    statusCategory,
    statusLabel: statusLabelFor(statusCategory),
    periodLabel: formatPeriod(startRaw, endRaw),
  };
}

export function normalizeCampaignRows(
  rows: Record<string, unknown>[],
): CampaignDisplayRow[] {
  return rows
    .map((row, i) => normalizeCampaignRow(row, i))
    .filter((r): r is CampaignDisplayRow => r != null);
}

export function countPublishedCampaigns(rows: CampaignDisplayRow[]): number {
  return rows.filter((r) => r.statusCategory === "published").length;
}
