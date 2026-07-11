"use client";

import { useMemo } from "react";

export type RewardCapabilities = {
  canViewProjects: boolean;
  canCreateProject: boolean;
  canViewFinanceDocs: boolean;
  canCreateFinanceDoc: boolean;
  canEditFinanceDoc: boolean;
  canSubmitFinanceDoc: boolean;
  canApproveFinanceDoc: boolean;
  canRecordFinancePayment: boolean;
  canCreateIssueRequest: boolean;
  canEditIssueRequest: boolean;
  canSubmitIssueRequest: boolean;
  canApproveIssueRequest: boolean;
};

const ALL_CAPABILITIES: RewardCapabilities = {
  canViewProjects: true,
  canCreateProject: true,
  canViewFinanceDocs: true,
  canCreateFinanceDoc: true,
  canEditFinanceDoc: true,
  canSubmitFinanceDoc: true,
  canApproveFinanceDoc: true,
  canRecordFinancePayment: true,
  canCreateIssueRequest: true,
  canEditIssueRequest: true,
  canSubmitIssueRequest: true,
  canApproveIssueRequest: true,
};

/** Placeholder until Clerk metadata drives RBAC. */
export function getRewardCapabilities(): RewardCapabilities {
  return ALL_CAPABILITIES;
}

export function useRewardCapabilities(): RewardCapabilities {
  return useMemo(() => getRewardCapabilities(), []);
}

export function canEditFinanceDocStatus(status: string): boolean {
  const s = status.toUpperCase();
  return s === "DRAFT" || s === "REJECTED";
}

export function canSubmitFinanceDocStatus(status: string): boolean {
  const s = status.toUpperCase();
  return s === "DRAFT" || s === "REJECTED";
}

export function canApproveFinanceDocStatus(status: string): boolean {
  return status.toUpperCase() === "TO_APPROVE";
}

export function canManageFinanceDocWorkflow(status: string): boolean {
  const s = status.toUpperCase();
  return s === "APPROVED";
}

export function canEditIssueRequestStatus(status: string): boolean {
  const s = status.toUpperCase();
  return s === "DRAFT" || s === "REJECTED";
}

export function canSubmitIssueRequestStatus(status: string): boolean {
  const s = status.toUpperCase();
  return s === "DRAFT" || s === "REJECTED";
}

export function canApproveIssueRequestStatus(status: string): boolean {
  return status.toUpperCase() === "TO_APPROVE";
}

export function isIssueRequestReadonly(status: string): boolean {
  const s = status.toUpperCase();
  return (
    s === "APPROVED" ||
    s === "ISSUING" ||
    s === "ONGOING" ||
    s === "ISSUED" ||
    s === "ENDED"
  );
}
