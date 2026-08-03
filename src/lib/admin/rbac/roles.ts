/** Admin console roles from identity-ms current-user. */
export type AdminRole = "admin" | "campaign_ops" | "finance_admin";

export const ADMIN_ROLES: readonly AdminRole[] = [
  "admin",
  "campaign_ops",
  "finance_admin",
] as const;

export function normalizeAdminRole(raw: unknown): AdminRole | null {
  if (typeof raw !== "string") return null;
  const value = raw.trim().toLowerCase();
  if (value === "admin") return "admin";
  if (value === "campaign_ops" || value === "campaign-ops") return "campaign_ops";
  if (value === "finance_admin" || value === "finance-admin") {
    return "finance_admin";
  }
  return null;
}

export function adminRoleLabel(role: AdminRole | null): string {
  if (role === "admin") return "Admin";
  if (role === "campaign_ops") return "Campaign Ops";
  if (role === "finance_admin") return "Finance Admin";
  return "Unknown";
}
