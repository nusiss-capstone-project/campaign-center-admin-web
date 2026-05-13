import { readPublicEnv } from "@/lib/read-env";

/** Public API origin (no trailing slash), e.g. `https://host` */
export function getPublicApiBaseUrl(): string {
  return (readPublicEnv("NEXT_PUBLIC_API_BASE_URL") ?? "").replace(/\/$/, "");
}

/** Path must start with `/`, e.g. `/campaign-center-api/v1/admin/campaigns` */
export function buildPublicApiUrl(path: string): string {
  const base = getPublicApiBaseUrl();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export type StandardEnvelope<T = unknown> = {
  code?: number;
  message?: string;
  data?: T;
};
