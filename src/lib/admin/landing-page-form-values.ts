import type { api_LandingPageBody } from "@/lib/api/models/api_LandingPageBody";
import { pickCampaignStatus } from "@/lib/admin/campaign-form-values";

export type LandingPageFormValues = {
  title: string;
  language: string;
  bannerImageUrl: string;
  description: string;
  terms: string;
};

export function emptyLandingPageFormValues(): LandingPageFormValues {
  return {
    title: "",
    language: "en-US",
    bannerImageUrl: "",
    description: "",
    terms: "",
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

export function parseLandingPageDetailToFormValues(
  data: unknown,
): LandingPageFormValues {
  const base = emptyLandingPageFormValues();
  if (!data || typeof data !== "object") return base;
  const o = data as Record<string, unknown>;

  return {
    title: pickStr(o, "title") || base.title,
    language: pickStr(o, "language") || base.language,
    bannerImageUrl: pickStr(
      o,
      "bannerImageUrl",
      "banner_image_url",
      "bannerUrl",
    ),
    description: pickStr(o, "description", "body", "summary"),
    terms: pickStr(o, "terms", "termsHtml", "terms_text"),
  };
}

export function toLandingPageBody(v: LandingPageFormValues): api_LandingPageBody {
  return {
    title: v.title.trim(),
    language: v.language.trim(),
    bannerImageUrl: v.bannerImageUrl.trim(),
    description: v.description.trim(),
    terms: v.terms.trim(),
  };
}

/** Same as campaigns: 1 draft, 2 published, 3 archive */
export const pickLandingPageStatus = pickCampaignStatus;
