import { format, isValid } from "date-fns";

import type { data_CampaignVO } from "@/lib/api/models/data_CampaignVO";
import type { data_CampaignRewardRuleVO } from "@/lib/api/models/data_CampaignRewardRuleVO";
import type { data_TaskRewardItemVO } from "@/lib/api/models/data_TaskRewardItemVO";
import { TIMEZONE_OPTIONS } from "@/lib/admin/campaign-options";

export type TaskRewardItemFormRow = {
  taskId: string;
  taskName: string;
  rewardTemplateId: string;
  rewardTemplateName: string;
};

export type CampaignFormValues = {
  name: string;
  market: string;
  timeZone: string;
  registrationStartTime: string;
  registrationEndTime: string;
  campaignStartTime: string;
  campaignEndTime: string;
  landingPageId: string;
  targetUserGroupId: string;
  targetUserGroupName: string;
  budgetProjectId: string;
  budgetProjectName: string;
  taskGroupId: string;
  taskGroupRewardTemplateId: string;
  taskRewardItems: TaskRewardItemFormRow[];
};

export function emptyCampaignFormValues(): CampaignFormValues {
  return {
    name: "",
    market: "",
    timeZone: TIMEZONE_OPTIONS[0].value,
    registrationStartTime: "",
    registrationEndTime: "",
    campaignStartTime: "",
    campaignEndTime: "",
    landingPageId: "",
    targetUserGroupId: "",
    targetUserGroupName: "",
    budgetProjectId: "",
    budgetProjectName: "",
    taskGroupId: "",
    taskGroupRewardTemplateId: "",
    taskRewardItems: [],
  };
}

/** Unix seconds or milliseconds → `datetime-local` value. */
export function timestampToDatetimeLocal(value: unknown): string {
  const ms = toEpochMs(value);
  if (ms == null) return "";
  const d = new Date(ms);
  if (!isValid(d)) return "";
  return format(d, "yyyy-MM-dd'T'HH:mm");
}

/** `datetime-local` → Unix seconds (campaign-api v2 uses int64 epoch seconds). */
export function localDatetimeToUnixSeconds(dtLocal: string): number | undefined {
  if (!dtLocal.trim()) return undefined;
  const d = new Date(dtLocal);
  if (Number.isNaN(d.getTime())) return undefined;
  return Math.floor(d.getTime() / 1000);
}

