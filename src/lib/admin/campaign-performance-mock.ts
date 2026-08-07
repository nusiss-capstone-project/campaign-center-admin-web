import type {
  CampaignPerformanceDailyRow,
  CampaignPerformanceSummary,
} from "@/lib/admin/campaign-performance-row";
import { formatYmd } from "@/lib/admin/campaign-performance-utils";

/** Temporary stand-in until performance APIs are ready. */
export const USE_PERFORMANCE_MOCK = true;

export function mockPerformanceSummary(
  _campaignId?: number,
): CampaignPerformanceSummary {
  void _campaignId;
  return {
    participantCount: 1284,
    participationCount: 2460,
    rewardIssuedCount: 892,
    rewardIssuedAmount: 18450.75,
    rewardFailedCount: 17,
    currency: "USD",
  };
}

export function mockPerformanceDaily(
  _campaignId: number,
  startDate: string,
  endDate: string,
): CampaignPerformanceDailyRow[] {
  void _campaignId;
  const start = parseYmd(startDate);
  const end = parseYmd(endDate);
  if (!start || !end || start > end) return [];

  const rows: CampaignPerformanceDailyRow[] = [];
  const cursor = new Date(start);
  let dayIndex = 0;
  while (cursor <= end) {
    const wave = Math.sin(dayIndex / 3) * 0.35 + 1;
    const participantCount = Math.round(28 + dayIndex * 1.4 + wave * 12);
    const participationCount = Math.round(participantCount * (1.6 + wave * 0.2));
    const rewardIssuedCount = Math.round(participationCount * 0.35);
    const rewardIssuedAmount = Number(
      (rewardIssuedCount * (12.5 + (dayIndex % 5) * 1.8)).toFixed(2),
    );
    rows.push({
      date: formatYmd(cursor),
      participantCount,
      participationCount,
      rewardIssuedCount,
      rewardIssuedAmount,
      currency: "USD",
    });
    cursor.setDate(cursor.getDate() + 1);
    dayIndex += 1;
  }
  return rows;
}

function parseYmd(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}
