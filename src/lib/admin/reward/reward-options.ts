import { data_ApproveFinanceDocRequest } from "@/lib/reward-api/models/data_ApproveFinanceDocRequest";
import { data_ApproveIssueRequestRequest } from "@/lib/reward-api/models/data_ApproveIssueRequestRequest";
import { data_CreateIssueRequestRequest } from "@/lib/reward-api/models/data_CreateIssueRequestRequest";

export const EXPENSE_TYPE_OPTIONS = [
  { value: data_CreateIssueRequestRequest.expense_type.REWARD, label: "Reward" },
  { value: data_CreateIssueRequestRequest.expense_type.REFUND, label: "Refund" },
  { value: data_CreateIssueRequestRequest.expense_type.OTHERS, label: "Others" },
] as const;

export const FINANCE_DOC_APPROVAL_OPTIONS = [
  { value: data_ApproveFinanceDocRequest.status.APPROVED, label: "Approve" },
  { value: data_ApproveFinanceDocRequest.status.REJECTED, label: "Reject" },
] as const;

export const ISSUE_REQUEST_APPROVAL_OPTIONS = [
  { value: data_ApproveIssueRequestRequest.status.APPROVED, label: "Approve" },
  { value: data_ApproveIssueRequestRequest.status.REJECTED, label: "Reject" },
] as const;
