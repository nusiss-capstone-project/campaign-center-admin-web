import { buildPublicApiUrl } from "@/lib/admin/campaign-admin-api";
import type {
  DataMetricVO,
  MetricOperatorVO,
  PublishStatusVO,
  TaskEnvelope,
  TaskGroupVO,
  TaskVO,
} from "@/lib/admin/task-types";
import { withClerkAuthorization } from "@/lib/auth/clerk-token";

function buildTaskApiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return buildPublicApiUrl(`/task-ms/v1${p}`);
}

function unwrapTaskEnvelope<T>(body: TaskEnvelope<T>): T {
  if (body.code != null && body.code !== 0) {
    throw new Error(body.err_msg ?? "Request failed");
  }
  return body.data as T;
}

export async function fetchTaskJsonEnvelope<T = unknown>(
  url: string,
  init?: RequestInit,
): Promise<T> {
  const headers = new Headers(init?.headers);
  if (init?.body != null && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  await withClerkAuthorization(url, headers);
  const res = await fetch(url, { ...init, headers });
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }
  const body = (await res.json()) as TaskEnvelope<T>;
  return unwrapTaskEnvelope(body);
}

export function taskGroupsListUrl(): string {
  return buildTaskApiUrl("/task-groups");
}

export function taskGroupPublishUrl(taskGroupId: number): string {
  return buildTaskApiUrl(`/task-groups/${taskGroupId}`);
}

export function tasksByGroupUrl(taskGroupId: number): string {
  return buildTaskApiUrl(`/task-group/${taskGroupId}/tasks`);
}

export function taskDetailUrl(taskGroupId: number, taskId: number): string {
  return buildTaskApiUrl(`/task-group/${taskGroupId}/tasks/${taskId}`);
}

export function taskPublishUrl(taskId: number): string {
  return buildTaskApiUrl(`/tasks/${taskId}`);
}

export function dataMetricsUrl(): string {
  return buildTaskApiUrl("/data-metrics");
}

export function dataMetricOperatorsUrl(): string {
  return buildTaskApiUrl("/data-metric-operators");
}

export async function fetchTaskGroups(): Promise<TaskGroupVO[]> {
  const data = await fetchTaskJsonEnvelope<TaskGroupVO[]>(taskGroupsListUrl(), {
    method: "GET",
  });
  return Array.isArray(data) ? data : [];
}

export async function saveTaskGroup(payload: TaskGroupVO): Promise<TaskGroupVO> {
  return fetchTaskJsonEnvelope<TaskGroupVO>(taskGroupsListUrl(), {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function publishTaskGroup(taskGroupId: number): Promise<PublishStatusVO> {
  return fetchTaskJsonEnvelope<PublishStatusVO>(taskGroupPublishUrl(taskGroupId), {
    method: "PATCH",
    body: JSON.stringify({ id: taskGroupId, status: "PUBLISHED" }),
  });
}

export async function fetchTasksByGroup(taskGroupId: number): Promise<TaskVO[]> {
  const data = await fetchTaskJsonEnvelope<TaskVO[]>(tasksByGroupUrl(taskGroupId), {
    method: "GET",
  });
  return Array.isArray(data) ? data : [];
}

export async function fetchTaskDetail(
  taskGroupId: number,
  taskId: number,
): Promise<TaskVO> {
  return fetchTaskJsonEnvelope<TaskVO>(taskDetailUrl(taskGroupId, taskId), {
    method: "GET",
  });
}

export async function createTask(
  taskGroupId: number,
  payload: TaskVO,
): Promise<TaskVO> {
  return fetchTaskJsonEnvelope<TaskVO>(tasksByGroupUrl(taskGroupId), {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function saveTask(
  taskGroupId: number,
  taskId: number,
  payload: TaskVO,
): Promise<TaskVO> {
  return fetchTaskJsonEnvelope<TaskVO>(taskDetailUrl(taskGroupId, taskId), {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function publishTask(taskId: number): Promise<PublishStatusVO> {
  return fetchTaskJsonEnvelope<PublishStatusVO>(taskPublishUrl(taskId), {
    method: "PATCH",
    body: JSON.stringify({ id: taskId, status: "PUBLISHED" }),
  });
}

export async function fetchDataMetrics(): Promise<DataMetricVO[]> {
  const data = await fetchTaskJsonEnvelope<DataMetricVO[]>(dataMetricsUrl(), {
    method: "GET",
  });
  return Array.isArray(data) ? data : [];
}

export async function fetchDataMetricOperators(): Promise<MetricOperatorVO[]> {
  const data = await fetchTaskJsonEnvelope<MetricOperatorVO[]>(
    dataMetricOperatorsUrl(),
    { method: "GET" },
  );
  return Array.isArray(data) ? data : [];
}
