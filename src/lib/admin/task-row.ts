import type { TaskStatus } from "@/lib/admin/task-types";

export type TaskGroupDisplayRow = {
  id: number;
  name: string;
  status: TaskStatus;
  statusLabel: string;
};

export type TaskDisplayRow = {
  id: number;
  name: string;
  status: TaskStatus;
  statusLabel: string;
  startTime: string;
  endTime: string;
  expression: string;
  conditionCount: number;
};

function pickString(obj: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value !== "") return value;
  }
  return "";
}

function pickNumber(obj: Record<string, unknown>, keys: string[]): number {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
  }
  return NaN;
}

export function normalizeTaskStatus(raw: unknown): TaskStatus {
  const value =
    typeof raw === "string" ? raw.trim().toUpperCase() : "DRAFT";
  return value === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
}

export function taskStatusLabel(status: TaskStatus): string {
  return status === "PUBLISHED" ? "Published" : "Draft";
}

export function normalizeTaskGroupRow(raw: unknown): TaskGroupDisplayRow | null {
  if (raw == null || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  const id = pickNumber(obj, ["id"]);
  if (!Number.isFinite(id) || id <= 0) return null;

  const status = normalizeTaskStatus(obj.status);
  return {
    id,
    name: pickString(obj, ["name"]) || `Task Group ${id}`,
    status,
    statusLabel: taskStatusLabel(status),
  };
}

export function normalizeTaskGroupRows(raw: unknown[]): TaskGroupDisplayRow[] {
  return raw
    .map(normalizeTaskGroupRow)
    .filter((row): row is TaskGroupDisplayRow => row != null);
}

export function normalizeTaskRow(raw: unknown): TaskDisplayRow | null {
  if (raw == null || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  const id = pickNumber(obj, ["id"]);
  if (!Number.isFinite(id) || id <= 0) return null;

  const conditions = Array.isArray(obj.conditions) ? obj.conditions : [];
  const status = normalizeTaskStatus(obj.status);

  return {
    id,
    name: pickString(obj, ["name"]) || `Task ${id}`,
    status,
    statusLabel: taskStatusLabel(status),
    startTime: pickString(obj, ["start_time", "startTime"]),
    endTime: pickString(obj, ["end_time", "endTime"]),
    expression: pickString(obj, ["expression"]),
    conditionCount: conditions.length,
  };
}

export function normalizeTaskRows(raw: unknown[]): TaskDisplayRow[] {
  return raw
    .map(normalizeTaskRow)
    .filter((row): row is TaskDisplayRow => row != null);
}

export function isDraftStatus(status: string | undefined): boolean {
  return normalizeTaskStatus(status) === "DRAFT";
}

export function allTasksPublished(tasks: TaskDisplayRow[]): boolean {
  return tasks.length > 0 && tasks.every((task) => task.status === "PUBLISHED");
}
