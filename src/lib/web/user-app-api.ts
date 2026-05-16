import { AdminCampaignService } from "@/lib/api/services/AdminCampaignService";
import { UserAccountService } from "@/lib/api/services/UserAccountService";
import type { data_StandardResponse } from "@/lib/api/models/data_StandardResponse";
import { ApiError } from "@/lib/api/core/ApiError";
import { normalizeCampaignRows } from "@/lib/admin/campaign-row";

export const DEFAULT_WEB_USER_ID = 10001;
export const DEFAULT_WEB_CURRENCY = "USDT";

export type WalletSummary = {
  availableBalance: number;
  campaignRewards: number;
  totalRecharged: number;
  currency: string;
};

export type WalletTransaction = {
  id: number | null;
  transactionNo: string;
  type: string;
  title: string;
  amount: number;
  currency: string;
  status: string;
  balanceAfter: number | null;
  createdAt: string;
};

export type WalletTransactionsResult = {
  rows: WalletTransaction[];
  nextCursor: number | null;
  total: number | null;
};

export type UserCampaignCard = {
  id: number;
  title: string;
  description: string;
  periodLabel: string;
  statusLabel: string;
  rewardLabel: string;
  participantLabel: string;
};

function unwrap<T>(body: data_StandardResponse): T {
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
  return err instanceof Error ? err.message : "Request failed";
}

function asRecord(v: unknown): Record<string, unknown> | null {
  return v && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : null;
}

function pickStr(o: Record<string, unknown> | null, keys: string[]): string {
  if (!o) return "";
  for (const key of keys) {
    const v = o[key];
    if (typeof v === "string" && v.trim()) return v.trim();
    if (typeof v === "number" && Number.isFinite(v)) return String(v);
  }
  return "";
}

function pickNum(o: Record<string, unknown> | null, keys: string[]): number {
  if (!o) return 0;
  for (const key of keys) {
    const v = o[key];
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim()) {
      const n = Number(v);
      if (Number.isFinite(n)) return n;
    }
  }
  return 0;
}

function pickNullableNum(
  o: Record<string, unknown> | null,
  keys: string[],
): number | null {
  if (!o) return null;
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

export function formatMoney(amount: number, currency = DEFAULT_WEB_CURRENCY) {
  const cur = /^[A-Z]{3,5}$/i.test(currency) ? currency.toUpperCase() : "USD";
  try {
    return new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount) + ` ${cur}`;
  } catch {
    return `${amount} ${cur}`;
  }
}

export function formatDateTime(raw: string): string {
  if (!raw) return "—";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function normalizeWalletSummary(data: unknown): WalletSummary {
  const o = asRecord(data);
  return {
    availableBalance: pickNum(o, [
      "availableBalance",
      "available_balance",
      "balance",
    ]),
    campaignRewards: pickNum(o, [
      "campaignRewards",
      "campaignRewardAmount",
      "totalCampaignRewards",
      "rewardAmount",
      "reward_amount",
    ]),
    totalRecharged: pickNum(o, [
      "totalRecharged",
      "totalRechargeAmount",
      "rechargedAmount",
      "rechargeAmount",
      "total_recharged",
    ]),
    currency: pickStr(o, ["currency"]) || DEFAULT_WEB_CURRENCY,
  };
}

export function normalizeTransactions(data: unknown): WalletTransactionsResult {
  const o = asRecord(data);
  const rawItems = Array.isArray(data)
    ? data
    : Array.isArray(o?.items)
      ? (o.items as unknown[])
      : Array.isArray(o?.records)
        ? (o.records as unknown[])
        : [];

  const rows = rawItems.map((item, index): WalletTransaction => {
    const row = asRecord(item);
    const type = pickStr(row, ["type", "transactionType", "transaction_type"]);
    const transactionNo =
      pickStr(row, ["transactionNo", "transaction_no", "txNo", "id"]) ||
      `TX-${index + 1}`;
    const amount = pickNum(row, ["amount", "transactionAmount"]);
    const currency = pickStr(row, ["currency"]) || DEFAULT_WEB_CURRENCY;
    return {
      id: pickNullableNum(row, ["id", "transactionId", "transaction_id"]),
      transactionNo,
      type,
      title: type.replace(/_/g, " ") || "Transaction",
      amount,
      currency,
      status: pickStr(row, ["status", "transactionStatus"]) || "Completed",
      balanceAfter: pickNullableNum(row, [
        "balanceAfter",
        "balance_after",
        "afterBalance",
      ]),
      createdAt: pickStr(row, ["createdAt", "created_at", "time", "joinAt"]),
    };
  });

  const total = pickNullableNum(o, ["total", "totalCount"]);
  const explicitNextCursor = pickNullableNum(o, [
    "nextCursor",
    "next_cursor",
    "cursor",
  ]);
  const nextCursor =
    explicitNextCursor ?? (rows.length > 0 ? rows[rows.length - 1].id : null);

  return { rows, nextCursor, total };
}

export async function fetchWalletSummary(
  userId: number,
  currency = DEFAULT_WEB_CURRENCY,
): Promise<WalletSummary> {
  const body = await UserAccountService.getWebAccountSummary(userId, currency);
  return normalizeWalletSummary(unwrap<unknown>(body));
}

export async function fetchWalletTransactions(params: {
  userId: number;
  type?: string;
  cursor?: number;
  limit?: number;
}): Promise<WalletTransactionsResult> {
  const body = await UserAccountService.getWebAccountTransactions(
    params.userId,
    params.type,
    params.cursor,
    params.limit,
  );
  return normalizeTransactions(unwrap<unknown>(body));
}

function campaignRewardLabel(raw: Record<string, unknown>): string {
  const amount = pickNullableNum(raw, [
    "rewardAmount",
    "rewardIssuedAmount",
    "totalRewardAmount",
  ]);
  const currency = pickStr(raw, ["currency"]) || DEFAULT_WEB_CURRENCY;
  return amount != null ? `${formatMoney(amount, currency)} rewards` : "Rewards available";
}

export async function fetchUserCampaignCards(): Promise<UserCampaignCard[]> {
  // Generated user-facing service currently has detail/join/top-up only; use generated campaign list
  // service and show published campaigns in the user experience.
  const body = await AdminCampaignService.getAdminCampaigns(1, 30, 2);
  const data = unwrap<unknown>(body);
  const o = asRecord(data);
  const rawItems = Array.isArray(data)
    ? data
    : Array.isArray(o?.items)
      ? (o.items as Record<string, unknown>[])
      : [];

  return normalizeCampaignRows(rawItems).map((row, index) => {
    const raw = rawItems[index] ?? {};
    const description =
      pickStr(raw, ["description", "subtitle", "summary"]) ||
      `${row.targetMarket} · ${row.segment}`;
    const participants = pickNullableNum(raw, [
      "participantCount",
      "participants",
      "participationCount",
    ]);
    return {
      id: row.id,
      title: row.name,
      description,
      periodLabel: row.periodLabel,
      statusLabel: row.statusLabel,
      rewardLabel: campaignRewardLabel(raw),
      participantLabel:
        participants != null ? `${participants.toLocaleString()} participants` : "Open to users",
    };
  });
}