function toEpochMs(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    // Heuristic: values below ~year 2001 in ms are treated as seconds.
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

function pickStr(o: Record<string, unknown>, ...keys: string[]): string {
  for (const k of keys) {
    const v = o[k];
    if (typeof v === "string") return v;
    if (typeof v === "number" && Number.isFinite(v)) return String(v);
  }
  return "";
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value != null && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function looksLikeCampaignVo(candidate: Record<string, unknown>): boolean {
  return (
    "name" in candidate ||
    "version" in candidate ||
    "market" in candidate ||
    "rewardRules" in candidate
  );
}

function findNestedCampaignRecord(
  root: Record<string, unknown>,
): Record<string, unknown> | null {
  for (const key of ["campaign", "detail", "item"]) {
    const candidate = asRecord(root[key]);
    if (candidate && looksLikeCampaignVo(candidate)) return candidate;
  }
  return null;
}

function parseContentRecord(content: unknown): Record<string, unknown> {
  if (typeof content === "string" && content.trim().startsWith("{")) {
    try {
      return asRecord(JSON.parse(content)) ?? {};
    } catch {
      return {};
    }
  }
  return asRecord(content) ?? {};
}

function mergeDefinedLayers(
  base: Record<string, unknown>,
  layers: Array<Record<string, unknown> | null>,
): Record<string, unknown> {
  const merged: Record<string, unknown> = { ...base };
  for (const layer of layers) {
    if (!layer) continue;
    for (const [key, value] of Object.entries(layer)) {
      if (key === "content") continue;
      if (value !== undefined && value !== null) merged[key] = value;
    }
  }
  return merged;
}

/**
 * Normalize GET campaign detail payloads.
 * Draft backends may nest the editable VO under `content` (JSON string/object)
 * or wrap it as `{ campaign: CampaignVO }`.
 */
export function coerceCampaignDetail(data: unknown): Record<string, unknown> {
  const root = asRecord(data);
  if (!root) return {};

  const nested = findNestedCampaignRecord(root);
  const fromContent = parseContentRecord(root.content ?? nested?.content);
  // Overlay only defined values so `name: undefined` from the outer shell
  // cannot wipe a name that only exists inside draft `content`.
  return mergeDefinedLayers(fromContent, [nested, root]);
}

export function parseCampaignDetailToFormValues(
  data: unknown,
): CampaignFormValues {
  const base = emptyCampaignFormValues();
  const o = coerceCampaignDetail(data);
  if (Object.keys(o).length === 0) return base;

  const target = asRecord(o.targetUserGroups ?? o.target_user_groups);
  const budget = asRecord(o.budgets ?? o.budget);
  const rules = asRecord(o.rewardRules ?? o.reward_rules);

  const itemsRaw = rules?.taskRewardItems ?? rules?.task_reward_items;
  const taskRewardItems: TaskRewardItemFormRow[] = Array.isArray(itemsRaw)
    ? itemsRaw.map((item) => {
        const row = asRecord(item) ?? {};
        return {
          taskId: pickStr(row, "taskId", "task_id"),
          taskName: pickStr(row, "taskName", "task_name"),
          rewardTemplateId: pickStr(
            row,
            "rewardTemplateId",
            "reward_template_id",
          ),
          rewardTemplateName: pickStr(
            row,
            "rewardTemplateName",
            "reward_template_name",
          ),
        };
      })
    : [];

  return {
    name: pickStr(o, "name") || base.name,
    market: pickStr(o, "market", "targetMarket") || base.market,
    timeZone: pickStr(o, "timeZone", "time_zone") || base.timeZone,
    registrationStartTime: timestampToDatetimeLocal(
      o.registrationStartTime ?? o.registration_start_time,
    ),
    registrationEndTime: timestampToDatetimeLocal(
      o.registrationEndTime ?? o.registration_end_time,
    ),
    campaignStartTime: timestampToDatetimeLocal(
      o.campaignStartTime ?? o.campaign_start_time,
    ),
    campaignEndTime: timestampToDatetimeLocal(
      o.campaignEndTime ?? o.campaign_end_time,
    ),
    landingPageId: pickStr(o, "landingPageId", "landing_page_id"),
    targetUserGroupId: target ? pickStr(target, "id") : "",
    targetUserGroupName: target
      ? pickStr(target, "groupName", "group_name")
      : "",
    budgetProjectId: budget
      ? pickStr(budget, "projectId", "project_id")
      : "",
    budgetProjectName: budget
      ? pickStr(budget, "projectName", "project_name")
      : "",
    taskGroupId: rules ? pickStr(rules, "taskGroupId", "task_group_id") : "",
    taskGroupRewardTemplateId: rules
      ? pickStr(rules, "taskGroupReward", "task_group_reward")
      : "",
    taskRewardItems,
  };
}

export function pickCampaignDetailName(data: unknown): string {
  const name = coerceCampaignDetail(data).name;
  return typeof name === "string" ? name.trim() : "";
}

export function pickCampaignStatus(data: unknown): number | null {
  const o = coerceCampaignDetail(data);
  const s = o.status;
  if (typeof s === "number" && Number.isFinite(s)) return s;
  if (typeof s === "string") {
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export function pickCampaignVersion(data: unknown): number | null {
  const o = coerceCampaignDetail(data);
  const v = o.version;
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export function statusCodeToLabel(code: number | null): string {
  if (code === 1) return "Draft";
  if (code === 2) return "Published";
  return code != null ? String(code) : "";
}

function parseOptionalInt(raw: string, label: string): number | undefined {
  if (raw.trim() === "") return undefined;
  const n = Number(raw);
  if (!Number.isFinite(n)) {
    throw new TypeError(`${label} must be a valid number.`);
  }
  return Math.trunc(n);
}

function parseRequiredInt(raw: string, label: string): number {
  const n = parseOptionalInt(raw, label);
  if (n == null) throw new Error(`${label} is required.`);
  return n;
}

function requireDatetime(raw: string, label: string): number {
  const seconds = localDatetimeToUnixSeconds(raw);
  if (seconds == null) {
    throw new Error(`${label} is required.`);
  }
  return seconds;
}

export function toCampaignVOPayload(
  values: CampaignFormValues,
  meta?: { id?: number; version?: number; status?: number },
): data_CampaignVO {
  const name = values.name.trim();
  if (!name) throw new Error("Name is required.");

  const market = values.market.trim();
  if (!market) throw new Error("Market is required.");

  const timeZone = values.timeZone.trim();
  if (!timeZone) throw new Error("Time zone is required.");

  const taskGroupId = parseOptionalInt(values.taskGroupId, "Task group");
  const taskGroupReward = parseOptionalInt(
    values.taskGroupRewardTemplateId,
    "Task group reward template",
  );

  const taskRewardItems: data_TaskRewardItemVO[] = values.taskRewardItems
    .map((item) => {
      const taskId = parseOptionalInt(item.taskId, "Task ID");
      const rewardTemplateId = parseOptionalInt(
        item.rewardTemplateId,
        `Reward template for task ${item.taskName || item.taskId}`,
      );
      if (taskId == null) return null;
      const row: data_TaskRewardItemVO = {
        taskId,
        taskName: item.taskName.trim() || undefined,
      };
      if (rewardTemplateId != null) {
        row.rewardTemplateId = rewardTemplateId;
        row.rewardTemplateName =
          item.rewardTemplateName.trim() || undefined;
      }
      return row;
    })
    .filter((row): row is data_TaskRewardItemVO => row != null);

  const rewardRules: data_CampaignRewardRuleVO | undefined =
    taskGroupId != null ||
    taskGroupReward != null ||
    taskRewardItems.length > 0
      ? {
          taskGroupId,
          taskGroupReward,
          taskRewardItems:
            taskRewardItems.length > 0 ? taskRewardItems : undefined,
        }
      : undefined;

  const targetId = parseOptionalInt(
    values.targetUserGroupId,
    "Target user group ID",
  );
  const targetName = values.targetUserGroupName.trim();
  const targetUserGroups =
    targetId != null || targetName
      ? {
          id: targetId,
          groupName: targetName || undefined,
        }
      : undefined;

  const projectId = parseOptionalInt(
    values.budgetProjectId,
    "Budget project",
  );
  const projectName = values.budgetProjectName.trim();
  const budgets =
    projectId != null || projectName
      ? {
          projectId,
          projectName: projectName || undefined,
        }
      : undefined;

  const landingPageId = parseOptionalInt(
    values.landingPageId,
    "Landing page ID",
  );

  const vo: data_CampaignVO = {
    name,
    market,
    timeZone,
    registrationStartTime: requireDatetime(
      values.registrationStartTime,
      "Registration start",
    ),
    registrationEndTime: requireDatetime(
      values.registrationEndTime,
      "Registration end",
    ),
    campaignStartTime: requireDatetime(
      values.campaignStartTime,
      "Campaign start",
    ),
    campaignEndTime: requireDatetime(values.campaignEndTime, "Campaign end"),
    landingPageId,
    targetUserGroups,
    budgets,
    rewardRules,
  };

  if (meta?.id != null) vo.id = meta.id;
  if (meta?.version != null) vo.version = meta.version;
  if (meta?.status != null) vo.status = meta.status;

  return vo;
}

/** Validate required fields without building the full payload (for publish gate). */
export function assertCampaignFormReady(values: CampaignFormValues): void {
  toCampaignVOPayload(values);
}

export function requirePositiveId(raw: string, label: string): number {
  return parseRequiredInt(raw, label);
}
