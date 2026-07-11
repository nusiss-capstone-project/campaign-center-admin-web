"use client";

import { useCallback, useEffect, useState } from "react";

import { fetchProjects } from "@/lib/admin/reward/reward-api";
import type { ProjectDisplayRow } from "@/lib/admin/reward/reward-row";
import { rewardApiErrorMessage } from "@/lib/admin/reward/reward-utils";
import { ProjectsDashboard } from "@/components/admin/reward/projects-dashboard";

export default function AdminRewardProjectsPage() {
  const [rows, setRows] = useState<ProjectDisplayRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const load = useCallback(async (cancelled: () => boolean) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const result = await fetchProjects({ page: 1, size: 20 });
      if (cancelled()) return;
      setRows(result.rows);
      setTotal(result.total);
    } catch (err) {
      if (cancelled()) return;
      setErrorMessage(rewardApiErrorMessage(err));
      setRows([]);
      setTotal(0);
    } finally {
      if (!cancelled()) setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void load(() => cancelled);
    return () => {
      cancelled = true;
    };
  }, [load, refreshKey]);

  return (
    <ProjectsDashboard
      rows={rows}
      total={total}
      loading={loading}
      errorMessage={errorMessage}
      onRetry={() => setRefreshKey((k) => k + 1)}
    />
  );
}
