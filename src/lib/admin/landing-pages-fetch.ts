import type { api_LandingPageBody } from "@/lib/api/models/api_LandingPageBody";
import type { StandardEnvelope } from "@/lib/admin/campaign-admin-api";
import { buildPublicApiUrl } from "@/lib/admin/campaign-admin-api";
import { fetchJsonEnvelope } from "@/lib/admin/campaign-admin-fetch";

export type LandingPagesListParams = {
  page: number;
  pageSize: number;
  language?: string;
  status?: number;
};

export function buildLandingPagesListUrl(
  params: LandingPagesListParams,
): string {
  const base = buildPublicApiUrl("/campaign-center-api/v1/admin/landing-pages");
  const usp = new URLSearchParams();
  usp.set("page", String(params.page));
  usp.set("pageSize", String(params.pageSize));
  const lang = params.language?.trim();
  if (lang) usp.set("language", lang);
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

export async function updateLandingPage(
  landingPageId: number,
  payload: api_LandingPageBody,
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
