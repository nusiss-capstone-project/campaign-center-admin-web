"use client";

import { useMemo, useState } from "react";

import type { CampaignDisplayRow } from "@/lib/admin/campaign-row";
import { countPublishedCampaigns } from "@/lib/admin/campaign-row";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignsDataTable } from "@/components/admin/campaigns-data-table";
import { CampaignsPageHeader } from "@/components/admin/campaigns-page-header";

type FilterTab = "all" | CampaignDisplayRow["statusCategory"];

type CampaignsDashboardProps = {
  rows: CampaignDisplayRow[];
  errorMessage: string | null;
  loading?: boolean;
  onCampaignsMutated?: () => void;
};

export function CampaignsDashboard({
  rows,
  errorMessage,
  loading = false,
  onCampaignsMutated,
}: CampaignsDashboardProps) {
  const [tab, setTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");

  const publishedCount = useMemo(() => countPublishedCampaigns(rows), [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (tab !== "all" && row.statusCategory !== tab) return false;
      if (!q) return true;
      return row.name.toLowerCase().includes(q);
    });
  }, [rows, tab, search]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-white/10 px-6 py-6 lg:px-8">
        <CampaignsPageHeader
          publishedCount={publishedCount}
          searchQuery={search}
          onSearchChange={setSearch}
        />

        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as FilterTab)}
          className="mt-6 gap-0"
        >
          <TabsList
            variant="default"
            className="h-auto gap-2 bg-transparent p-0 text-zinc-500"
          >
            {(
              [
                ["all", "All Campaigns"],
                ["draft", "Drafts"],
                ["published", "Published"],
                ["archive", "Archived"],
              ] as const
            ).map(([value, label]) => (
              <TabsTrigger
                key={value}
                value={value}
                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 data-active:bg-zinc-800 data-active:text-white data-active:shadow-none"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-1 flex-col px-6 py-6 lg:px-8">
        {loading ? (
          <p className="text-sm text-zinc-500">Loading campaigns…</p>
        ) : errorMessage ? (
          <p
            className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
            role="alert"
          >
            {errorMessage}
          </p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-zinc-500">No campaigns returned.</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-zinc-500">
            No campaigns match your filters.
          </p>
        ) : (
          <CampaignsDataTable
            rows={filtered}
            onCampaignsMutated={onCampaignsMutated}
          />
        )}

        {!loading && !errorMessage && rows.length > 0 ? (
          <p className="mt-6 text-xs text-zinc-500">
            Showing {filtered.length} of {rows.length} campaigns
          </p>
        ) : null}
      </div>
    </div>
  );
}
