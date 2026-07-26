"use client";

import type { FinanceDocDisplayRow } from "@/lib/admin/reward/reward-row";
import { FinanceDocsPageHeader } from "@/components/admin/reward/finance-docs-page-header";
import { FinanceDocsDataTable } from "@/components/admin/reward/finance-docs-data-table";
import { RewardAsyncListBody } from "@/components/admin/reward/reward-async-list-body";

type FinanceDocsDashboardProps = {
  rows: FinanceDocDisplayRow[];
  total: number;
  loading: boolean;
  errorMessage: string | null;
  onRetry?: () => void;
};

export function FinanceDocsDashboard({
  rows,
  total,
  loading,
  errorMessage,
  onRetry,
}: Readonly<FinanceDocsDashboardProps>) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-white/10 px-6 py-6 lg:px-8">
        <FinanceDocsPageHeader total={total} />
      </div>
      <div className="flex flex-1 flex-col px-6 py-6 lg:px-8">
        <RewardAsyncListBody
          loading={loading}
          errorMessage={errorMessage}
          isEmpty={rows.length === 0}
          loadingLabel="Loading finance docs…"
          emptyLabel="No finance docs returned."
          onRetry={onRetry}
        >
          <FinanceDocsDataTable rows={rows} />
          <p className="mt-6 text-xs text-zinc-500">
            Showing {rows.length} of {total} finance docs
          </p>
        </RewardAsyncListBody>
      </div>
    </div>
  );
}
