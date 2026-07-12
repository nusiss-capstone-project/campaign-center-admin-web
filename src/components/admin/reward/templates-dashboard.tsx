"use client";

import type { TemplateDisplayRow } from "@/lib/admin/reward/reward-row";
import { TemplatesPageHeader } from "@/components/admin/reward/templates-page-header";
import { TemplatesDataTable } from "@/components/admin/reward/templates-data-table";
import { Button } from "@/components/ui/button";

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
}: TemplatesDashboardProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-white/10 px-6 py-6 lg:px-8">
        <TemplatesPageHeader total={total} />
      </div>
      <div className="flex flex-1 flex-col px-6 py-6 lg:px-8">
        {loading ? (
          <p className="text-sm text-zinc-500">Loading templates…</p>
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
          <p className="text-sm text-zinc-500">No templates returned.</p>
        ) : (
          <TemplatesDataTable rows={rows} />
        )}
        {!loading && !errorMessage && rows.length > 0 ? (
          <p className="mt-6 text-xs text-zinc-500">
            Showing {rows.length} of {total} templates
          </p>
        ) : null}
      </div>
    </div>
  );
}
