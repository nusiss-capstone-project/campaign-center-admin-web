"use client";

import type { ProjectDisplayRow } from "@/lib/admin/reward/reward-row";
import { ProjectsPageHeader } from "@/components/admin/reward/projects-page-header";
import { ProjectsDataTable } from "@/components/admin/reward/projects-data-table";
import { RewardAsyncListBody } from "@/components/admin/reward/reward-async-list-body";

type ProjectsDashboardProps = {
  rows: ProjectDisplayRow[];
  total: number;
  loading: boolean;
  errorMessage: string | null;
  onRetry?: () => void;
};

export function ProjectsDashboard({
  rows,
  total,
  loading,
  errorMessage,
  onRetry,
}: Readonly<ProjectsDashboardProps>) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-white/10 px-6 py-6 lg:px-8">
        <ProjectsPageHeader total={total} />
      </div>
      <div className="flex flex-1 flex-col px-6 py-6 lg:px-8">
        <RewardAsyncListBody
          loading={loading}
          errorMessage={errorMessage}
          isEmpty={rows.length === 0}
          loadingLabel="Loading projects…"
          emptyLabel="No projects returned."
          onRetry={onRetry}
        >
          <ProjectsDataTable rows={rows} />
          <p className="mt-6 text-xs text-zinc-500">
            Showing {rows.length} of {total} projects
          </p>
        </RewardAsyncListBody>
      </div>
    </div>
  );
}
