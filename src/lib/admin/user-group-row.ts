import type { data_UserGroupListItemVO } from "@/lib/usergroup-api/models/data_UserGroupListItemVO";
import { isUserGroupStatus } from "@/lib/admin/user-group-fields";

export type UserGroupDisplayRow = {
  id: number;
  name: string;
  status: string;
};

export function normalizeUserGroupRows(
  items: data_UserGroupListItemVO[] | unknown[],
): UserGroupDisplayRow[] {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const o = item as Record<string, unknown>;
      const id = typeof o.id === "number" ? o.id : Number(o.id);
      if (!Number.isFinite(id) || id <= 0) return null;
      const name = typeof o.name === "string" ? o.name : "";
      const statusRaw = typeof o.status === "string" ? o.status : "";
      const status = isUserGroupStatus(statusRaw) ? statusRaw : statusRaw || "—";
      return { id, name, status };
    })
    .filter((row): row is UserGroupDisplayRow => row != null);
}

export function userGroupStatusLabel(status: string): string {
  switch (status) {
    case "DRAFT":
      return "Draft";
    case "ACTIVE":
      return "Active";
    case "OFFLINE":
      return "Offline";
    default:
      return status || "—";
  }
}
