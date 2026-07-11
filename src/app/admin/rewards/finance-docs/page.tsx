"use client";

import { useCallback, useEffect, useState } from "react";

import { fetchFinanceDocs } from "@/lib/admin/reward/reward-api";
import type { FinanceDocDisplayRow } from "@/lib/admin/reward/reward-row";
import { rewardApiErrorMessage } from "@/lib/admin/reward/reward-utils";
import { FinanceDocsDashboard } from "@/components/admin/reward/finance-docs-dashboard";

export default function AdminRewardFinanceDocsPage() {
  const [rows, setRows] = useState<FinanceDocDisplayRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const load = useCallback(async (cancelled: () => boolean) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const result = await fetchFinanceDocs({ page: 1, size: 20 });
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
    <FinanceDocsDashboard
      rows={rows}
      total={total}
      loading={loading}
      errorMessage={errorMessage}
      onRetry={() => setRefreshKey((k) => k + 1)}
    />
  );
}
