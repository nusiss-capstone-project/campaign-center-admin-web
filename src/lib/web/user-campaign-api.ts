import type { api_JoinCampaignReq } from "@/lib/api/models/api_JoinCampaignReq";
import type { api_SimulateTopUpReq } from "@/lib/api/models/api_SimulateTopUpReq";
import type { StandardEnvelope } from "@/lib/admin/campaign-admin-api";
import { buildPublicApiUrl } from "@/lib/admin/campaign-admin-api";
import { fetchJsonEnvelope } from "@/lib/admin/campaign-admin-fetch";
import { withClerkAuthorization } from "@/lib/auth/clerk-token";

export function buildCampaignLandingPageUrl(
  campaignId: number,
  query?: { userId?: number; lang?: string },
): string {
  const base = buildPublicApiUrl(
    `/campaign-center-api/v1/web/campaigns/${campaignId}/landing-page`,
  );
  const usp = new URLSearchParams();
  if (query?.userId != null && Number.isFinite(query.userId)) {
    usp.set("userId", String(query.userId));
  }
  if (query?.lang?.trim()) {
    usp.set("lang", query.lang.trim());
  }
  const qs = usp.toString();
  return qs ? `${base}?${qs}` : base;
}

export async function fetchCampaignLandingPage(
  campaignId: number,
  query?: { userId?: number; lang?: string },
): Promise<StandardEnvelope<unknown>> {
  const url = buildCampaignLandingPageUrl(campaignId, query);
  return fetchJsonEnvelope(url, { method: "GET" });
}

async function postWebEnvelope<T>(
  path: string,
  body: unknown,
): Promise<StandardEnvelope<T>> {
  const url = buildPublicApiUrl(path);
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  await withClerkAuthorization(url, headers);
  const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
  const json = (await res.json()) as StandardEnvelope<T>;
  if (!res.ok) {
    throw new Error(json.message ?? `${res.status} ${res.statusText}`);
  }
  return json;
}

export async function postCampaignJoin(
  campaignId: number,
  payload: api_JoinCampaignReq,
): Promise<StandardEnvelope<unknown>> {
  return postWebEnvelope(
    `/campaign-center-api/v1/web/campaigns/${campaignId}/join`,
    payload,
  );
}

export async function postCampaignTopUp(
  campaignId: number,
  payload: api_SimulateTopUpReq,
): Promise<StandardEnvelope<unknown>> {
  return postWebEnvelope(
    `/campaign-center-api/v1/web/campaigns/${campaignId}/top-up`,
    payload,
  );
}
