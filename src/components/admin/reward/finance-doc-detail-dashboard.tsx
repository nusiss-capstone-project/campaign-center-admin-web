"use client";

import Link from "next/link";
import { useState } from "react";
import { Pencil, Send } from "lucide-react";

import type { data_FinanceDocVO } from "@/lib/reward-api/models/data_FinanceDocVO";
import type { data_PaymentConfigVO } from "@/lib/reward-api/models/data_PaymentConfigVO";
import { data_ApproveFinanceDocRequest } from "@/lib/reward-api/models/data_ApproveFinanceDocRequest";
import { data_SubmitIssueRequestRequest } from "@/lib/reward-api/models/data_SubmitIssueRequestRequest";
import { data_ApproveIssueRequestRequest } from "@/lib/reward-api/models/data_ApproveIssueRequestRequest";
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
  canApproveFinanceDocStatus,
  canEditFinanceDocStatus,
  canManageFinanceDocWorkflow,
  canSubmitFinanceDocStatus,
  useRewardCapabilities,
} from "@/lib/admin/reward/reward-capabilities";
import {
  parseFinanceDocToFormValues,
  parseIssueRequestToFormValues,
  toCreateFinancePaymentPayload,
  toCreateIssueRequestPayload,
  toUpdateIssueRequestPayload,
} from "@/lib/admin/reward/reward-form-values";
import type {
  FinancePaymentDisplayRow,
  IssueRequestDisplayRow,
} from "@/lib/admin/reward/reward-row";
import { rewardApiErrorMessage } from "@/lib/admin/reward/reward-utils";
import { FinanceDocForm } from "@/components/admin/reward/finance-doc-form";
import { FinanceDocStatusBadge } from "@/components/admin/reward/finance-doc-status-badge";
import { CreateFinancePaymentDialog } from "@/components/admin/reward/create-finance-payment-dialog";
import { IssueRequestDialog } from "@/components/admin/reward/issue-request-dialog";
import { RemarkActionDialog } from "@/components/admin/reward/remark-action-dialog";
import { FinancePaymentsTab } from "@/components/admin/reward/finance-payments-tab";
import { IssueRequestsTab } from "@/components/admin/reward/issue-requests-tab";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type FinanceDocDetailDashboardProps = {
  doc: data_FinanceDocVO;
  payments: FinancePaymentDisplayRow[];
  issueRequests: IssueRequestDisplayRow[];
  issueRequestsTotal: number;
  paymentConfigs: data_PaymentConfigVO[];
  loadingPayments: boolean;
  loadingIssueRequests: boolean;
  errorPayments: string | null;
  errorIssueRequests: string | null;
  onRefresh: () => void;
};

type ActiveDialog =
  | { type: "submit-doc" }
  | { type: "approve-doc"; status: data_ApproveFinanceDocRequest.status }
  | { type: "record-payment" }
  | { type: "create-issue" }
  | { type: "edit-issue"; row: IssueRequestDisplayRow }
  | { type: "submit-issue"; row: IssueRequestDisplayRow }
  | { type: "approve-issue"; row: IssueRequestDisplayRow; status: data_ApproveIssueRequestRequest.status }
  | null;

