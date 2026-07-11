"use client";

import type { ProjectDisplayRow } from "@/lib/admin/reward/reward-row";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ProjectsDataTableProps = {
  rows: ProjectDisplayRow[];
};

export function ProjectsDataTable({ rows }: ProjectsDataTableProps) {
  return (
    <div className="overflow-hidden rounded-xl">
      <Table className="border-0">
        <TableHeader>
          <TableRow className="border-0 hover:bg-transparent">
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              ID
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Name
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Description
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} className="border-0 hover:bg-white/[0.03]">
              <TableCell className="border-0 px-4 py-4 font-mono text-sm text-zinc-300">
                {row.id}
              </TableCell>
              <TableCell className="border-0 px-4 py-4 font-medium text-white">
                {row.name}
              </TableCell>
              <TableCell className="border-0 px-4 py-4 text-sm text-zinc-400">
                {row.description || "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
