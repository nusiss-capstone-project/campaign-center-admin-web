import type { data_PaymentConfigVO } from "@/lib/reward-api/models/data_PaymentConfigVO";
import type { data_FinanceDocVO } from "@/lib/reward-api/models/data_FinanceDocVO";
import type { data_FinancePaymentVO } from "@/lib/reward-api/models/data_FinancePaymentVO";
import type { data_IssueRequestVO } from "@/lib/reward-api/models/data_IssueRequestVO";
import type { data_ProjectVO } from "@/lib/reward-api/models/data_ProjectVO";
import {
  formatRewardTimestamp,
  pickNum,
  pickStr,
} from "@/lib/admin/reward/reward-utils";

export type ProjectDisplayRow = {
  id: number;
  name: string;
  description: string;
};

export type FinanceDocDisplayRow = {
  docId: string;
  projectId: number | null;
  projectName: string;
  description: string;
  status: string;
  creator: string;
  createdAtLabel: string;
  updatedAtLabel: string;
};

export type FinancePaymentDisplayRow = {
  paymentId: string;
  amount: string;
  paymentAddress: string;
  paymentAccount: string;
  voucherType: string;
  unit: string;
  paymentStatus: string;
  offsettedAmount: string;
  offsettingAmount: string;
  refundedAmount: string;
  refundingAmount: string;
  createdAtLabel: string;
  updatedAtLabel: string;
};

export type IssueRequestDisplayRow = {
  id: number;
  projectId: number | null;
  amount: string;
  unit: string;
  voucherType: string;
  expenseType: string;
  requestStatus: string;
  creator: string;
  remark: string;
  createdAtLabel: string;
  updatedAtLabel: string;
};

export function normalizeProjectRow(
  row: Record<string, unknown>,
  index: number,
): ProjectDisplayRow | null {
  const id = pickNum(row, "id", "project_id", "projectId");
  if (id == null) return null;
  const name = pickStr(row, "name") || `Project ${index + 1}`;
  return {
    id,
    name,
    description: pickStr(row, "description"),
  };
}

export function normalizeProjectRows(
  rows: Record<string, unknown>[],
): ProjectDisplayRow[] {
  return rows
    .map((r, i) => normalizeProjectRow(r, i))
    .filter((r): r is ProjectDisplayRow => r != null);
}

export function normalizeFinanceDocRow(
  row: Record<string, unknown>,
): FinanceDocDisplayRow | null {
  const docId = pickStr(row, "doc_id", "docId");
  if (!docId) return null;

  const project = row.project;
  let projectName = "";
  if (project != null && typeof project === "object" && !Array.isArray(project)) {
    projectName = pickStr(project as Record<string, unknown>, "name");
  }

  return {
    docId,
    projectId: pickNum(row, "project_id", "projectId"),
    projectName,
    description: pickStr(row, "description"),
    status: pickStr(row, "status") || "UNKNOWN",
    creator: pickStr(row, "creator") || "—",
    createdAtLabel: formatRewardTimestamp(row.created_at ?? row.createdAt),
    updatedAtLabel: formatRewardTimestamp(row.updated_at ?? row.updatedAt),
  };
}

export function normalizeFinanceDocRows(
  rows: Record<string, unknown>[],
): FinanceDocDisplayRow[] {
  return rows
    .map((r) => normalizeFinanceDocRow(r))
    .filter((r): r is FinanceDocDisplayRow => r != null);
}

export function paymentConfigForAddress(
  payAddress: string,
  configs: data_PaymentConfigVO[],
): data_PaymentConfigVO | undefined {
  const trimmed = payAddress.trim();
  if (!trimmed) return undefined;
  return configs.find((c) => c.pay_address?.trim() === trimmed);
}

export function paymentAccountForAddress(
  payAddress: string,
  configs: data_PaymentConfigVO[],
): string {
  const trimmed = payAddress.trim();
  if (!trimmed) return "—";
  const match = paymentConfigForAddress(trimmed, configs);
  return match?.payment_account?.trim() || trimmed;
}

export function normalizeFinancePaymentRow(
  row: Record<string, unknown>,
  configs: data_PaymentConfigVO[] = [],
): FinancePaymentDisplayRow | null {
  const paymentId = pickStr(row, "payment_id", "paymentId");
  if (!paymentId) return null;
  const paymentAddress =
    pickStr(row, "payment_address", "paymentAddress") || "—";
  const config = paymentConfigForAddress(paymentAddress, configs);
  return {
    paymentId,
    amount: pickStr(row, "amount") || "0",
    paymentAddress,
    paymentAccount: config?.payment_account?.trim() || paymentAddress,
    voucherType: config?.voucher_type?.trim() || "—",
    unit: config?.unit?.trim() || "—",
    paymentStatus: pickStr(row, "payment_status", "paymentStatus") || "UNKNOWN",
    offsettedAmount: pickStr(row, "offsetted_amount", "offsettedAmount") || "0",
    offsettingAmount: pickStr(row, "offsetting_amount", "offsettingAmount") || "0",
    refundedAmount: pickStr(row, "refunded_amount", "refundedAmount") || "0",
    refundingAmount: pickStr(row, "refunding_amount", "refundingAmount") || "0",
    createdAtLabel: formatRewardTimestamp(row.created_at ?? row.createdAt),
    updatedAtLabel: formatRewardTimestamp(row.updated_at ?? row.updatedAt),
  };
}

export function normalizeFinancePaymentRows(
  rows: Record<string, unknown>[],
  configs: data_PaymentConfigVO[] = [],
): FinancePaymentDisplayRow[] {
  return rows
    .map((r) => normalizeFinancePaymentRow(r, configs))
    .filter((r): r is FinancePaymentDisplayRow => r != null);
}

export function normalizeIssueRequestRow(
  row: Record<string, unknown>,
): IssueRequestDisplayRow | null {
  const id = pickNum(row, "id", "issue_request_id", "issueRequestId");
  if (id == null) return null;
  return {
    id,
    projectId: pickNum(row, "project_id", "projectId"),
    amount: pickStr(row, "amount") || "0",
    unit: pickStr(row, "unit") || "—",
    voucherType: pickStr(row, "voucher_type", "voucherType") || "—",
    expenseType: pickStr(row, "expense_type", "expenseType") || "—",
    requestStatus: pickStr(row, "request_status", "requestStatus") || "UNKNOWN",
    creator: pickStr(row, "creator") || "—",
    remark: pickStr(row, "remark"),
    createdAtLabel: formatRewardTimestamp(row.created_at ?? row.createdAt),
    updatedAtLabel: formatRewardTimestamp(row.updated_at ?? row.updatedAt),
  };
}

export function normalizeIssueRequestRows(
  rows: Record<string, unknown>[],
): IssueRequestDisplayRow[] {
  return rows
    .map((r) => normalizeIssueRequestRow(r))
    .filter((r): r is IssueRequestDisplayRow => r != null);
}

export function financeDocVoToRecord(doc: data_FinanceDocVO): Record<string, unknown> {
  return doc as unknown as Record<string, unknown>;
}

export function projectVoToRecord(project: data_ProjectVO): Record<string, unknown> {
  return project as unknown as Record<string, unknown>;
}

export function financePaymentVoToRecord(
  payment: data_FinancePaymentVO,
): Record<string, unknown> {
  return payment as unknown as Record<string, unknown>;
}

export function issueRequestVoToRecord(
  issueRequest: data_IssueRequestVO,
): Record<string, unknown> {
  return issueRequest as unknown as Record<string, unknown>;
}
