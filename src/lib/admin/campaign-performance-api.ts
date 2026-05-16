import { AdminCampaignPerformanceService } from "@/lib/api/services/AdminCampaignPerformanceService";
import type { data_StandardResponse } from "@/lib/api/models/data_StandardResponse";
import {
  normalizeParticipationRows,
  normalizePerformanceDailyRows,
  normalizePerformanceSummary,
  type CampaignParticipationRow,
  type CampaignPerformanceDailyRow,
  type CampaignPerformanceSummary,
} from "@/lib/admin/campaign-performance-row";
import { unwrapStandardResponse } from "@/lib/admin/campaign-performance-utils";

export type ParticipationsListResult = {
  rows: CampaignParticipationRow[];
  total: number;
};

export async function fetchCampaignPerformanceSummary(
  campaignId: number,
): Promise<CampaignPerformanceSummary | null> {
  const body = (await AdminCampaignPerformanceService.getAdminCampaignsPerformanceSummary(
    campaignId,
  )) as data_StandardResponse;
  const data = unwrapStandardResponse<unknown>(body);
  return normalizePerformanceSummary(data);
}

export async function fetchCampaignPerformanceDaily(
  campaignId: number,
  startDate: string,
  endDate: string,
): Promise<CampaignPerformanceDailyRow[]> {
  const body = (await AdminCampaignPerformanceService.getAdminCampaignsPerformanceDaily(
    campaignId,
    startDate,
    endDate,
  )) as data_StandardResponse;
  const data = unwrapStandardResponse<unknown>(body);
  return normalizePerformanceDailyRows(data);
}

export type ParticipationsQuery = {
  page: number;
  pageSize: number;
  userId?: number;
  rewardStatus?: string;
};

export async function fetchCampaignParticipations(
  campaignId: number,
  query: ParticipationsQuery,
): Promise<ParticipationsListResult> {
  const body = (await AdminCampaignPerformanceService.getAdminCampaignsParticipations(
    campaignId,
    query.page,
    query.pageSize,
    query.userId,
    query.rewardStatus,
  )) as data_StandardResponse;
  const data = unwrapStandardResponse<unknown>(body);
  const o =
    data && typeof data === "object" && !Array.isArray(data)
      ? (data as Record<string, unknown>)
      : null;
  const rawItems = Array.isArray(data)
    ? data
    : Array.isArray(o?.items)
      ? (o.items as unknown[])
      : [];
  const total =
    typeof o?.total === "number"
      ? o.total
      : typeof o?.total === "string"
        ? Number(o.total)
        : rawItems.length;
  return {
    rows: normalizeParticipationRows(rawItems),
    total: Number.isFinite(total) ? total : rawItems.length,
  };
}
