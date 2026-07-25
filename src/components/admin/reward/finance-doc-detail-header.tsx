"use client";

import Link from "next/link";
import { Pencil, Send } from "lucide-react";

import { data_ApproveFinanceDocRequest } from "@/lib/reward-api/models/data_ApproveFinanceDocRequest";
import { Button } from "@/components/ui/button";
import { FinanceDocStatusBadge } from "@/components/admin/reward/finance-doc-status-badge";

type FinanceDocDetailHeaderProps = {
  docId: string;
  status: string;
  projectLabel: string;
  showEdit: boolean;
  showSubmit: boolean;
  showApprove: boolean;
  showWorkflow: boolean;
  canRecordPayment: boolean;
  canCreateIssue: boolean;
  onSubmitDoc: () => void;
  onApproveDoc: (status: data_ApproveFinanceDocRequest.status) => void;
  onRecordPayment: () => void;
  onCreateIssue: () => void;
};

export function FinanceDocDetailHeader({
  docId,
  status,
  projectLabel,
  showEdit,
  showSubmit,
  showApprove,
  showWorkflow,
  canRecordPayment,
  canCreateIssue,
  onSubmitDoc,
  onApproveDoc,
  onRecordPayment,
  onCreateIssue,
}: Readonly<FinanceDocDetailHeaderProps>) {
  return (
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
          <p className="mt-1 text-sm text-zinc-500">Project: {projectLabel}</p>
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
              onClick={onSubmitDoc}
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
                  onApproveDoc(data_ApproveFinanceDocRequest.status.APPROVED)
                }
              >
                Approve
              </Button>
              <Button
                variant="destructive"
                onClick={() =>
                  onApproveDoc(data_ApproveFinanceDocRequest.status.REJECTED)
                }
              >
                Reject
              </Button>
            </>
          ) : null}
          {showWorkflow && canRecordPayment ? (
            <Button variant="outline" onClick={onRecordPayment}>
              Record disbursement
            </Button>
          ) : null}
          {showWorkflow && canCreateIssue ? (
            <Button
              className="bg-white text-black hover:bg-zinc-200"
              onClick={onCreateIssue}
            >
              Create issue request
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