export function FinanceDocDetailDashboard({
  doc,
  payments,
  issueRequests,
  issueRequestsTotal,
  paymentConfigs,
  loadingPayments,
  loadingIssueRequests,
  errorPayments,
  errorIssueRequests,
  onRefresh,
}: FinanceDocDetailDashboardProps) {
  const caps = useRewardCapabilities();
  const status = doc.status ?? "UNKNOWN";
  const docId = doc.doc_id ?? "";
  const formValues = parseFinanceDocToFormValues(doc);
  const applicationPayAddresses = [
    ...new Set(
      (doc.application_detail ?? [])
        .map((item) => item.pay_address?.trim())
        .filter((v): v is string => Boolean(v)),
    ),
  ];

  const [activeDialog, setActiveDialog] = useState<ActiveDialog>(null);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function runMutation(fn: () => Promise<void>) {
    setDialogError(null);
    setSubmitting(true);
    try {
      await fn();
      setActiveDialog(null);
      onRefresh();
    } catch (err) {
      setDialogError(rewardApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  const showEdit =
    caps.canEditFinanceDoc && canEditFinanceDocStatus(status);
  const showSubmit =
    caps.canSubmitFinanceDoc && canSubmitFinanceDocStatus(status);
  const showApprove =
    caps.canApproveFinanceDoc && canApproveFinanceDocStatus(status);
  const showWorkflow =
    caps.canRecordFinancePayment &&
    caps.canCreateIssueRequest &&
    canManageFinanceDocWorkflow(status);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-white/10 px-6 py-6 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link
              href="/admin/rewards/finance-docs"
              className="text-sm text-zinc-500 hover:text-zinc-300"
            >
              ← Finance Docs
            </Link>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                {docId}
              </h1>
              <FinanceDocStatusBadge status={status} />
            </div>
            <p className="mt-1 text-sm text-zinc-500">
              Project: {doc.project?.name ?? doc.project_id ?? "—"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {showEdit ? (
              <Button variant="outline" asChild>
                <Link href={`/admin/rewards/finance-docs/${docId}/edit`}>
                  <Pencil className="size-4" />
                  Edit
                </Link>
              </Button>
            ) : null}
            {showSubmit ? (
              <Button
                className="bg-white text-black hover:bg-zinc-200"
                onClick={() => setActiveDialog({ type: "submit-doc" })}
              >
                <Send className="size-4" />
                Submit
              </Button>
            ) : null}
            {showApprove ? (
              <>
                <Button
                  className="bg-emerald-600 text-white hover:bg-emerald-500"
                  onClick={() =>
                    setActiveDialog({
                      type: "approve-doc",
                      status: data_ApproveFinanceDocRequest.status.APPROVED,
                    })
                  }
                >
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() =>
                    setActiveDialog({
                      type: "approve-doc",
                      status: data_ApproveFinanceDocRequest.status.REJECTED,
                    })
                  }
                >
                  Reject
                </Button>
              </>
            ) : null}
            {showWorkflow ? (
              <>
                {caps.canRecordFinancePayment ? (
                  <Button
                    variant="outline"
                    onClick={() => setActiveDialog({ type: "record-payment" })}
                  >
                    Record disbursement
                  </Button>
                ) : null}
                {caps.canCreateIssueRequest ? (
                  <Button
                    className="bg-white text-black hover:bg-zinc-200"
                    onClick={() => setActiveDialog({ type: "create-issue" })}
                  >
                    Create issue request
                  </Button>
                ) : null}
              </>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-6 py-6 lg:px-8">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="payments">Disbursements</TabsTrigger>
            <TabsTrigger value="issue-requests">Issue Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-5">
                <h2 className="text-sm font-medium text-zinc-200">Metadata</h2>
                <dl className="mt-4 grid gap-3 text-sm">
                  <div className="grid grid-cols-[120px_1fr] gap-2">
                    <dt className="text-zinc-500">Creator</dt>
                    <dd className="text-zinc-300">{doc.creator ?? "—"}</dd>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-2">
                    <dt className="text-zinc-500">Remark</dt>
                    <dd className="text-zinc-300">{doc.remark ?? "—"}</dd>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-2">
                    <dt className="text-zinc-500">Created</dt>
                    <dd className="text-zinc-300">{doc.created_at ?? "—"}</dd>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-2">
                    <dt className="text-zinc-500">Updated</dt>
                    <dd className="text-zinc-300">{doc.updated_at ?? "—"}</dd>
                  </div>
                </dl>
              </div>
              <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-5">
                <h2 className="text-sm font-medium text-zinc-200">
                  Application detail
                </h2>
                <div className="mt-4">
                  <FinanceDocForm
                    values={formValues}
                    onChange={() => {}}
                    projects={[]}
                    paymentConfigs={paymentConfigs}
                    readOnly
                    showProjectSelect={false}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <FinancePaymentsTab
              rows={payments}
              loading={loadingPayments}
              errorMessage={errorPayments}
              onRetry={onRefresh}
            />
          </TabsContent>

          <TabsContent value="issue-requests" className="mt-6">
            <IssueRequestsTab
              rows={issueRequests}
              total={issueRequestsTotal}
              loading={loadingIssueRequests}
              errorMessage={errorIssueRequests}
              onRetry={onRefresh}
              onEdit={(row) => setActiveDialog({ type: "edit-issue", row })}
              onSubmit={(row) => setActiveDialog({ type: "submit-issue", row })}
              onApprove={(row) =>
                setActiveDialog({
                  type: "approve-issue",
                  row,
                  status: data_ApproveIssueRequestRequest.status.APPROVED,
                })
              }
              onReject={(row) =>
                setActiveDialog({
                  type: "approve-issue",
                  row,
                  status: data_ApproveIssueRequestRequest.status.REJECTED,
                })
              }
            />
          </TabsContent>
        </Tabs>
      </div>

      <RemarkActionDialog
        open={activeDialog?.type === "submit-doc"}
        onOpenChange={(open) => !open && setActiveDialog(null)}
        title="Submit finance doc"
        description="Move this finance doc to TO_APPROVE for review."
        confirmLabel="Submit"
        submitting={submitting}
        error={dialogError}
        onConfirm={(remark) =>
          runMutation(() => submitFinanceDoc(docId, remark ? { remark } : undefined))
        }
      />

      <RemarkActionDialog
        open={activeDialog?.type === "approve-doc"}
        onOpenChange={(open) => !open && setActiveDialog(null)}
        title={
          activeDialog?.type === "approve-doc" &&
          activeDialog.status === data_ApproveFinanceDocRequest.status.APPROVED
            ? "Approve finance doc"
            : "Reject finance doc"
        }
        description="Add an optional remark for this approval decision."
        confirmLabel={
          activeDialog?.type === "approve-doc" &&
          activeDialog.status === data_ApproveFinanceDocRequest.status.APPROVED
            ? "Approve"
            : "Reject"
        }
        confirmVariant={
          activeDialog?.type === "approve-doc" &&
          activeDialog.status === data_ApproveFinanceDocRequest.status.REJECTED
            ? "destructive"
            : "default"
        }
        submitting={submitting}
        error={dialogError}
        onConfirm={(remark) => {
          if (activeDialog?.type !== "approve-doc") return;
          return runMutation(() =>
            approveFinanceDoc(docId, {
              status: activeDialog.status,
              remark: remark || undefined,
            }),
          );
        }}
      />

      <CreateFinancePaymentDialog
        open={activeDialog?.type === "record-payment"}
        onOpenChange={(open) => !open && setActiveDialog(null)}
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
        onOpenChange={(open) => !open && setActiveDialog(null)}
        title="Create issue request"
        description="Create a new issue request under this finance doc."
        confirmLabel="Create"
        paymentConfigs={paymentConfigs}
        submitting={submitting}
        error={dialogError}
        onSubmit={(values) =>
          runMutation(async () => {
            await createIssueRequest(docId, toCreateIssueRequestPayload(values));
          })
        }
      />

      <IssueRequestDialog
        open={activeDialog?.type === "edit-issue"}
        onOpenChange={(open) => !open && setActiveDialog(null)}
        title="Edit issue request"
        description="Update issue request fields in DRAFT or REJECTED status."
        confirmLabel="Save"
        paymentConfigs={paymentConfigs}
        hideExpenseType
        initialValues={
          activeDialog?.type === "edit-issue"
            ? parseIssueRequestToFormValues(activeDialog.row as unknown as Record<string, unknown>)
            : undefined
        }
        submitting={submitting}
        error={dialogError}
        onSubmit={(values) => {
          if (activeDialog?.type !== "edit-issue") return;
          return runMutation(async () => {
            await updateIssueRequest(
              docId,
              activeDialog.row.id,
              toUpdateIssueRequestPayload(values),
            );
          });
        }}
      />

      <RemarkActionDialog
        open={activeDialog?.type === "submit-issue"}
        onOpenChange={(open) => !open && setActiveDialog(null)}
        title="Submit issue request"
        description="Move this issue request to TO_APPROVE for review."
        confirmLabel="Submit"
        submitting={submitting}
        error={dialogError}
        onConfirm={(remark) => {
          if (activeDialog?.type !== "submit-issue") return;
          return runMutation(() =>
            submitIssueRequest(docId, activeDialog.row.id, {
              status: data_SubmitIssueRequestRequest.status.TO_APPROVE,
              remark: remark || undefined,
            }),
          );
        }}
      />

      <RemarkActionDialog
        open={activeDialog?.type === "approve-issue"}
        onOpenChange={(open) => !open && setActiveDialog(null)}
        title={
          activeDialog?.type === "approve-issue" &&
          activeDialog.status === data_ApproveIssueRequestRequest.status.APPROVED
            ? "Approve issue request"
            : "Reject issue request"
        }
        description="Add an optional remark for this approval decision."
        confirmLabel={
          activeDialog?.type === "approve-issue" &&
          activeDialog.status === data_ApproveIssueRequestRequest.status.APPROVED
            ? "Approve"
            : "Reject"
        }
        confirmVariant={
          activeDialog?.type === "approve-issue" &&
          activeDialog.status === data_ApproveIssueRequestRequest.status.REJECTED
            ? "destructive"
            : "default"
        }
        submitting={submitting}
        error={dialogError}
        onConfirm={(remark) => {
          if (activeDialog?.type !== "approve-issue") return;
          return runMutation(() =>
            approveIssueRequest(docId, activeDialog.row.id, {
              status: activeDialog.status,
              remark: remark || undefined,
            }),
          );
        }}
      />
    </div>
  );
}
