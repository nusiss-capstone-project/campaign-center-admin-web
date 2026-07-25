"use client";

import { useCallback } from "react";

import { fetchTemplates } from "@/lib/admin/reward/reward-api";
import { useRewardPagedList } from "@/lib/admin/reward/use-reward-paged-list";
import { TemplatesDashboard } from "@/components/admin/reward/templates-dashboard";

export default function AdminRewardTemplatesPage() {
  const fetchPage = useCallback(
    () => fetchTemplates({ page: 1, size: 20 }),
    [],
  );
  const { rows, total, loading, errorMessage, retry } =
    useRewardPagedList(fetchPage);

  return (
    <TemplatesDashboard
      rows={rows}
      total={total}
      loading={loading}
      errorMessage={errorMessage}
      onRetry={retry}
    />
  );
}
