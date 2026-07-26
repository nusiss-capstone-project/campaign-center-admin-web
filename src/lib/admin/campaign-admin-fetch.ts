import type { data_CampaignVO } from "@/lib/api/models/data_CampaignVO";
import type { StandardEnvelope } from "@/lib/admin/campaign-admin-api";
import { buildPublicApiUrl } from "@/lib/admin/campaign-admin-api";
import { withClerkAuthorization } from "@/lib/auth/clerk-token";

export async function fetchJsonEnvelope<T = unknown>(
  url: string,
  init?: RequestInit,
): Promise<StandardEnvelope<T>> {
  const headers = new Headers(init?.headers);
  if (init?.body != null && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  await withClerkAuthorization(url, headers);
  const res = await fetch(url, { ...init, headers });
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }
  return (await res.json()) as StandardEnvelope<T>;
}

export function campaignsListUrl(params?: {
  page?: number;
  pageSize?: number;
  status?: number;
  campaignId?: number;
}): string {
  const usp = new URLSearchParams();
  if (params?.page != null) usp.set("page", String(params.page));
  if (params?.pageSize != null) usp.set("pageSize", String(params.pageSize));
  if (params?.status != null) usp.set("status", String(params.status));
  if (params?.campaignId != null) {
    usp.set("campaignId", String(params.campaignId));
  }
  const qs = usp.toString();
  return buildPublicApiUrl(
    `/campaign-center-api/v1/admin/campaigns${qs ? `?${qs}` : ""}`,
  );
}

export function campaignDetailUrl(id: number): string {
  return buildPublicApiUrl(`/campaign-center-api/v1/admin/campaigns/${id}`);
}

export function campaignPublishUrl(id: number): string {
  return buildPublicApiUrl(
    `/campaign-center-api/v1/admin/campaigns/${id}/publish`,
  );
}

export function campaignVersionsUrl(id: number): string {
  return buildPublicApiUrl(
    `/campaign-center-api/v1/admin/campaigns/${id}/versions`,
  );
}

export function campaignVersionUrl(id: number, version: number): string {
  return buildPublicApiUrl(
    `/campaign-center-api/v1/admin/campaigns/${id}/versions/${version}`,
  );
}

function assertOk(body: StandardEnvelope<unknown>, fallback: string): void {
  if (body.code != null && body.code !== 0) {
    throw new Error(body.message ?? fallback);
  }
}

function pickCampaignId(data: unknown): number | null {
  if (data == null || typeof data !== "object") return null;
  const o = data as Record<string, unknown>;
  const raw = o.id ?? o.campaignId ?? o.campaign_id;
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  if (typeof raw === "string" && raw.trim() !== "") {
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/** Create campaign shell — response data is campaign id (or object with id). */
export async function createCampaign(name: string): Promise<number> {
  const url = buildPublicApiUrl("/campaign-center-api/v1/admin/campaigns");
  const body = await fetchJsonEnvelope(url, {
    method: "POST",
    body: JSON.stringify({ name }),
  });
  assertOk(body, "Create failed");
  if (typeof body.data === "number" && Number.isFinite(body.data)) {
    return body.data;
  }
  const id = pickCampaignId(body.data);
  if (id == null) {
    throw new Error("Campaign ID missing from create response");
  }
  return id;
}

export async function fetchCampaignDetail(
  campaignId: number,
): Promise<data_CampaignVO> {
  const url = campaignDetailUrl(campaignId);
  const body = await fetchJsonEnvelope<unknown>(url, {
    method: "GET",
  });
  assertOk(body, "Load failed");
  if (body.data == null) {
    throw new Error("Campaign detail missing");
  }
  // data may be a raw VO, or a wrapper with nested content / campaign.
  if (typeof body.data === "string") {
    try {
      return JSON.parse(body.data) as data_CampaignVO;
    } catch {
      throw new Error("Campaign detail missing");
    }
  }
  if (typeof body.data !== "object") {
    throw new Error("Campaign detail missing");
  }
  return body.data as data_CampaignVO;
}

/** Create a new draft version (e.g. when editing a published campaign). */
export async function createCampaignVersion(
  campaignId: number,
): Promise<data_CampaignVO> {
  const url = campaignVersionsUrl(campaignId);
  const body = await fetchJsonEnvelope<data_CampaignVO>(url, {
    method: "POST",
  });
  assertOk(body, "Create version failed");
  if (!body.data || typeof body.data !== "object") {
    // Some backends return empty data — reload detail for the new draft.
    return fetchCampaignDetail(campaignId);
  }
  return body.data;
}

export async function saveCampaignVersion(
  campaignId: number,
  version: number,
  payload: data_CampaignVO,
): Promise<data_CampaignVO | null> {
  const url = campaignVersionUrl(campaignId, version);
  const body = await fetchJsonEnvelope<data_CampaignVO>(url, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  assertOk(body, "Save failed");
  if (body.data && typeof body.data === "object") return body.data;
  return null;
}

export async function publishCampaign(campaignId: number): Promise<void> {
  const url = campaignPublishUrl(campaignId);
  const body = await fetchJsonEnvelope(url, {
    method: "POST",
    body: JSON.stringify({ operator: "admin" }),
  });
  assertOk(body, "Publish failed");
}
