"use client";

import { useCallback, useState } from "react";

import { fetchTemplates } from "@/lib/admin/reward/reward-api";
import { useRewardPagedList } from "@/lib/admin/reward/use-reward-paged-list";
import { TemplatesDashboard } from "@/components/admin/reward/templates-dashboard";
import type { TemplateStatusFilter } from "@/components/admin/reward/templates-page-header";

function statusToQuery(
  status: TemplateStatusFilter,
): "DRAFT" | "PUBLISHED" | undefined {
  if (status === "all") return undefined;
  return status;
}

export default function AdminRewardTemplatesPage() {
  const [statusFilter, setStatusFilter] =
    useState<TemplateStatusFilter>("all");

  const fetchPage = useCallback(
    () =>
      fetchTemplates({
        page: 1,
        size: 20,
        status: statusToQuery(statusFilter),
      }),
    [statusFilter],
  );
  const { rows, total, loading, errorMessage, retry } =
    useRewardPagedList(fetchPage);

  return (
    <TemplatesDashboard
      rows={rows}
      total={total}
      loading={loading}
      errorMessage={errorMessage}
      statusFilter={statusFilter}
      onStatusFilterChange={setStatusFilter}
      onRetry={retry}
    />
  );
}
