import { getPublicApiBaseUrl } from "@/lib/admin/campaign-admin-api";

/** API origin only — usergroup-ms paths include `/usergroup-ms/v1/...`. */
export function getUsergroupMsApiBase(): string {
  const base = getPublicApiBaseUrl();
  if (base) return base;
  return "http://localhost:8080";
}
