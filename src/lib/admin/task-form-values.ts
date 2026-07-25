import { format, isValid, parseISO } from "date-fns";

import type { TaskConditionVO, TaskVO } from "@/lib/admin/task-types";
import { normalizeTaskStatus } from "@/lib/admin/task-row";

export type TaskConditionFormValues = {
  no: number;
  metricId: string;
  operatorId: string;
  metricValue: string;
};

export type TaskFormValues = {
  name: string;
  status: string;
  startTime: string;
  endTime: string;
  expression: string;
  conditions: TaskConditionFormValues[];
};

export type TaskGroupFormValues = {
  name: string;
};

export function emptyTaskGroupFormValues(): TaskGroupFormValues {
  return { name: "" };
}

export function emptyTaskFormValues(): TaskFormValues {
  return {
    name: "",
    status: "DRAFT",
    startTime: "",
    endTime: "",
    expression: "",
    conditions: [emptyCondition(1)],
  };
}

export function emptyCondition(no: number): TaskConditionFormValues {
  return {
    no,
    metricId: "",
    operatorId: "",
    metricValue: "",
  };
}

export function renumberConditions(
  conditions: TaskConditionFormValues[],
): TaskConditionFormValues[] {
  return conditions.map((condition, index) => ({
    ...condition,
    no: index + 1,
  }));
}

function pickString(obj: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string") return value;
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }
  return "";
}

function parseCondition(raw: unknown, fallbackNo: number): TaskConditionFormValues {
  if (raw == null || typeof raw !== "object") {
    return emptyCondition(fallbackNo);
  }
  const obj = raw as Record<string, unknown>;
  const noRaw = obj.no;
  const no =
    typeof noRaw === "number" && Number.isFinite(noRaw) ? noRaw : fallbackNo;

  return {
    no,
    metricId: pickString(obj, ["metric_id", "metricId"]),
    operatorId: pickString(obj, ["operator_id", "operatorId"]),
    metricValue: pickString(obj, ["metric_value", "metricValue"]),
  };
}

export function parseTaskDetailToFormValues(raw: unknown): TaskFormValues {
  if (raw == null || typeof raw !== "object") {
    return emptyTaskFormValues();
  }
  const obj = raw as Record<string, unknown>;
  const rawConditions = Array.isArray(obj.conditions) ? obj.conditions : [];
  const conditions =
    rawConditions.length > 0
      ? rawConditions.map((item, index) => parseCondition(item, index + 1))
      : [emptyCondition(1)];

  return {
    name: pickString(obj, ["name"]),
    status: normalizeTaskStatus(obj.status),
    startTime: apiTimeToDatetimeLocal(pickString(obj, ["start_time", "startTime"])),
    endTime: apiTimeToDatetimeLocal(pickString(obj, ["end_time", "endTime"])),
    expression: pickString(obj, ["expression"]),
    conditions: renumberConditions(conditions),
  };
}

export function apiTimeToDatetimeLocal(value: string): string {
  if (!value) return "";
  const normalized = value.includes("T") ? value : value.replace(" ", "T");
  const d = parseISO(normalized);
  if (!isValid(d)) return value;
  return format(d, "yyyy-MM-dd'T'HH:mm");
}

export function datetimeLocalToApiTime(value: string): string {
  if (!value.trim()) return "";
  const d = parseISO(value);
  if (!isValid(d)) return value.trim();
  return format(d, "yyyy-MM-dd HH:mm:ss");
}

export function validateExpression(
  expression: string,
  conditionCount: number,
): string | null {
  const trimmed = expression.trim();
  if (!trimmed) return "Condition expression is required.";

  const compact = trimmed.replace(/\s+/g, "");
  if (!/^[\d&|()]+$/.test(compact)) {
    return "Expression may only contain numbers, &, |, (, ).";
  }

  const numbers = compact.match(/\d+/g) ?? [];
  if (numbers.length === 0) {
    return "Expression must reference at least one condition number.";
  }

  for (const token of numbers) {
    const n = Number(token);
    if (!Number.isInteger(n) || n < 1 || n > conditionCount) {
      return `Expression references invalid condition number ${token}. Use 1 to ${conditionCount}.`;
    }
  }

  return null;
}

function parseRequiredNumber(
  value: string,
  label: string,
): number {
  const trimmed = value.trim();
  if (!trimmed) throw new Error(`${label} is required.`);
  const n = Number(trimmed);
  if (!Number.isFinite(n) || n <= 0) {
    throw new Error(`${label} must be a positive number.`);
  }
  return n;
}

export function toTaskPayload(values: TaskFormValues): TaskVO {
  if (!values.name.trim()) {
    throw new Error("Task name is required.");
  }
  if (!values.startTime.trim() || !values.endTime.trim()) {
    throw new Error("Start time and end time are required.");
  }

  const conditions = renumberConditions(values.conditions);
  const expressionError = validateExpression(values.expression, conditions.length);
  if (expressionError) throw new Error(expressionError);

  const payloadConditions: TaskConditionVO[] = conditions.map((condition) => ({
    no: condition.no,
    metric_id: parseRequiredNumber(condition.metricId, "Metric"),
    operator_id: parseRequiredNumber(condition.operatorId, "Operator"),
    metric_value: condition.metricValue.trim(),
  }));

  for (const condition of payloadConditions) {
    if (!condition.metric_value) {
      throw new Error(`Value for condition ${condition.no} is required.`);
    }
  }

  return {
    name: values.name.trim(),
    start_time: datetimeLocalToApiTime(values.startTime),
    end_time: datetimeLocalToApiTime(values.endTime),
    expression: values.expression.trim(),
    conditions: payloadConditions,
  };
}

export function toTaskGroupPayload(values: TaskGroupFormValues, id?: number): {
  id?: number;
  name: string;
} {
  if (!values.name.trim()) {
    throw new Error("Task group name is required.");
  }
  return id != null ? { id, name: values.name.trim() } : { name: values.name.trim() };
}
