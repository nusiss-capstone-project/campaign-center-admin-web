"use client";

import Link from "next/link";

import { TaskGroupStatusBadge } from "@/components/admin/task-group-status-badge";
import type { TaskGroupDisplayRow } from "@/lib/admin/task-row";

type TaskGroupsListProps = {
  rows: TaskGroupDisplayRow[];
  loading: boolean;
  errorMessage: string | null;
};

function groupDetailHref(row: TaskGroupDisplayRow): string {
  const params = new URLSearchParams({
    name: row.name,
    status: row.status,
  });
  return `/admin/task-group/${row.id}?${params.toString()}`;
}

export function TaskGroupsList({
  rows,
  loading,
  errorMessage,
}: TaskGroupsListProps) {
  if (loading) {
    return (
      <p className="rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-8 text-center text-sm text-zinc-400">
        Loading task groups...
      </p>
    );
  }

  if (errorMessage) {
    return (
      <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-8 text-center text-sm text-red-200">
        {errorMessage}
      </p>
    );
  }

  if (rows.length === 0) {
    return (
      <p className="rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-8 text-center text-sm text-zinc-400">
        No task groups yet. Create one to get started.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {rows.map((row) => (
        <li key={row.id}>
          <Link
            href={groupDetailHref(row)}
            className="block rounded-2xl border border-white/10 bg-zinc-900/60 p-5 transition-colors hover:border-white/20 hover:bg-zinc-900"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold text-white">
                  {row.name}
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  task_group_id: {row.id}
                </p>
              </div>
              <TaskGroupStatusBadge status={row.status} label={row.statusLabel} />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
