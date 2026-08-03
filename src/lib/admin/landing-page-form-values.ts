import type { data_LandingPageBody } from "@/lib/api/models/data_LandingPageBody";
import type { data_GenerateLandingTranslationReq } from "@/lib/api/models/data_GenerateLandingTranslationReq";
import type { data_LandingPageRepeatableItemVO } from "@/lib/api/models/data_LandingPageRepeatableItemVO";
import type { data_PutLandingTranslationReq } from "@/lib/api/models/data_PutLandingTranslationReq";
import { pickCampaignStatus } from "@/lib/admin/campaign-form-values";

export type LandingRepeatableItem = {
  title: string;
  description: string;
};

export type LandingPageFormValues = {
  title: string;
  defaultLang: string;
  bannerImageUrl: string;
  description: string;
  terms: string;
  steps: LandingRepeatableItem[];
  faq: LandingRepeatableItem[];
};

export function emptyLandingRepeatableItem(): LandingRepeatableItem {
  return { title: "", description: "" };
}

export function emptyLandingPageFormValues(): LandingPageFormValues {
  return {
    title: "",
    defaultLang: "en",
    bannerImageUrl: "",
    description: "",
    terms: "",
    steps: [],
    faq: [],
  };
}

function pickStr(o: Record<string, unknown>, ...keys: string[]): string {
  for (const k of keys) {
    const v = o[k];
    if (typeof v === "string") return v;
    if (typeof v === "number" && Number.isFinite(v)) return String(v);
  }
  return "";
}

function normalizeRepeatableItems(raw: unknown): LandingRepeatableItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    if (!item || typeof item !== "object") {
      return emptyLandingRepeatableItem();
    }
    const o = item as Record<string, unknown>;
    return {
      title: pickStr(o, "title"),
      description: pickStr(o, "description", "desc", "body"),
    };
  });
}

function toRepeatablePayload(
  items: LandingRepeatableItem[],
): data_LandingPageRepeatableItemVO[] {
  return items
    .map((item) => ({
      title: item.title.trim(),
      description: item.description.trim(),
    }))
    .filter((item) => item.title || item.description);
}

export function parseLandingPageDetailToFormValues(
  data: unknown,
): LandingPageFormValues {
  const base = emptyLandingPageFormValues();
  if (!data || typeof data !== "object") return base;
  const o = data as Record<string, unknown>;

  return {
    title: pickStr(o, "title") || base.title,
    defaultLang:
      pickStr(o, "defaultLang", "default_lang", "language", "lang") ||
      base.defaultLang,
    bannerImageUrl: pickStr(
      o,
      "bannerImageUrl",
      "banner_image_url",
      "bannerUrl",
    ),
    description: pickStr(o, "description", "body", "summary"),
    terms: pickStr(o, "terms", "termsHtml", "terms_text"),
    steps: normalizeRepeatableItems(o.steps),
    faq: normalizeRepeatableItems(o.faq),
  };
}

export function toLandingPageBody(v: LandingPageFormValues): data_LandingPageBody {
  return {
    title: v.title.trim(),
    defaultLang: v.defaultLang.trim(),
    bannerImageUrl: v.bannerImageUrl.trim(),
    description: v.description.trim(),
    terms: v.terms.trim(),
    steps: toRepeatablePayload(v.steps),
    faq: toRepeatablePayload(v.faq),
  };
}

export function toGenerateLandingTranslationReq(
  v: LandingPageFormValues,
  sourceLang: string,
  targetLang: string,
): data_GenerateLandingTranslationReq {
  return {
    sourceLang,
    targetLang,
    title: v.title.trim(),
    description: v.description.trim(),
    terms: v.terms.trim(),
    steps: toRepeatablePayload(v.steps),
    faq: toRepeatablePayload(v.faq),
  };
}

export function toPutLandingTranslationReq(
  v: LandingPageFormValues,
  operator = "admin",
): data_PutLandingTranslationReq {
  return {
    title: v.title.trim(),
    description: v.description.trim(),
    terms: v.terms.trim(),
    steps: toRepeatablePayload(v.steps),
    faq: toRepeatablePayload(v.faq),
    operator,
  };
}

/** Same as campaigns: 1 draft, 2 published, 3 archive */
export const pickLandingPageStatus = pickCampaignStatus;
