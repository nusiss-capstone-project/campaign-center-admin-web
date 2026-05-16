import { format, isValid, parseISO } from "date-fns";
import type { api_RewardRulesReq } from "@/lib/api/models/api_RewardRulesReq";
import {
  CAMPAIGN_MARKET_OPTIONS,
  REWARD_TYPE_OPTIONS,
  USER_SEGMENT_OPTIONS,
} from "@/lib/admin/campaign-options";

export type CampaignFormValues = {
  name: string;
  type: string;
  targetMarket: string;
  targetUserSegment: string;
  registrationStartTime: string;
  registrationEndTime: string;
  campaignStartTime: string;
  campaignEndTime: string;
  landingPageId: string;
  rewardType: string;
  rewardMode: string;
  rewardAmount: string;
  rewardCurrency: string;
  rewardPercentage: string;
  maxRewardAmount: string;
  topupThreshold: string;
  maxClaimPerUser: string;
  minObtainDays: string;
};

export function emptyCampaignFormValues(): CampaignFormValues {
  return {
    name: "",
    type: "TOPUP_REWARD",
    targetMarket: CAMPAIGN_MARKET_OPTIONS[0].value,
    targetUserSegment: USER_SEGMENT_OPTIONS[0].value,
    registrationStartTime: "",
    registrationEndTime: "",
    campaignStartTime: "",
    campaignEndTime: "",
    landingPageId: "",
    rewardType: REWARD_TYPE_OPTIONS[0].value,
    rewardMode: "FIXED_AMOUNT",
    rewardAmount: "0",
    rewardCurrency: "USD",
    rewardPercentage: "0",
    maxRewardAmount: "0",
    topupThreshold: "0",
    maxClaimPerUser: "1",
    minObtainDays: "0",
  };
}

/** `datetime-local` value from ISO string */
export function isoToDatetimeLocal(iso: string): string {
  if (!iso) return "";
  const d = parseISO(iso);
  if (!isValid(d)) return "";
  return format(d, "yyyy-MM-dd'T'HH:mm");
}

function pickStr(o: Record<string, unknown>, ...keys: string[]): string {
  for (const k of keys) {
    const v = o[k];
    if (typeof v === "string") return v;
    if (typeof v === "number" && Number.isFinite(v)) return String(v);
  }
  return "";
}

function pickReward(
  o: Record<string, unknown>,
): Record<string, unknown> | null {
  const r = o.rewardRules;
  if (r && typeof r === "object") return r as Record<string, unknown>;
  return null;
}

export function parseCampaignDetailToFormValues(
  data: unknown,
): CampaignFormValues {
  const base = emptyCampaignFormValues();
  if (!data || typeof data !== "object") return base;
  const o = data as Record<string, unknown>;
  const rr = pickReward(o);

  return {
    name: pickStr(o, "name") || base.name,
    type: pickStr(o, "type") || base.type,
    targetMarket: pickStr(o, "targetMarket") || base.targetMarket,
    targetUserSegment:
      pickStr(o, "targetUserSegment", "segment") || base.targetUserSegment,
    registrationStartTime: isoToDatetimeLocal(
      pickStr(o, "registrationStartTime", "registration_start_time"),
    ),
    registrationEndTime: isoToDatetimeLocal(
      pickStr(o, "registrationEndTime", "registration_end_time"),
    ),
    campaignStartTime: isoToDatetimeLocal(
      pickStr(o, "campaignStartTime", "startTime", "campaign_start_time"),
    ),
    campaignEndTime: isoToDatetimeLocal(
      pickStr(o, "campaignEndTime", "endTime", "campaign_end_time"),
    ),
    landingPageId: (() => {
      const v = o.landingPageId ?? o.landing_page_id;
      if (typeof v === "number" && Number.isFinite(v)) return String(v);
      if (typeof v === "string") return v;
      return "";
    })(),
    rewardType: rr
      ? pickStr(rr, "rewardType", "reward_type") || base.rewardType
      : base.rewardType,
    rewardMode: rr
      ? pickStr(rr, "rewardMode", "reward_mode") || base.rewardMode
      : base.rewardMode,
    rewardAmount: rr
      ? pickStr(rr, "rewardAmount", "reward_amount") || base.rewardAmount
      : base.rewardAmount,
    rewardCurrency: rr
      ? pickStr(rr, "rewardCurrency", "reward_currency") ||
        base.rewardCurrency
      : base.rewardCurrency,
    rewardPercentage: rr
      ? pickStr(rr, "rewardPercentage", "reward_percentage") ||
        base.rewardPercentage
      : base.rewardPercentage,
    maxRewardAmount: rr
      ? pickStr(rr, "maxRewardAmount", "max_reward_amount") ||
        base.maxRewardAmount
      : base.maxRewardAmount,
    topupThreshold: rr
      ? pickStr(rr, "topupThreshold", "topup_threshold") || base.topupThreshold
      : base.topupThreshold,
    maxClaimPerUser: rr
      ? pickStr(rr, "maxClaimPerUser", "max_claim_per_user") ||
        base.maxClaimPerUser
      : base.maxClaimPerUser,
    minObtainDays: rr
      ? pickStr(rr, "minObtainDays", "min_obtain_days") ||
        base.minObtainDays
      : base.minObtainDays,
  };
}

