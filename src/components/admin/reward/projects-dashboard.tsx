"use client";

import type { ProjectDisplayRow } from "@/lib/admin/reward/reward-row";
import { ProjectsPageHeader } from "@/components/admin/reward/projects-page-header";
import { ProjectsDataTable } from "@/components/admin/reward/projects-data-table";
import { Button } from "@/components/ui/button";

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
}: ProjectsDashboardProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-white/10 px-6 py-6 lg:px-8">
        <ProjectsPageHeader total={total} />
      </div>
      <div className="flex flex-1 flex-col px-6 py-6 lg:px-8">
        {loading ? (
          <p className="text-sm text-zinc-500">Loading projects…</p>
        ) : errorMessage ? (
          <div className="flex flex-col gap-3">
            <p
              className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
              role="alert"
            >
              {errorMessage}
            </p>
            {onRetry ? (
              <Button variant="outline" onClick={onRetry} className="w-fit">
                Retry
              </Button>
            ) : null}
          </div>
        ) : rows.length === 0 ? (
          <p className="text-sm text-zinc-500">No projects returned.</p>
        ) : (
          <ProjectsDataTable rows={rows} />
        )}
        {!loading && !errorMessage && rows.length > 0 ? (
          <p className="mt-6 text-xs text-zinc-500">
            Showing {rows.length} of {total} projects
          </p>
        ) : null}
      </div>
    </div>
  );
}
