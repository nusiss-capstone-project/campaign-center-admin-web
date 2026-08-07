import { AdminCampaignPerformanceService } from "@/lib/api/services/AdminCampaignPerformanceService";
import { AdminParticipantService } from "@/lib/api/services/AdminParticipantService";
import type {
  data_AdminParticipantCampaignVO,
  data_AdminParticipantListData,
  data_AdminParticipantVO,
} from "@/lib/api/models/data_AdminParticipant";
import type { data_StandardResponse } from "@/lib/api/models/data_StandardResponse";
import { fetchCampaignDetail } from "@/lib/admin/campaign-admin-fetch";
import {
  normalizePerformanceDailyRows,
  normalizePerformanceSummary,
  type CampaignPerformanceDailyRow,
  type CampaignPerformanceSummary,
} from "@/lib/admin/campaign-performance-row";
import {
  mockPerformanceDaily,
  mockPerformanceSummary,
  USE_PERFORMANCE_MOCK,
} from "@/lib/admin/campaign-performance-mock";
import {
  pickNum,
  unwrapStandardResponse,
} from "@/lib/admin/campaign-performance-utils";

export type CampaignParticipantMeta = {
  projectId: number | null;
  taskGroupId: number | null;
};

export type CampaignParticipantsResult = {
  participants: data_AdminParticipantVO[];
  campaign: data_AdminParticipantCampaignVO | null;
  meta: CampaignParticipantMeta;
};

export async function fetchCampaignPerformanceSummary(
  campaignId: number,
): Promise<CampaignPerformanceSummary | null> {
  if (USE_PERFORMANCE_MOCK) {
    return mockPerformanceSummary(campaignId);
  }
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
  if (USE_PERFORMANCE_MOCK) {
    return mockPerformanceDaily(campaignId, startDate, endDate);
  }
  const body = (await AdminCampaignPerformanceService.getAdminCampaignsPerformanceDaily(
    campaignId,
    startDate,
    endDate,
  )) as data_StandardResponse;
  const data = unwrapStandardResponse<unknown>(body);
  return normalizePerformanceDailyRows(data);
}

function metaFromCampaignVo(
  campaign: data_AdminParticipantCampaignVO | null | undefined,
): CampaignParticipantMeta {
  if (!campaign) {
    return { projectId: null, taskGroupId: null };
  }
  const o = campaign as Record<string, unknown>;
  return {
    projectId: pickNum(o, ["project_id", "projectId"]),
    taskGroupId: pickNum(o, ["task_group_id", "taskGroupId"]),
  };
}

export async function fetchCampaignParticipants(
  campaignId: number,
): Promise<CampaignParticipantsResult> {
  const body = (await AdminParticipantService.getAdminCampaignsUsers(
    campaignId,
  )) as data_StandardResponse;
  const data = unwrapStandardResponse<data_AdminParticipantListData>(body);
  const campaign = data?.campaign ?? null;
  const participants = Array.isArray(data?.participants)
    ? data.participants
    : [];
  return {
    participants,
    campaign,
    meta: metaFromCampaignVo(campaign),
  };
}

/** Fallback when users list has not been loaded or campaign meta is incomplete. */
export async function fetchCampaignParticipantMeta(
  campaignId: number,
): Promise<CampaignParticipantMeta> {
  const detail = await fetchCampaignDetail(campaignId);
  const budget =
    detail.budgets && typeof detail.budgets === "object"
      ? (detail.budgets as Record<string, unknown>)
      : null;
  const rules =
    detail.rewardRules && typeof detail.rewardRules === "object"
      ? (detail.rewardRules as Record<string, unknown>)
      : null;
  return {
    projectId: budget ? pickNum(budget, ["projectId", "project_id"]) : null,
    taskGroupId: rules
      ? pickNum(rules, ["taskGroupId", "task_group_id"])
      : null,
  };
}
