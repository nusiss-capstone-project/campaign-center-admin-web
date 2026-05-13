import type { api_UpdateCampaignReq } from "@/lib/api/models/api_UpdateCampaignReq";
import type { StandardEnvelope } from "@/lib/admin/campaign-admin-api";
import { buildPublicApiUrl } from "@/lib/admin/campaign-admin-api";

export async function fetchJsonEnvelope<T = unknown>(
  url: string,
  init?: RequestInit,
): Promise<StandardEnvelope<T>> {
  const headers = new Headers(init?.headers);
  if (init?.body != null && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(url, { ...init, headers });
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }
  return (await res.json()) as StandardEnvelope<T>;
}

export function campaignDetailUrl(id: number): string {
  return buildPublicApiUrl(
    `/campaign-center-api/v1/admin/campaigns/${id}`,
  );
}

export function campaignPublishUrl(id: number): string {
  return buildPublicApiUrl(
    `/campaign-center-api/v1/admin/campaigns/${id}/publish`,
  );
}

/** Matches OpenAPI: POST /admin/campaigns/{campaignId}/archive (+ api_PublishOperatorReq body). */
export function campaignArchiveUrl(id: number): string {
  return buildPublicApiUrl(
    `/campaign-center-api/v1/admin/campaigns/${id}/archive`,
  );
}

export async function publishCampaign(campaignId: number): Promise<void> {
  const url = campaignPublishUrl(campaignId);
  const body = await fetchJsonEnvelope(url, {
    method: "POST",
    body: JSON.stringify({ operator: "admin" }),
  });
  if (body.code != null && body.code !== 0) {
    throw new Error(body.message ?? "Publish failed");
  }
}

export async function archiveCampaign(campaignId: number): Promise<void> {
  const url = campaignArchiveUrl(campaignId);
  const body = await fetchJsonEnvelope(url, {
    method: "POST",
    body: JSON.stringify({ operator: "admin" }),
  });
  if (body.code != null && body.code !== 0) {
    throw new Error(body.message ?? "Archive failed");
  }
}

export async function fetchCampaignDetail(
  campaignId: number,
): Promise<unknown> {
  const url = campaignDetailUrl(campaignId);
  const body = await fetchJsonEnvelope(url, { method: "GET" });
  if (body.code != null && body.code !== 0) {
    throw new Error(body.message ?? "Load failed");
  }
  return body.data ?? null;
}

export async function updateCampaign(
  campaignId: number,
  payload: api_UpdateCampaignReq,
): Promise<void> {
  const url = campaignDetailUrl(campaignId);
  const body = await fetchJsonEnvelope(url, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  if (body.code != null && body.code !== 0) {
    throw new Error(body.message ?? "Update failed");
  }
}
