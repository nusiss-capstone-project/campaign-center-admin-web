"use client";

import { useEffect, useState } from "react";

import { TaskGroupsDashboard } from "@/components/admin/task-groups-dashboard";
import { fetchTaskGroups, taskGroupsListUrl } from "@/lib/admin/task-admin-fetch";
import {
  normalizeTaskGroupRows,
  type TaskGroupDisplayRow,
} from "@/lib/admin/task-row";
import { isNonProductionRuntime } from "@/lib/is-non-production-runtime";

export default function AdminTaskGroupsPage() {
  const [rows, setRows] = useState<TaskGroupDisplayRow[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErrorMessage(null);

      if (isNonProductionRuntime()) {
        console.log("[admin/task-group] request URL:", taskGroupsListUrl());
      }

      try {
        const data = await fetchTaskGroups();
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

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <TaskGroupsDashboard
      rows={rows}
      loading={loading}
      errorMessage={errorMessage}
    />
  );
}
