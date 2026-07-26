"use client";

import type { TemplateDisplayRow } from "@/lib/admin/reward/reward-row";
import { TemplatesPageHeader } from "@/components/admin/reward/templates-page-header";
import { TemplatesDataTable } from "@/components/admin/reward/templates-data-table";
import { RewardAsyncListBody } from "@/components/admin/reward/reward-async-list-body";

type TemplatesDashboardProps = {
  rows: TemplateDisplayRow[];
  total: number;
  loading: boolean;
  errorMessage: string | null;
  onRetry?: () => void;
};

export function TemplatesDashboard({
  rows,
  total,
  loading,
  errorMessage,
  onRetry,
}: Readonly<TemplatesDashboardProps>) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-white/10 px-6 py-6 lg:px-8">
        <TemplatesPageHeader total={total} />
      </div>
      <div className="flex flex-1 flex-col px-6 py-6 lg:px-8">
        <RewardAsyncListBody
          loading={loading}
          errorMessage={errorMessage}
          isEmpty={rows.length === 0}
          loadingLabel="Loading templates…"
          emptyLabel="No templates returned."
          onRetry={onRetry}
        >
          <TemplatesDataTable rows={rows} />
          <p className="mt-6 text-xs text-zinc-500">
            Showing {rows.length} of {total} templates
          </p>
        </RewardAsyncListBody>
      </div>
    </div>
  );
}
