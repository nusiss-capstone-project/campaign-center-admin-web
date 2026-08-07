"use client";

import { useState } from "react";

import type { data_BudgetVO } from "@/lib/reward-api/models/data_BudgetVO";
import type { data_FinanceDocVO } from "@/lib/reward-api/models/data_FinanceDocVO";
import type { data_PaymentConfigVO } from "@/lib/reward-api/models/data_PaymentConfigVO";
import { data_ApproveIssueRequestRequest } from "@/lib/reward-api/models/data_ApproveIssueRequestRequest";
import { useAdminAccess } from "@/components/admin/admin-access-provider";
import {
  canApproveFinanceDocStatus,
  canEditFinanceDocStatus,
  canManageFinanceDocWorkflow,
  canSubmitFinanceDocStatus,
  useRewardCapabilities,
} from "@/lib/admin/reward/reward-capabilities";
import { parseFinanceDocToFormValues } from "@/lib/admin/reward/reward-form-values";
import type {
  FinancePaymentDisplayRow,
  IssueRequestDisplayRow,
} from "@/lib/admin/reward/reward-row";
import { rewardApiErrorMessage } from "@/lib/admin/reward/reward-utils";
import { BudgetAvailableTotalList } from "@/components/admin/reward/budget-available-total";
import { FinanceDocForm } from "@/components/admin/reward/finance-doc-form";
import {
  FinanceDocDetailDialogs,
  type FinanceDocActiveDialog,
} from "@/components/admin/reward/finance-doc-detail-dialogs";
import { FinanceDocDetailHeader } from "@/components/admin/reward/finance-doc-detail-header";
import { FinancePaymentsTab } from "@/components/admin/reward/finance-payments-tab";
import { IssueRequestsTab } from "@/components/admin/reward/issue-requests-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type FinanceDocDetailDashboardProps = {
  doc: data_FinanceDocVO;
  projectBudgets: data_BudgetVO[];
  loadingProjectBudgets: boolean;
  errorProjectBudgets: string | null;
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

export function FinanceDocDetailDashboard({
  doc,
  projectBudgets,
  loadingProjectBudgets,
  errorProjectBudgets,
  payments,
  issueRequests,
  issueRequestsTotal,
  paymentConfigs,
  loadingPayments,
  loadingIssueRequests,
  errorPayments,
  errorIssueRequests,
  onRefresh,
}: Readonly<FinanceDocDetailDashboardProps>) {
  const caps = useRewardCapabilities();
  const { role } = useAdminAccess();
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

  const [activeDialog, setActiveDialog] = useState<FinanceDocActiveDialog>(null);
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

  const showEdit = caps.canEditFinanceDoc && canEditFinanceDocStatus(status);
  const showSubmit =
    caps.canSubmitFinanceDoc && canSubmitFinanceDocStatus(status);
  // Approve/Reject is finance_admin + admin only (not campaign_ops).
  const showApprove =
    (role === "admin" || role === "finance_admin") &&
    caps.canApproveFinanceDoc &&
    canApproveFinanceDocStatus(status);
  const workflowReady = canManageFinanceDocWorkflow(status);
  // Keep payment / issue actions independent — finance_admin can record
  // disbursements without create-issue permission.
  const showRecordPayment =
    caps.canRecordFinancePayment && workflowReady;
  const showCreateIssue = caps.canCreateIssueRequest && workflowReady;
  const showPaymentsTab = caps.canRecordFinancePayment;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <FinanceDocDetailHeader
        docId={docId}
        status={status}
        projectLabel={String(doc.project?.name ?? doc.project_id ?? "—")}
        showEdit={showEdit}
        showSubmit={showSubmit}
        showApprove={showApprove}
        showRecordPayment={showRecordPayment}
        showCreateIssue={showCreateIssue}
        onSubmitDoc={() => setActiveDialog({ type: "submit-doc" })}
        onApproveDoc={(nextStatus) =>
          setActiveDialog({ type: "approve-doc", status: nextStatus })
        }
        onRecordPayment={() => setActiveDialog({ type: "record-payment" })}
        onCreateIssue={() => setActiveDialog({ type: "create-issue" })}
      />

      <div className="flex flex-1 flex-col px-6 py-6 lg:px-8">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {showPaymentsTab ? (
              <TabsTrigger value="payments">Disbursements</TabsTrigger>
            ) : null}
            <TabsTrigger value="issue-requests">Issue Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="flex flex-col gap-6">
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-5">
                  <h2 className="text-sm font-medium text-zinc-200">Metadata</h2>
                  <dl className="mt-4 grid gap-3 text-sm">
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
                    Project budget
                  </h2>
                  <div className="mt-4">
                    {loadingProjectBudgets ? (
                      <p className="text-sm text-zinc-500">Loading budgets…</p>
                    ) : errorProjectBudgets ? (
                      <p className="text-sm text-red-300" role="alert">
                        {errorProjectBudgets}
                      </p>
                    ) : (
                      <BudgetAvailableTotalList
                        budgets={projectBudgets}
                        showUnit
                      />
                    )}
                  </div>
                </div>
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

          {showPaymentsTab ? (
            <TabsContent value="payments" className="mt-6">
              <FinancePaymentsTab
                rows={payments}
                loading={loadingPayments}
                errorMessage={errorPayments}
                onRetry={onRefresh}
              />
            </TabsContent>
          ) : null}

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

      <FinanceDocDetailDialogs
        docId={docId}
        activeDialog={activeDialog}
        applicationPayAddresses={applicationPayAddresses}
        paymentConfigs={paymentConfigs}
        submitting={submitting}
        dialogError={dialogError}
        onClose={() => setActiveDialog(null)}
        runMutation={runMutation}
      />
    </div>
  );
}
