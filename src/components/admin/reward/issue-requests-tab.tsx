"use client";

import type { IssueRequestDisplayRow } from "@/lib/admin/reward/reward-row";
import {
  canApproveIssueRequestStatus,
  canEditIssueRequestStatus,
  canSubmitIssueRequestStatus,
  isIssueRequestReadonly,
  useRewardCapabilities,
} from "@/lib/admin/reward/reward-capabilities";
import { IssueRequestStatusBadge } from "@/components/admin/reward/issue-request-status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type IssueRequestsTabProps = {
  rows: IssueRequestDisplayRow[];
  total: number;
  loading: boolean;
  errorMessage: string | null;
  onRetry?: () => void;
  onEdit: (row: IssueRequestDisplayRow) => void;
  onSubmit: (row: IssueRequestDisplayRow) => void;
  onApprove: (row: IssueRequestDisplayRow) => void;
  onReject: (row: IssueRequestDisplayRow) => void;
};

export function IssueRequestsTab({
  rows,
  total,
  loading,
  errorMessage,
  onRetry,
  onEdit,
  onSubmit,
  onApprove,
  onReject,
}: IssueRequestsTabProps) {
  const caps = useRewardCapabilities();

  if (loading) {
    return <p className="text-sm text-zinc-500">Loading issue requests…</p>;
  }

  if (errorMessage) {
    return (
      <div className="flex flex-col gap-3">
        <p
          className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          role="alert"
        >
          {errorMessage}
        </p>
        {onRetry ? (
          <Button variant="outline" onClick={onRetry} className="w-fit">
            Retry
          </Button>
        ) : null}
      </div>
    );
  }

  if (rows.length === 0) {
    return <p className="text-sm text-zinc-500">No issue requests yet.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-xl">
        <Table className="border-0">
          <TableHeader>
            <TableRow className="border-0 hover:bg-transparent">
              <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                ID
              </TableHead>
              <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Amount
              </TableHead>
              <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Unit
              </TableHead>
              <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Voucher
              </TableHead>
              <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Expense
              </TableHead>
              <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Status
              </TableHead>
              <TableHead className="h-11 border-0 px-4 text-right text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const readonly = isIssueRequestReadonly(row.requestStatus);
              const canEdit =
                caps.canEditIssueRequest &&
                canEditIssueRequestStatus(row.requestStatus);
              const canSubmit =
                caps.canSubmitIssueRequest &&
                canSubmitIssueRequestStatus(row.requestStatus);
              const canApprove =
                caps.canApproveIssueRequest &&
                canApproveIssueRequestStatus(row.requestStatus);

              return (
                <TableRow
                  key={row.id}
                  className="border-0 hover:bg-white/[0.03]"
                >
                  <TableCell className="border-0 px-4 py-4 font-mono text-sm text-zinc-300">
                    {row.id}
                  </TableCell>
                  <TableCell className="border-0 px-4 py-4 text-sm text-zinc-300">
                    {row.amount}
                  </TableCell>
                  <TableCell className="border-0 px-4 py-4 text-sm text-zinc-400">
                    {row.unit}
                  </TableCell>
                  <TableCell className="border-0 px-4 py-4 text-sm text-zinc-400">
                    {row.voucherType}
                  </TableCell>
                  <TableCell className="border-0 px-4 py-4 text-sm text-zinc-400">
                    {row.expenseType}
                  </TableCell>
                  <TableCell className="border-0 px-4 py-4">
                    <IssueRequestStatusBadge status={row.requestStatus} />
                  </TableCell>
                  <TableCell className="border-0 px-4 py-4">
                    {readonly ? (
                      <span className="text-xs text-zinc-500">Readonly</span>
                    ) : (
                      <div className="flex justify-end gap-1">
                        {canEdit ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(row)}
                          >
                            Edit
                          </Button>
                        ) : null}
                        {canSubmit ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onSubmit(row)}
                          >
                            Submit
                          </Button>
                        ) : null}
                        {canApprove ? (
                          <>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => onApprove(row)}
                            >
                              Approve
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-red-300 hover:text-red-200"
                              onClick={() => onReject(row)}
                            >
                              Reject
                            </Button>
                          </>
                        ) : null}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-zinc-500">
        Showing {rows.length} of {total} issue requests
      </p>
    </div>
  );
}
