import type { data_ApplicationDetailItemVO } from "@/lib/reward-api/models/data_ApplicationDetailItemVO";
import type { data_CreateFinanceDocRequest } from "@/lib/reward-api/models/data_CreateFinanceDocRequest";
import type { data_CreateFinancePaymentRequest } from "@/lib/reward-api/models/data_CreateFinancePaymentRequest";
import type { data_CreateIssueRequestRequest } from "@/lib/reward-api/models/data_CreateIssueRequestRequest";
import type { data_FinanceDocVO } from "@/lib/reward-api/models/data_FinanceDocVO";
import type { data_UpdateFinanceDocContentRequest } from "@/lib/reward-api/models/data_UpdateFinanceDocContentRequest";
import type { data_UpdateIssueRequestRequest } from "@/lib/reward-api/models/data_UpdateIssueRequestRequest";
import { EXPENSE_TYPE_OPTIONS } from "@/lib/admin/reward/reward-options";

export type ApplicationDetailFormRow = {
  amount: string;
  payAddress: string;
};

export type FinanceDocFormValues = {
  projectId: string;
  description: string;
  applicationDetail: ApplicationDetailFormRow[];
};

export type IssueRequestFormValues = {
  amount: string;
  unit: string;
  voucherType: string;
  expenseType: string;
  remark: string;
};

export type FinancePaymentFormValues = {
  amount: string;
  paymentAddress: string;
  unit: string;
};

export function emptyApplicationDetailRow(): ApplicationDetailFormRow {
  return { amount: "", payAddress: "" };
}

export function emptyFinanceDocFormValues(): FinanceDocFormValues {
  return {
    projectId: "",
    description: "",
    applicationDetail: [emptyApplicationDetailRow()],
  };
}

export function emptyIssueRequestFormValues(): IssueRequestFormValues {
  return {
    amount: "",
    unit: "",
    voucherType: "",
    expenseType: EXPENSE_TYPE_OPTIONS[0].value,
    remark: "",
  };
}

export function emptyFinancePaymentFormValues(): FinancePaymentFormValues {
  return {
    amount: "",
    paymentAddress: "",
    unit: "",
  };
}

export function parseFinanceDocToFormValues(
  doc: data_FinanceDocVO,
): FinanceDocFormValues {
  const detail = doc.application_detail ?? [];
  return {
    projectId: doc.project_id != null ? String(doc.project_id) : "",
    description: doc.description ?? "",
    applicationDetail:
      detail.length > 0
        ? detail.map((item) => ({
            amount: item.amount ?? "",
            payAddress: item.pay_address ?? "",
          }))
        : [emptyApplicationDetailRow()],
  };
}

export function parseIssueRequestToFormValues(
  row: Record<string, unknown>,
): IssueRequestFormValues {
  const expenseType =
    typeof row.expense_type === "string"
      ? row.expense_type
      : typeof row.expenseType === "string"
        ? row.expenseType
        : EXPENSE_TYPE_OPTIONS[0].value;
  return {
    amount:
      typeof row.amount === "string"
        ? row.amount
        : row.amount != null
          ? String(row.amount)
          : "",
    unit:
      typeof row.unit === "string"
        ? row.unit
        : row.unit != null
          ? String(row.unit)
          : "",
    voucherType:
      typeof row.voucher_type === "string"
        ? row.voucher_type
        : typeof row.voucherType === "string"
          ? row.voucherType
          : "",
    expenseType,
    remark: typeof row.remark === "string" ? row.remark : "",
  };
}

function toApplicationDetailPayload(
  rows: ApplicationDetailFormRow[],
): data_ApplicationDetailItemVO[] {
  const payload = rows
    .map((row) => ({
      amount: row.amount.trim(),
      pay_address: row.payAddress.trim(),
    }))
    .filter((row) => row.amount && row.pay_address);

  if (payload.length === 0) {
    throw new Error("At least one application detail row is required.");
  }
  return payload;
}

export function toCreateFinanceDocPayload(
  values: FinanceDocFormValues,
): data_CreateFinanceDocRequest {
  const projectId = Number(values.projectId.trim());
  if (!Number.isFinite(projectId) || projectId <= 0) {
    throw new Error("Project is required.");
  }
  return {
    project_id: projectId,
    description: values.description.trim() || undefined,
    application_detail: toApplicationDetailPayload(values.applicationDetail),
  };
}

export function toUpdateFinanceDocPayload(
  values: FinanceDocFormValues,
): data_UpdateFinanceDocContentRequest {
  return {
    description: values.description.trim() || undefined,
    application_detail: toApplicationDetailPayload(values.applicationDetail),
  };
}

export function toCreateFinancePaymentPayload(
  values: FinancePaymentFormValues,
): data_CreateFinancePaymentRequest {
  const amount = values.amount.trim();
  const paymentAddress = values.paymentAddress.trim();
  const unit = values.unit.trim();
  if (!amount) throw new Error("Amount is required.");
  if (!paymentAddress) throw new Error("Payment address is required.");
  if (!unit) throw new Error("Unit is required.");
  return { amount, payment_address: paymentAddress, unit };
}

export function toCreateIssueRequestPayload(
  values: IssueRequestFormValues,
): data_CreateIssueRequestRequest {
  const amount = values.amount.trim();
  const unit = values.unit.trim();
  const voucherType = values.voucherType.trim();
  if (!amount) throw new Error("Amount is required.");
  if (!unit) throw new Error("Unit is required.");
  if (!voucherType) throw new Error("Voucher type is required.");
  return {
    amount,
    unit,
    voucher_type: voucherType,
    expense_type:
      values.expenseType as data_CreateIssueRequestRequest.expense_type,
    remark: values.remark.trim() || undefined,
  };
}

export function toUpdateIssueRequestPayload(
  values: IssueRequestFormValues,
): data_UpdateIssueRequestRequest {
  const amount = values.amount.trim();
  const unit = values.unit.trim();
  const voucherType = values.voucherType.trim();
  if (!amount) throw new Error("Amount is required.");
  if (!unit) throw new Error("Unit is required.");
  if (!voucherType) throw new Error("Voucher type is required.");
  return {
    amount,
    unit,
    voucher_type: voucherType,
    remark: values.remark.trim() || undefined,
  };
}
