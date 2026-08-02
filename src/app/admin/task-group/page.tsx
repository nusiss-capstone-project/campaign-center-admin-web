"use client";

import { useEffect, useState } from "react";

import { TaskGroupsDashboard } from "@/components/admin/task-groups-dashboard";
import type { TaskGroupStatusFilter } from "@/components/admin/task-groups-page-header";
import { fetchTaskGroups, taskGroupsListUrl } from "@/lib/admin/task-admin-fetch";
import {
  normalizeTaskGroupRows,
  type TaskGroupDisplayRow,
} from "@/lib/admin/task-row";
import { isNonProductionRuntime } from "@/lib/is-non-production-runtime";

function statusToQuery(
  status: TaskGroupStatusFilter,
): string | undefined {
  if (status === "all") return undefined;
  return status;
}

export default function AdminTaskGroupsPage() {
  const [rows, setRows] = useState<TaskGroupDisplayRow[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] =
    useState<TaskGroupStatusFilter>("all");

  useEffect(() => {
    let cancelled = false;
    const status = statusToQuery(statusFilter);

    async function load() {
      setLoading(true);
      setErrorMessage(null);

      if (isNonProductionRuntime()) {
        console.log(
          "[admin/task-group] request URL:",
          taskGroupsListUrl({ status }),
        );
      }

      try {
        const data = await fetchTaskGroups({ status });
        if (cancelled) return;
        setRows(normalizeTaskGroupRows(data));
      } catch (e) {
        if (cancelled) return;
        setErrorMessage(e instanceof Error ? e.message : "Request failed");
        setRows([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load().catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [statusFilter]);

  return (
    <TaskGroupsDashboard
      rows={rows}
      loading={loading}
      errorMessage={errorMessage}
      statusFilter={statusFilter}
      onStatusFilterChange={setStatusFilter}
    />
  );
}
