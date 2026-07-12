import { ApiError } from "@/lib/reward-api/core/ApiError";
import type { data_BaseResponse } from "@/lib/reward-api/models/data_BaseResponse";

function extractRewardApiBodyMessage(body: unknown): string | null {
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

export function rewardApiErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    const fromBody = extractRewardApiBodyMessage(err.body);
    if (fromBody) return fromBody;
    if (err.message && err.message !== "Generic Error") return err.message;
    return `${err.status} ${err.statusText}`.trim() || "Request failed";
  }
  if (err instanceof Error) return err.message;
  return "Request failed";
}

export function unwrapRewardResponse<T>(res: data_BaseResponse & { data?: T }): T {
  if (res.code != null && res.code !== 0) {
    throw new Error(extractRewardApiBodyMessage(res) ?? "Request failed");
  }
  if (res.data === undefined) {
    throw new Error("Empty response data");
  }
  return res.data;
}

export function unwrapRewardResponseNullable<T>(
  res: data_BaseResponse & { data?: T },
): T | null {
  if (res.code != null && res.code !== 0) {
    throw new Error(extractRewardApiBodyMessage(res) ?? "Request failed");
  }
  return res.data ?? null;
}

export function pageItems(raw: unknown): Record<string, unknown>[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (item): item is Record<string, unknown> =>
      item != null && typeof item === "object" && !Array.isArray(item),
  );
}

export function pickStr(
  o: Record<string, unknown>,
  ...keys: string[]
): string {
  for (const key of keys) {
    const v = o[key];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}

export function pickNum(
  o: Record<string, unknown>,
  ...keys: string[]
): number | null {
  for (const key of keys) {
    const v = o[key];
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim()) {
      const n = Number(v);
      if (Number.isFinite(n)) return n;
    }
  }
  return null;
}

export function formatRewardTimestamp(raw: unknown): string {
  if (typeof raw !== "string" || !raw.trim()) return "—";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const NUMERIC_STRING_PATTERN = /^-?\d+(\.\d+)?$/;

export function formatMoneyDecimal(raw: string, fractionDigits = 2): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (!NUMERIC_STRING_PATTERN.test(trimmed)) return trimmed;
  const value = Number(trimmed);
  if (!Number.isFinite(value)) return trimmed;
  return value.toFixed(fractionDigits);
}

export function hasAtMostDecimalPlaces(value: string, places: number): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  const match = trimmed.match(/^-?\d+(?:\.(\d+))?$/);
  if (!match) return false;
  return !match[1] || match[1].length <= places;
}
