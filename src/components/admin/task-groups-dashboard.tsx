"use client";

import { useMemo, useState } from "react";

import { TaskGroupsList } from "@/components/admin/task-groups-list";
import {
  TaskGroupsPageHeader,
  type TaskGroupStatusFilter,
} from "@/components/admin/task-groups-page-header";
import type { TaskGroupDisplayRow } from "@/lib/admin/task-row";

type TaskGroupsDashboardProps = {
  rows: TaskGroupDisplayRow[];
  loading: boolean;
  errorMessage: string | null;
  statusFilter: TaskGroupStatusFilter;
  onStatusFilterChange: (value: TaskGroupStatusFilter) => void;
};

export function TaskGroupsDashboard({
  rows,
  loading,
  errorMessage,
  statusFilter,
  onStatusFilterChange,
}: Readonly<TaskGroupsDashboardProps>) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (row) =>
        row.name.toLowerCase().includes(q) ||
        String(row.id).includes(q) ||
        row.status.toLowerCase().includes(q),
    );
  }, [rows, searchQuery]);

  return (
    <div className="flex flex-col gap-6 p-6">
      <TaskGroupsPageHeader
        totalCount={rows.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
      />
      <TaskGroupsList
        rows={filteredRows}
        loading={loading}
        errorMessage={errorMessage}
      />
    </div>
  );
}
