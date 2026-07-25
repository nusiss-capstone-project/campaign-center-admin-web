"use client";

import type { data_PaymentConfigVO } from "@/lib/reward-api/models/data_PaymentConfigVO";
import { data_ApproveFinanceDocRequest } from "@/lib/reward-api/models/data_ApproveFinanceDocRequest";
import { data_ApproveIssueRequestRequest } from "@/lib/reward-api/models/data_ApproveIssueRequestRequest";
import { data_SubmitIssueRequestRequest } from "@/lib/reward-api/models/data_SubmitIssueRequestRequest";
import {
  approveFinanceDoc,
  approveIssueRequest,
  createFinancePayment,
  createIssueRequest,
  submitFinanceDoc,
  submitIssueRequest,
  updateIssueRequest,
} from "@/lib/admin/reward/reward-api";
import {
  parseIssueRequestToFormValues,
  toCreateFinancePaymentPayload,
  toCreateIssueRequestPayload,
  toUpdateIssueRequestPayload,
} from "@/lib/admin/reward/reward-form-values";
import type { IssueRequestDisplayRow } from "@/lib/admin/reward/reward-row";
import { CreateFinancePaymentDialog } from "@/components/admin/reward/create-finance-payment-dialog";
import { IssueRequestDialog } from "@/components/admin/reward/issue-request-dialog";
import { RemarkActionDialog } from "@/components/admin/reward/remark-action-dialog";

export type FinanceDocActiveDialog =
  | { type: "submit-doc" }
  | { type: "approve-doc"; status: data_ApproveFinanceDocRequest.status }
  | { type: "record-payment" }
  | { type: "create-issue" }
  | { type: "edit-issue"; row: IssueRequestDisplayRow }
  | { type: "submit-issue"; row: IssueRequestDisplayRow }
  | {
      type: "approve-issue";
      row: IssueRequestDisplayRow;
      status: data_ApproveIssueRequestRequest.status;
    }
  | null;

type FinanceDocDetailDialogsProps = {
  docId: string;
  activeDialog: FinanceDocActiveDialog;
  applicationPayAddresses: string[];
  paymentConfigs: data_PaymentConfigVO[];
  submitting: boolean;
  dialogError: string | null;
  onClose: () => void;
  runMutation: (fn: () => Promise<void>) => Promise<void>;
};

export function FinanceDocDetailDialogs({
  docId,
  activeDialog,
  applicationPayAddresses,
  paymentConfigs,
  submitting,
  dialogError,
  onClose,
  runMutation,
}: Readonly<FinanceDocDetailDialogsProps>) {
  const approveDoc =
    activeDialog?.type === "approve-doc" ? activeDialog : null;
  const editIssue =
    activeDialog?.type === "edit-issue" ? activeDialog : null;
  const submitIssue =
    activeDialog?.type === "submit-issue" ? activeDialog : null;
  const approveIssue =
    activeDialog?.type === "approve-issue" ? activeDialog : null;

  const approveDocApproved =
    approveDoc?.status === data_ApproveFinanceDocRequest.status.APPROVED;
  const approveIssueApproved =
    approveIssue?.status === data_ApproveIssueRequestRequest.status.APPROVED;

  return (
    <>
      <RemarkActionDialog
        open={activeDialog?.type === "submit-doc"}
        onOpenChange={(open) => !open && onClose()}
        title="Submit finance doc"
        description="Move this finance doc to TO_APPROVE for review."
        confirmLabel="Submit"
        submitting={submitting}
        error={dialogError}
        onConfirm={(remark) =>
          runMutation(() =>
            submitFinanceDoc(docId, remark ? { remark } : undefined),
          )
        }
      />

      <RemarkActionDialog
        open={Boolean(approveDoc)}
        onOpenChange={(open) => !open && onClose()}
        title={
          approveDocApproved ? "Approve finance doc" : "Reject finance doc"
        }
        description="Add an optional remark for this approval decision."
        confirmLabel={approveDocApproved ? "Approve" : "Reject"}
        confirmVariant={approveDocApproved ? "default" : "destructive"}
        submitting={submitting}
        error={dialogError}
        onConfirm={(remark) => {
          if (!approveDoc) return;
          return runMutation(() =>
            approveFinanceDoc(docId, {
              status: approveDoc.status,
              remark: remark || undefined,
            }),
          );
        }}
      />

      <CreateFinancePaymentDialog
        open={activeDialog?.type === "record-payment"}
        onOpenChange={(open) => !open && onClose()}
        allowedPayAddresses={applicationPayAddresses}
        paymentConfigs={paymentConfigs}
        submitting={submitting}
        error={dialogError}
        onSubmit={(values) =>
          runMutation(async () => {
            await createFinancePayment(
              docId,
              toCreateFinancePaymentPayload(values),
            );
          })
        }
      />

      <IssueRequestDialog
        open={activeDialog?.type === "create-issue"}
        onOpenChange={(open) => !open && onClose()}
        title="Create issue request"
        description="Create a new issue request under this finance doc."
        confirmLabel="Create"
        paymentConfigs={paymentConfigs}
        submitting={submitting}
        error={dialogError}
        onSubmit={(values) =>
          runMutation(async () => {
            await createIssueRequest(
              docId,
              toCreateIssueRequestPayload(values),
            );
          })
        }
      />

      <IssueRequestDialog
        open={Boolean(editIssue)}
        onOpenChange={(open) => !open && onClose()}
        title="Edit issue request"
        description="Update issue request fields in DRAFT or REJECTED status."
        confirmLabel="Save"
        paymentConfigs={paymentConfigs}
        hideExpenseType
        initialValues={
          editIssue
            ? parseIssueRequestToFormValues(
                editIssue.row as unknown as Record<string, unknown>,
              )
            : undefined
        }
        submitting={submitting}
        error={dialogError}
        onSubmit={(values) => {
          if (!editIssue) return;
          return runMutation(async () => {
            await updateIssueRequest(
              docId,
              editIssue.row.id,
              toUpdateIssueRequestPayload(values),
            );
          });
        }}
      />

      <RemarkActionDialog
        open={Boolean(submitIssue)}
        onOpenChange={(open) => !open && onClose()}
        title="Submit issue request"
        description="Move this issue request to TO_APPROVE for review."
        confirmLabel="Submit"
        submitting={submitting}
        error={dialogError}
        onConfirm={(remark) => {
          if (!submitIssue) return;
          return runMutation(() =>
            submitIssueRequest(docId, submitIssue.row.id, {
              status: data_SubmitIssueRequestRequest.status.TO_APPROVE,
              remark: remark || undefined,
            }),
          );
        }}
      />

      <RemarkActionDialog
        open={Boolean(approveIssue)}
        onOpenChange={(open) => !open && onClose()}
        title={
          approveIssueApproved
            ? "Approve issue request"
            : "Reject issue request"
        }
        description="Add an optional remark for this approval decision."
        confirmLabel={approveIssueApproved ? "Approve" : "Reject"}
        confirmVariant={approveIssueApproved ? "default" : "destructive"}
        submitting={submitting}
        error={dialogError}
        onConfirm={(remark) => {
          if (!approveIssue) return;
          return runMutation(() =>
            approveIssueRequest(docId, approveIssue.row.id, {
              status: approveIssue.status,
              remark: remark || undefined,
            }),
          );
        }}
      />
    </>
  );
}
