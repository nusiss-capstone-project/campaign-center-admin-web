import {
  formatAdminMoney,
  pickNum,
  pickStr,
} from "@/lib/admin/campaign-performance-utils";

export type CampaignPerformanceSummary = {
  participantCount: number;
  participationCount: number;
  rewardIssuedCount: number;
  rewardIssuedAmount: number;
  rewardFailedCount: number | null;
  currency: string;
};

export type CampaignPerformanceDailyRow = {
  date: string;
  participantCount: number;
  participationCount: number;
  rewardIssuedCount: number;
  rewardIssuedAmount: number;
  currency: string;
};

function asRecord(v: unknown): Record<string, unknown> | null {
  if (v && typeof v === "object" && !Array.isArray(v)) {
    return v as Record<string, unknown>;
  }
  return null;
}

export function normalizePerformanceSummary(
  data: unknown,
): CampaignPerformanceSummary | null {
  const o = asRecord(data);
  if (!o) return null;
  const participantCount = pickNum(o, [
    "participantCount",
    "participant_count",
  ]);
  const participationCount = pickNum(o, [
    "participationCount",
    "participation_count",
  ]);
  const rewardIssuedCount = pickNum(o, [
    "rewardIssuedCount",
    "reward_issued_count",
  ]);
  const rewardIssuedAmount = pickNum(o, [
    "rewardIssuedAmount",
    "reward_issued_amount",
  ]);
  if (
    participantCount == null ||
    participationCount == null ||
    rewardIssuedCount == null ||
    rewardIssuedAmount == null
  ) {
    return null;
  }
  return {
    participantCount,
    participationCount,
    rewardIssuedCount,
    rewardIssuedAmount,
    rewardFailedCount: pickNum(o, ["rewardFailedCount", "reward_failed_count"]),
    currency: pickStr(o, ["currency"]) || "USD",
  };
}

function extractDailyList(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  const record = asRecord(data);
  if (Array.isArray(record?.items)) return record.items;
  if (Array.isArray(record?.daily)) return record.daily;
  return [];
}

export function normalizePerformanceDailyRows(
  data: unknown,
): CampaignPerformanceDailyRow[] {
  const list = extractDailyList(data);

  return list
    .map((item) => {
      const o = asRecord(item);
      if (!o) return null;
      const date = pickStr(o, ["date", "day", "statDate", "stat_date"]);
      const participantCount = pickNum(o, [
        "participantCount",
        "participant_count",
      ]);
      const participationCount = pickNum(o, [
        "participationCount",
        "participation_count",
      ]);
      const rewardIssuedCount = pickNum(o, [
        "rewardIssuedCount",
        "reward_issued_count",
      ]);
      const rewardIssuedAmount = pickNum(o, [
        "rewardIssuedAmount",
        "reward_issued_amount",
      ]);
      if (
        !date ||
        participantCount == null ||
        participationCount == null ||
        rewardIssuedCount == null ||
        rewardIssuedAmount == null
      ) {
        return null;
      }
      return {
        date,
        participantCount,
        participationCount,
        rewardIssuedCount,
        rewardIssuedAmount,
        currency: pickStr(o, ["currency"]) || "USD",
      };
    })
    .filter((r): r is CampaignPerformanceDailyRow => r != null);
}

export function formatSummaryRewardAmount(summary: CampaignPerformanceSummary): string {
  return formatAdminMoney(summary.rewardIssuedAmount, summary.currency);
}
