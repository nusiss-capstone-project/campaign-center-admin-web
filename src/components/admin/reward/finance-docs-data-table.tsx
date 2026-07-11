"use client";

import Link from "next/link";
import { Eye, Pencil } from "lucide-react";

import type { FinanceDocDisplayRow } from "@/lib/admin/reward/reward-row";
import {
  canEditFinanceDocStatus,
  useRewardCapabilities,
} from "@/lib/admin/reward/reward-capabilities";
import { FinanceDocStatusBadge } from "@/components/admin/reward/finance-doc-status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type FinanceDocsDataTableProps = {
  rows: FinanceDocDisplayRow[];
};

export function FinanceDocsDataTable({ rows }: FinanceDocsDataTableProps) {
  const caps = useRewardCapabilities();

  return (
    <div className="overflow-hidden rounded-xl">
      <Table className="border-0">
        <TableHeader>
          <TableRow className="border-0 hover:bg-transparent">
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Doc ID
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Project
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Status
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Creator
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Created
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-right text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const editable =
              caps.canEditFinanceDoc && canEditFinanceDocStatus(row.status);
            return (
              <TableRow
                key={row.docId}
                className="border-0 hover:bg-white/[0.03]"
              >
                <TableCell className="border-0 px-4 py-4 font-mono text-sm text-zinc-300">
                  {row.docId}
                </TableCell>
                <TableCell className="border-0 px-4 py-4 text-sm text-zinc-300">
                  {row.projectName || row.projectId?.toString() || "—"}
                </TableCell>
                <TableCell className="border-0 px-4 py-4">
                  <FinanceDocStatusBadge status={row.status} />
                </TableCell>
                <TableCell className="border-0 px-4 py-4 text-sm text-zinc-400">
                  {row.creator}
                </TableCell>
                <TableCell className="border-0 px-4 py-4 text-sm text-zinc-500">
                  {row.createdAtLabel}
                </TableCell>
                <TableCell className="border-0 px-4 py-4">
                  <div className="flex justify-end gap-0.5">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-zinc-400 hover:bg-white/5 hover:text-white"
                      asChild
                    >
                      <Link
                        href={`/admin/rewards/finance-docs/${row.docId}`}
                        aria-label={`View finance doc ${row.docId}`}
                      >
                        <Eye className="size-4" strokeWidth={1.75} />
                      </Link>
                    </Button>
                    {editable ? (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-zinc-400 hover:bg-white/5 hover:text-white"
                        asChild
                      >
                        <Link
                          href={`/admin/rewards/finance-docs/${row.docId}/edit`}
                          aria-label={`Edit finance doc ${row.docId}`}
                        >
                          <Pencil className="size-4" strokeWidth={1.75} />
                        </Link>
                      </Button>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
