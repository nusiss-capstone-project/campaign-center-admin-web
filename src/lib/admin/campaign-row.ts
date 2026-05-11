import { format, isValid, parseISO } from "date-fns";

/** Backend: CampaignStatusDraft=1, CampaignStatusPublished=2, CampaignStatusArchive=3 */
export type CampaignStatusCategory = "draft" | "published" | "archive";

export type CampaignDisplayRow = {
  id: number;
  name: string;
  typeRaw: string;
  targetMarket: string;
  segment: string;
  statusCategory: CampaignStatusCategory;
  statusLabel: string;
  periodLabel: string;
  /** Parsed campaign start / end for archive eligibility (outside activity window). */
  campaignStartMs: number | null;
  campaignEndMs: number | null;
};

const NUMERIC_STATUS: Record<number, CampaignStatusCategory> = {
  1: "draft",
  2: "published",
  3: "archive",
};

function parseStatusCategory(value: unknown): CampaignStatusCategory {
  if (typeof value === "number" && Number.isFinite(value)) {
    const mapped = NUMERIC_STATUS[value];
    if (mapped) return mapped;
  }
  const s = String(value ?? "")
    .trim()
    .toLowerCase();
  if (s.includes("archive")) return "archive";
  if (s.includes("publish")) return "published";
  if (s.includes("draft")) return "draft";
  return "draft";
}

function statusLabelFor(category: CampaignStatusCategory): string {
  const labels: Record<CampaignStatusCategory, string> = {
    draft: "Draft",
    published: "Published",
    archive: "Archived",
  };
  return labels[category];
}

function parseInstantMs(value?: unknown): number | null {
  if (typeof value !== "string") return null;
  const d = parseISO(value);
  return isValid(d) ? d.getTime() : null;
}

function formatPeriod(start?: unknown, end?: unknown): string {
  if (typeof start !== "string" || typeof end !== "string") return "—";
  const s = parseISO(start);
  const e = parseISO(end);
  if (!isValid(s) || !isValid(e)) return "—";
  return `${format(s, "MMM d, yyyy")} — ${format(e, "MMM d, yyyy")}`;
}

/**
 * Archive allowed for draft/published when "now" is outside the campaign activity
 * window [campaignStart, campaignEnd] (inclusive). Requires both timestamps.
 */
export function canArchiveCampaign(
  row: Pick<
    CampaignDisplayRow,
    "statusCategory" | "campaignStartMs" | "campaignEndMs"
  >,
): boolean {
  if (row.statusCategory !== "draft" && row.statusCategory !== "published") {
    return false;
  }
  const { campaignStartMs: s, campaignEndMs: e } = row;
  if (s == null || e == null) return false;
  const now = Date.now();
  return now < s || now > e;
}

export function normalizeCampaignRow(
  row: Record<string, unknown>,
  index: number,
): CampaignDisplayRow | null {
  const rawId = row.id ?? row.campaignId;
  const id =
    typeof rawId === "number"
      ? rawId
      : typeof rawId === "string"
        ? Number(rawId)
        : NaN;
  if (!Number.isFinite(id)) return null;

  const name = typeof row.name === "string" ? row.name : `Campaign ${index + 1}`;
  const typeRaw = typeof row.type === "string" ? row.type : "—";
  const targetMarket =
    typeof row.targetMarket === "string" ? row.targetMarket : "—";
  const segment =
    typeof row.targetUserSegment === "string"
      ? row.targetUserSegment
      : typeof row.segment === "string"
        ? row.segment
        : "—";

  const statusCategory = parseStatusCategory(row.status);
  const startRaw = row.campaignStartTime ?? row.startTime;
  const endRaw = row.campaignEndTime ?? row.endTime;
  const campaignStartMs = parseInstantMs(startRaw);
  const campaignEndMs = parseInstantMs(endRaw);
  const periodLabel = formatPeriod(startRaw, endRaw);

  return {
    id,
    name,
    typeRaw,
    targetMarket,
    segment,
    statusCategory,
    statusLabel: statusLabelFor(statusCategory),
    periodLabel,
    campaignStartMs,
    campaignEndMs,
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