export function pickCampaignStatus(data: unknown): number | null {
  if (!data || typeof data !== "object") return null;
  const s = (data as Record<string, unknown>).status;
  if (typeof s === "number" && Number.isFinite(s)) return s;
  if (typeof s === "string") {
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export function statusCodeToLabel(code: number | null): string {
  if (code === 1) return "Draft";
  if (code === 2) return "Published";
  if (code === 3) return "Archived";
  return code != null ? String(code) : "";
}

export function localDatetimeToIso(dtLocal: string): string {
  if (!dtLocal) return "";
  const d = new Date(dtLocal);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString();
}

function parseNumberField(raw: string, label: string): number {
  if (raw.trim() === "") {
    throw new Error(`${label} is required.`);
  }
  const n = Number(raw);
  if (!Number.isFinite(n)) {
    throw new Error(`${label} must be a valid number.`);
  }
  return n;
}

function parseOptionalNumberField(
  raw: string,
  label: string,
): number | undefined {
  if (raw.trim() === "") return undefined;
  const n = Number(raw);
  if (!Number.isFinite(n)) {
    throw new Error(`${label} must be a valid number.`);
  }
  return n;
}

export function toRewardRulesPayload(
  values: CampaignFormValues,
): api_RewardRulesReq {
  const rewardMode = values.rewardMode.trim() || "FIXED_AMOUNT";
  const payload: api_RewardRulesReq = {
    rewardType: values.rewardType.trim(),
    rewardMode,
    topupThreshold: parseNumberField(values.topupThreshold, "Top-up threshold"),
    maxClaimPerUser: Math.trunc(
      parseNumberField(values.maxClaimPerUser, "Max claim per user"),
    ),
    minObtainDays: Math.trunc(
      parseNumberField(values.minObtainDays, "Min obtain days"),
    ),
  };

  if (rewardMode === "PERCENTAGE") {
    payload.rewardPercentage = parseNumberField(
      values.rewardPercentage,
      "Reward percentage",
    );
    const maxRewardAmount = parseOptionalNumberField(
      values.maxRewardAmount,
      "Max reward amount",
    );
    if (maxRewardAmount != null) payload.maxRewardAmount = maxRewardAmount;
    const rewardCurrency = values.rewardCurrency.trim();
    if (rewardCurrency) payload.rewardCurrency = rewardCurrency;
  } else {
    payload.rewardAmount = parseNumberField(
      values.rewardAmount,
      "Reward amount",
    );
    const rewardCurrency = values.rewardCurrency.trim();
    if (rewardCurrency) payload.rewardCurrency = rewardCurrency;
  }

  return payload;
}
