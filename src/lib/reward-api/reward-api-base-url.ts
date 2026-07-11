import { getPublicApiBaseUrl } from "@/lib/admin/campaign-admin-api";

/** API origin only — reward-ms paths include `/reward-ms/v1/...`. */
export function getRewardMsApiBase(): string {
  const base = getPublicApiBaseUrl();
  if (base) return base;
  return "http://localhost:8080";
}
