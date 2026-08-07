"use client";

import Link from "next/link";

import type { UserGroupDisplayRow } from "@/lib/admin/user-group-row";
import { userGroupStatusLabel } from "@/lib/admin/user-group-row";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type UserGroupsDataTableProps = {
  rows: UserGroupDisplayRow[];
  loading: boolean;
};

function statusBadgeClass(status: string): string {
  switch (status) {
    case "DRAFT":
      return "border-zinc-500/30 bg-zinc-500/10 text-zinc-300";
    case "ACTIVE":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "OFFLINE":
      return "border-amber-500/30 bg-amber-500/10 text-amber-200";
    default:
      return "border-white/10 text-zinc-400";
  }
}

export function UserGroupsDataTable({
  rows,
  loading,
}: Readonly<UserGroupsDataTableProps>) {
  if (loading) {
    return <p className="text-sm text-zinc-500">Loading…</p>;
  }

  if (rows.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-zinc-500">
        No user groups found.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-transparent">
            <TableHead className="text-zinc-400">ID</TableHead>
            <TableHead className="text-zinc-400">Name</TableHead>
            <TableHead className="text-zinc-400">Status</TableHead>
            <TableHead className="text-right text-zinc-400">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} className="border-white/10">
              <TableCell className="font-mono text-zinc-300">{row.id}</TableCell>
              <TableCell className="text-zinc-100">{row.name || "—"}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={statusBadgeClass(String(row.status))}
                >
                  {userGroupStatusLabel(String(row.status))}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-white/10 bg-zinc-900/50"
                >
                  <Link href={`/admin/user-groups/${row.id}`}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
