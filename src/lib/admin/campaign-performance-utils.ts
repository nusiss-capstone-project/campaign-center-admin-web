import type { data_StandardResponse } from "@/lib/api/models/data_StandardResponse";
import { ApiError } from "@/lib/api/core/ApiError";

export function unwrapStandardResponse<T>(body: data_StandardResponse): T {
  if (body.code != null && body.code !== 0) {
    throw new Error(body.message ?? "Request failed");
  }
  return body.data as T;
}

export function apiErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    const msg = err.body?.message;
    if (typeof msg === "string" && msg.trim()) return msg;
    return `${err.status} ${err.statusText}`;
  }
  if (err instanceof Error) return err.message;
  return "Request failed";
}

export function pickStr(o: Record<string, unknown>, keys: string[]): string {
  for (const k of keys) {
    const v = o[k];
    if (typeof v === "string" && v.trim()) return v.trim();
    if (typeof v === "number" && Number.isFinite(v)) return String(v);
  }
  return "";
}

export function pickNum(o: Record<string, unknown>, keys: string[]): number | null {
  for (const k of keys) {
    const v = o[k];
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim() !== "") {
      const n = Number(v);
      if (Number.isFinite(n)) return n;
    }
  }
  return null;
}

export function formatAdminMoney(amount: number, currency?: string): string {
  try {
    const cur =
      currency && /^[A-Z]{3}$/i.test(currency) ? currency.toUpperCase() : "USD";
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: cur,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return String(amount);
  }
}

export function formatYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function defaultPerformanceDateRange(): {
  startDate: string;
  endDate: string;
} {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  return { startDate: formatYmd(start), endDate: formatYmd(end) };
}

export function formatJoinAt(raw: string): string {
  if (!raw) return "—";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleString();
}
