"use client";

import type { FinancePaymentDisplayRow } from "@/lib/admin/reward/reward-row";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type FinancePaymentsTabProps = {
  rows: FinancePaymentDisplayRow[];
  loading: boolean;
  errorMessage: string | null;
  onRetry?: () => void;
};

export function FinancePaymentsTab({
  rows,
  loading,
  errorMessage,
  onRetry,
}: FinancePaymentsTabProps) {
  if (loading) {
    return <p className="text-sm text-zinc-500">Loading disbursements…</p>;
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
    return <p className="text-sm text-zinc-500">No disbursements yet.</p>;
  }

  return (
    <div className="overflow-hidden rounded-xl">
      <Table className="border-0">
        <TableHeader>
          <TableRow className="border-0 hover:bg-transparent">
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Disbursement ID
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Amount
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Account
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Voucher type
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Unit
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Disbursement status
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Created
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.paymentId}
              className="border-0 hover:bg-white/[0.03]"
            >
              <TableCell className="border-0 px-4 py-4 font-mono text-sm text-zinc-300">
                {row.paymentId}
              </TableCell>
              <TableCell className="border-0 px-4 py-4 text-sm text-zinc-300">
                {row.amount}
              </TableCell>
              <TableCell className="border-0 px-4 py-4 text-sm text-zinc-400">
                {row.paymentAccount}
              </TableCell>
              <TableCell className="border-0 px-4 py-4 text-sm text-zinc-400">
                {row.voucherType}
              </TableCell>
              <TableCell className="border-0 px-4 py-4 text-sm text-zinc-400">
                {row.unit}
              </TableCell>
              <TableCell className="border-0 px-4 py-4 text-sm text-zinc-400">
                {row.paymentStatus}
              </TableCell>
              <TableCell className="border-0 px-4 py-4 text-sm text-zinc-500">
                {row.createdAtLabel}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
