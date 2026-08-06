import {
  normalizeAdminRole,
  type AdminRole,
} from "@/lib/admin/rbac/roles";

/** Shared post-login landing — no role-specific redirect. */
export const ADMIN_HOME_PATH = "/admin";

export function homePathForRole(role: AdminRole | null): string {
  if (!role) return "/forbidden";
  return ADMIN_HOME_PATH;
}

export function homePathForRoleRaw(raw: unknown): string {
  return homePathForRole(normalizeAdminRole(raw));
}

/**
 * Path-level gate for admin UI (Clerk metadata roles).
 * `/admin` home is open to every admin role; menus enforce finer UI access.
 * Backend APIs must still enforce their own RBAC.
 */
export function canAccessAdminPath(
  role: AdminRole | null,
  pathname: string,
): boolean {
  if (!role) return false;
  if (role === "admin") return true;

  const path = pathname.split("?")[0] || pathname;

  // Default home: no further path ACL.
  if (path === "/admin" || path === "/admin/") return true;

  if (role === "campaign_ops") {
    if (path.startsWith("/admin/settings")) return false;
    return (
      path.startsWith("/admin/campaigns") ||
      path.startsWith("/admin/landing-pages") ||
      path.startsWith("/admin/user-groups") ||
      path.startsWith("/admin/task-group") ||
      path.startsWith("/admin/rewards") ||
      path.startsWith("/admin/help")
    );
  }

  if (role === "finance_admin") {
    return (
      path.startsWith("/admin/rewards/projects") ||
      path.startsWith("/admin/rewards/finance-docs") ||
      path.startsWith("/admin/help")
    );
  }

  return false;
}
