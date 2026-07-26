"use client";

import { useCallback } from "react";

import { fetchProjects } from "@/lib/admin/reward/reward-api";
import { useRewardPagedList } from "@/lib/admin/reward/use-reward-paged-list";
import { ProjectsDashboard } from "@/components/admin/reward/projects-dashboard";

export default function AdminRewardProjectsPage() {
  const fetchPage = useCallback(
    () => fetchProjects({ page: 1, size: 20 }),
    [],
  );
  const { rows, total, loading, errorMessage, retry } =
    useRewardPagedList(fetchPage);

  return (
    <ProjectsDashboard
      rows={rows}
      total={total}
      loading={loading}
      errorMessage={errorMessage}
      onRetry={retry}
    />
  );
}
