import { buildPublicApiUrl } from "@/lib/admin/campaign-admin-api";
import { withClerkAuthorization } from "@/lib/auth/clerk-token";
import { normalizeAdminRole, type AdminRole } from "@/lib/admin/rbac/roles";

export type CurrentUser = {
  userId: number | null;
  username: string;
  role: AdminRole | null;
  roleRaw: string;
};

type CurrentUserEnvelope = {
  code?: number;
  message?: string;
  err_msg?: string;
  data?: {
    userId?: number;
    username?: string;
    role?: string;
  };
};

export function currentUserUrl(): string {
  return buildPublicApiUrl("/identity-ms/v1/admin/current-user");
}

function pickUsername(data: CurrentUserEnvelope["data"]): string {
  if (!data) return "";
  const name = data.username;
  return typeof name === "string" ? name.trim() : "";
}

function parseCurrentUserBody(body: CurrentUserEnvelope): CurrentUser {
  const data = body.data;
  const roleRaw = typeof data?.role === "string" ? data.role.trim() : "";
  const userId =
    typeof data?.userId === "number" && Number.isFinite(data.userId)
      ? data.userId
      : null;

  return {
    userId,
    username: pickUsername(data),
    role: normalizeAdminRole(roleRaw),
    roleRaw,
  };
}

export async function fetchCurrentUser(): Promise<CurrentUser> {
  const url = currentUserUrl();
  const headers = new Headers();
  await withClerkAuthorization(url, headers);
  const res = await fetch(url, { method: "GET", headers });
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }
  const body = (await res.json()) as CurrentUserEnvelope;
  if (body.code != null && body.code !== 0) {
    throw new Error(body.message ?? body.err_msg ?? "Failed to load current user");
  }
  return parseCurrentUserBody(body);
}

/**
 * Server/middleware: resolve role from identity-ms with an explicit Bearer token.
 * This is the source of truth (Clerk metadata alone is not enough for finance_admin).
 */
export async function fetchCurrentUserWithToken(
  token: string,
): Promise<CurrentUser | null> {
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");
  if (!base || !token) return null;

  const url = `${base}/identity-ms/v1/admin/current-user`;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const body = (await res.json()) as CurrentUserEnvelope;
    if (body.code != null && body.code !== 0) return null;
    return parseCurrentUserBody(body);
  } catch {
    return null;
  }
}

export function initialsFromUsername(username: string): string {
  const parts = username.trim().split(/[\s._-]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}
