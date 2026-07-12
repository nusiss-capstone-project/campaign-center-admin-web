"use client";

import Link from "next/link";
import { Eye, Pencil } from "lucide-react";

import type { TemplateDisplayRow } from "@/lib/admin/reward/reward-row";
import {
  canEditTemplateStatus,
  useRewardCapabilities,
} from "@/lib/admin/reward/reward-capabilities";
import { TemplateStatusBadge } from "@/components/admin/reward/template-status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TemplatesDataTableProps = {
  rows: TemplateDisplayRow[];
};

export function TemplatesDataTable({ rows }: TemplatesDataTableProps) {
  const caps = useRewardCapabilities();

  return (
    <div className="overflow-hidden rounded-xl">
      <Table className="border-0">
        <TableHeader>
          <TableRow className="border-0 hover:bg-transparent">
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              ID
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Type
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Voucher type
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Unit
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Config
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
            const editable =
              caps.canEditTemplate && canEditTemplateStatus(row.status);
            return (
              <TableRow key={row.id} className="border-0 hover:bg-white/[0.03]">
                <TableCell className="border-0 px-4 py-4 font-mono text-sm text-zinc-300">
                  {row.id}
                </TableCell>
                <TableCell className="border-0 px-4 py-4 text-sm text-zinc-300">
                  {row.typeLabel}
                </TableCell>
                <TableCell className="border-0 px-4 py-4 text-sm text-zinc-400">
                  {row.voucherType}
                </TableCell>
                <TableCell className="border-0 px-4 py-4 text-sm text-zinc-400">
                  {row.unit}
                </TableCell>
                <TableCell className="border-0 px-4 py-4 text-sm text-zinc-400">
                  {row.configSummary}
                </TableCell>
                <TableCell className="border-0 px-4 py-4">
                  <TemplateStatusBadge status={row.status} />
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
                        href={`/admin/rewards/templates/${row.id}`}
                        aria-label={`View template ${row.id}`}
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
                          href={`/admin/rewards/templates/${row.id}/edit`}
                          aria-label={`Edit template ${row.id}`}
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
