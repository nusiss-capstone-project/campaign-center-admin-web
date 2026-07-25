"use client";

import { useCallback } from "react";

import { fetchFinanceDocs } from "@/lib/admin/reward/reward-api";
import { useRewardPagedList } from "@/lib/admin/reward/use-reward-paged-list";
import { FinanceDocsDashboard } from "@/components/admin/reward/finance-docs-dashboard";

export default function AdminRewardFinanceDocsPage() {
  const fetchPage = useCallback(
    () => fetchFinanceDocs({ page: 1, size: 20 }),
    [],
  );
  const { rows, total, loading, errorMessage, retry } =
    useRewardPagedList(fetchPage);

  return (
    <FinanceDocsDashboard
      rows={rows}
      total={total}
      loading={loading}
      errorMessage={errorMessage}
      onRetry={retry}
    />
  );
}
