import type { data_LandingPageBody } from "@/lib/api/models/data_LandingPageBody";
import type { data_GenerateLandingTranslationReq } from "@/lib/api/models/data_GenerateLandingTranslationReq";
import type { data_PutLandingTranslationReq } from "@/lib/api/models/data_PutLandingTranslationReq";
import { AdminImagesService } from "@/lib/api/services/AdminImagesService";
import { AdminLandingPageService } from "@/lib/api/services/AdminLandingPageService";
import { ApiError } from "@/lib/api/core/ApiError";
import type { StandardEnvelope } from "@/lib/admin/campaign-admin-api";
import { buildPublicApiUrl } from "@/lib/admin/campaign-admin-api";
import { fetchJsonEnvelope } from "@/lib/admin/campaign-admin-fetch";
import {
  normalizeLandingPageRows,
  type LandingPageDisplayRow,
} from "@/lib/admin/landing-page-row";

export type LandingPagesListParams = {
  page: number;
  pageSize: number;
  defaultLang?: string;
  status?: number;
};

export function buildLandingPagesListUrl(
  params: LandingPagesListParams,
): string {
  const base = buildPublicApiUrl("/campaign-center-api/v1/admin/landing-pages");
  const usp = new URLSearchParams();
  usp.set("page", String(params.page));
  usp.set("pageSize", String(params.pageSize));
  const lang = params.defaultLang?.trim();
  if (lang) usp.set("defaultLang", lang);
  if (
    params.status != null &&
    Number.isFinite(params.status) &&
    params.status >= 1 &&
    params.status <= 3
  ) {
    usp.set("status", String(params.status));
  }
  return `${base}?${usp.toString()}`;
}

export function landingPagePublishUrl(id: number): string {
  return buildPublicApiUrl(
    `/campaign-center-api/v1/admin/landing-pages/${id}/publish`,
  );
}

export async function publishLandingPage(landingPageId: number): Promise<void> {
  const url = landingPagePublishUrl(landingPageId);
  const body = await fetchJsonEnvelope(url, {
    method: "POST",
    body: JSON.stringify({ operator: "admin" }),
  });
  if (body.code != null && body.code !== 0) {
    throw new Error(body.message ?? "Publish failed");
  }
}

export function landingPageDetailUrl(landingPageId: number): string {
  return buildPublicApiUrl(
    `/campaign-center-api/v1/admin/landing-pages/${landingPageId}`,
  );
}

export async function fetchLandingPageDetail(
  landingPageId: number,
): Promise<unknown> {
  const url = landingPageDetailUrl(landingPageId);
  const res = await fetchJsonEnvelope(url, { method: "GET" });
  if (res.code != null && res.code !== 0) {
    throw new Error(res.message ?? "Load failed");
  }
  return res.data ?? null;
}

export async function uploadLandingBannerImage(file: File): Promise<string> {
  const res = await AdminImagesService.postAdminImagesUpload(file);
  const url = unwrapGeneratedEnvelope(res)?.url?.trim();
  if (!url) {
    throw new Error(res.message ?? "Upload succeeded but no image URL returned");
  }
  return url;
}

export async function updateLandingPage(
  landingPageId: number,
  payload: data_LandingPageBody,
): Promise<void> {
  const url = landingPageDetailUrl(landingPageId);
  const res = await fetchJsonEnvelope(url, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  if (res.code != null && res.code !== 0) {
    throw new Error(res.message ?? "Update failed");
  }
}

export type LandingPagesListResponse = StandardEnvelope<{
  total?: number;
  items?: unknown[];
}>;

/** Published landing pages for campaign editor import (status=2). */
export async function fetchPublishedLandingPages(params?: {
  page?: number;
  pageSize?: number;
}): Promise<LandingPageDisplayRow[]> {
  const url = buildLandingPagesListUrl({
    page: params?.page ?? 1,
    pageSize: params?.pageSize ?? 100,
    status: 2,
  });
  const body = await fetchJsonEnvelope<LandingPagesListResponse["data"]>(url, {
    method: "GET",
  });
  if (body.code != null && body.code !== 0) {
    throw new Error(body.message ?? "Failed to load landing pages");
  }
  const rawItems = body.data?.items;
  const items = Array.isArray(rawItems)
    ? (rawItems as Record<string, unknown>[])
    : [];
  return normalizeLandingPageRows(items);
}

function unwrapGeneratedEnvelope<T>(res: {
  code?: number;
  message?: string;
  data?: T;
}): T | null {
  if (res.code != null && res.code !== 0) {
    throw new Error(res.message ?? "Request failed");
  }
  return res.data ?? null;
}

export async function fetchLandingPageTranslatedLangs(
  landingPageId: number,
): Promise<string[]> {
  const res =
    await AdminLandingPageService.getAdminLandingPagesTranslations(
      landingPageId,
    );
  return unwrapGeneratedEnvelope(res)?.langs ?? [];
}

export async function fetchLandingPageLocaleDetail(
  landingPageId: number,
  lang: string,
): Promise<unknown | null> {
  try {
    const res = await AdminLandingPageService.getAdminLandingPagesDetail(
      landingPageId,
      lang,
    );
    return unwrapGeneratedEnvelope(res);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

export async function generateLandingPageTranslation(
  landingPageId: number,
  payload: data_GenerateLandingTranslationReq,
): Promise<unknown | null> {
  const res =
    await AdminLandingPageService.postAdminLandingPagesTranslationsGenerate(
      landingPageId,
      payload,
    );
  return unwrapGeneratedEnvelope(res);
}

export async function saveLandingPageTranslation(
  landingPageId: number,
  lang: string,
  payload: data_PutLandingTranslationReq,
): Promise<void> {
  const res = await AdminLandingPageService.putAdminLandingPagesTranslations(
    landingPageId,
    lang,
    payload,
  );
  unwrapGeneratedEnvelope(res);
}
