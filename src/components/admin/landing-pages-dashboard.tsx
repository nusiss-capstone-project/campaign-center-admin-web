"use client";

import type { LandingPageDisplayRow } from "@/lib/admin/landing-page-row";
import {
  LandingPagesPageHeader,
  type LandingPageStatusFilter,
} from "@/components/admin/landing-pages-page-header";
import { LandingPagesDataTable } from "@/components/admin/landing-pages-data-table";

type LandingPagesDashboardProps = {
  rows: LandingPageDisplayRow[];
  total: number;
  errorMessage: string | null;
  loading?: boolean;
  languageFilter: string;
  onLanguageFilterChange: (value: string) => void;
  statusFilter: LandingPageStatusFilter;
  onStatusFilterChange: (value: LandingPageStatusFilter) => void;
  onMutated?: () => void;
};

export function LandingPagesDashboard({
  rows,
  total,
  errorMessage,
  loading = false,
  languageFilter,
  onLanguageFilterChange,
  statusFilter,
  onStatusFilterChange,
  onMutated,
}: LandingPagesDashboardProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-white/10 px-6 py-6 lg:px-8">
        <LandingPagesPageHeader
          total={total}
          languageFilter={languageFilter}
          onLanguageFilterChange={onLanguageFilterChange}
          statusFilter={statusFilter}
          onStatusFilterChange={onStatusFilterChange}
        />
      </div>

      <div className="flex flex-1 flex-col px-6 py-6 lg:px-8">
        {loading ? (
          <p className="text-sm text-zinc-500">Loading landing pages…</p>
        ) : errorMessage ? (
          <p
            className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
            role="alert"
          >
            {errorMessage}
          </p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-zinc-500">No landing pages returned.</p>
        ) : (
          <LandingPagesDataTable rows={rows} onMutated={onMutated} />
        )}

        {!loading && !errorMessage && rows.length > 0 ? (
          <p className="mt-6 text-xs text-zinc-500">
            Showing {rows.length} of {total} landing pages
          </p>
        ) : null}
      </div>
    </div>
  );
}
