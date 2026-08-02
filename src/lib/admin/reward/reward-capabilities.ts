"use client";

import { useMemo } from "react";

import { useAdminAccess } from "@/components/admin/admin-access-provider";
import {
  pickRewardCapabilities,
  type RewardCapabilities,
} from "@/lib/admin/rbac/capabilities";

export type { RewardCapabilities };

/** Reward-domain slice of the shared admin RBAC matrix. */
export function useRewardCapabilities(): RewardCapabilities {
  const { caps } = useAdminAccess();
  return useMemo(() => pickRewardCapabilities(caps), [caps]);
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

export function canEditTemplateStatus(status: string): boolean {
  return status.toUpperCase() === "DRAFT";
}

export function canPublishTemplateStatus(status: string): boolean {
  return status.toUpperCase() === "DRAFT";
}

export function isTemplateReadonly(status: string): boolean {
  return status.toUpperCase() === "PUBLISHED";
}
