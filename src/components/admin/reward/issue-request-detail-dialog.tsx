"use client";

import { useEffect, useState } from "react";

import { BudgetLoadState } from "@/components/admin/reward/budget-available-total";
import { IssueRequestStatusBadge } from "@/components/admin/reward/issue-request-status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fetchIssueBudgets } from "@/lib/admin/reward/reward-api";
import type { IssueRequestDisplayRow } from "@/lib/admin/reward/reward-row";
import { rewardApiErrorMessage } from "@/lib/admin/reward/reward-utils";
import type { data_BudgetVO } from "@/lib/reward-api/models/data_BudgetVO";

type IssueRequestDetailDialogProps = {
  open: boolean;
  row: IssueRequestDisplayRow | null;
  onClose: () => void;
};

export function IssueRequestDetailDialog({
  open,
  row,
  onClose,
}: Readonly<IssueRequestDetailDialogProps>) {
  const [budgets, setBudgets] = useState<data_BudgetVO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || row == null) {
      setBudgets([]);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    void fetchIssueBudgets(row.id)
      .then((data) => {
        if (!cancelled) setBudgets(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setBudgets([]);
          setError(rewardApiErrorMessage(err));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, row]);

  return (
    <Dialog open={open} onOpenChange={(next) => (!next ? onClose() : undefined)}>
      <DialogContent className="max-w-lg border-white/10 bg-zinc-950 text-zinc-100">
        <DialogHeader>
          <DialogTitle>
            Issue request {row ? `#${row.id}` : ""}
          </DialogTitle>
        </DialogHeader>

        {row ? (
          <div className="flex flex-col gap-5">
            <dl className="grid gap-3 text-sm">
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <dt className="text-zinc-500">Status</dt>
                <dd>
                  <IssueRequestStatusBadge status={row.requestStatus} />
                </dd>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <dt className="text-zinc-500">Amount</dt>
                <dd className="text-zinc-300">{row.amount}</dd>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <dt className="text-zinc-500">Unit</dt>
                <dd className="text-zinc-300">{row.unit}</dd>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <dt className="text-zinc-500">Voucher</dt>
                <dd className="text-zinc-300">{row.voucherType}</dd>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <dt className="text-zinc-500">Expense</dt>
                <dd className="text-zinc-300">{row.expenseType}</dd>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <dt className="text-zinc-500">Remark</dt>
                <dd className="text-zinc-300">{row.remark || "—"}</dd>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <dt className="text-zinc-500">Created</dt>
                <dd className="text-zinc-300">{row.createdAtLabel}</dd>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <dt className="text-zinc-500">Updated</dt>
                <dd className="text-zinc-300">{row.updatedAtLabel}</dd>
              </div>
            </dl>

            <div className="rounded-lg border border-white/10 bg-zinc-900/40 p-4">
              <h3 className="text-sm font-medium text-zinc-200">
                Issue budget
              </h3>
              <div className="mt-3">
                <BudgetLoadState
                  loading={loading}
                  error={error}
                  budgets={budgets}
                />
              </div>
            </div>
          </div>
        ) : null}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
