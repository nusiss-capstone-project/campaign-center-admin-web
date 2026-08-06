import { ApiError } from "@/lib/usergroup-api/core/ApiError";
import type { data_BaseResponse } from "@/lib/usergroup-api/models/data_BaseResponse";
import type { data_CreateUserGroupRequest } from "@/lib/usergroup-api/models/data_CreateUserGroupRequest";
import type { data_UpdateUserGroupRequest } from "@/lib/usergroup-api/models/data_UpdateUserGroupRequest";
import type { data_UserGroupCountVO } from "@/lib/usergroup-api/models/data_UserGroupCountVO";
import type { data_UserGroupListItemVO } from "@/lib/usergroup-api/models/data_UserGroupListItemVO";
import type { data_UserGroupListResponse } from "@/lib/usergroup-api/models/data_UserGroupListResponse";
import type { data_UserGroupStatusVO } from "@/lib/usergroup-api/models/data_UserGroupStatusVO";
import type { data_UserGroupVO } from "@/lib/usergroup-api/models/data_UserGroupVO";
import { AdminService } from "@/lib/usergroup-api/services/AdminService";

function extractBodyMessage(body: unknown): string | null {
  if (body == null || typeof body !== "object" || Array.isArray(body)) {
    return null;
  }
  const record = body as Record<string, unknown>;
  for (const key of ["err_msg", "err_message", "message"]) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return null;
}

export function userGroupApiErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    const fromBody = extractBodyMessage(err.body);
    if (fromBody) return fromBody;
    if (err.message && err.message !== "Generic Error") return err.message;
    return `${err.status} ${err.statusText}`.trim() || "Request failed";
  }
  if (err instanceof Error) return err.message;
  return "Request failed";
}

function unwrapResponse<T>(res: data_BaseResponse & { data?: T }): T {
  if (res.code != null && res.code !== 0) {
    throw new Error(extractBodyMessage(res) ?? "Request failed");
  }
  if (res.data === undefined) {
    throw new Error("Empty response data");
  }
  return res.data;
}

export type UserGroupListParams = {
  page: number;
  pageSize: number;
  status?: string;
};

export async function listUserGroups(
  params: UserGroupListParams,
): Promise<data_UserGroupListResponse> {
  const res = await AdminService.getUsergroupMsV1AdminUsergroups(
    params.page,
    params.pageSize,
    params.status || undefined,
  );
  return unwrapResponse(res);
}

export async function getUserGroup(id: number): Promise<data_UserGroupVO> {
  const res = await AdminService.getUsergroupMsV1AdminUsergroups1(id);
  return unwrapResponse(res);
}

export async function createUserGroup(
  body: data_CreateUserGroupRequest,
): Promise<data_UserGroupVO> {
  const res = await AdminService.postUsergroupMsV1AdminUsergroups(body);
  return unwrapResponse(res);
}

export async function updateUserGroup(
  id: number,
  body: data_UpdateUserGroupRequest,
): Promise<data_UserGroupVO> {
  const res = await AdminService.putUsergroupMsV1AdminUsergroups(id, body);
  return unwrapResponse(res);
}

export async function estimateUserGroupSize(
  id: number,
): Promise<data_UserGroupCountVO> {
  const res = await AdminService.getUsergroupMsV1AdminUsergroupsCount(id);
  return unwrapResponse(res);
}

export async function publishUserGroup(
  id: number,
): Promise<data_UserGroupStatusVO> {
  const res = await AdminService.postUsergroupMsV1AdminUsergroupsPublish(id);
  return unwrapResponse(res);
}

export async function offlineUserGroup(
  id: number,
): Promise<data_UserGroupStatusVO> {
  const res = await AdminService.postUsergroupMsV1AdminUsergroupsOffline(id);
  return unwrapResponse(res);
}

/** Published (ACTIVE) groups for campaign editor import. */
export async function fetchActiveUserGroups(params?: {
  page?: number;
  pageSize?: number;
}): Promise<data_UserGroupListItemVO[]> {
  const data = await listUserGroups({
    page: params?.page ?? 1,
    pageSize: params?.pageSize ?? 200,
    status: "ACTIVE",
  });
  return Array.isArray(data.items) ? data.items : [];
}
