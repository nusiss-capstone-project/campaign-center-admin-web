"use client";

import { useState } from "react";

import { CampaignParticipationsTab } from "@/components/admin/campaign-performance/campaign-participations-tab";
import { CampaignPerformanceTab } from "@/components/admin/campaign-performance/campaign-performance-tab";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PerformanceTab = "performance" | "participations";

type CampaignPerformanceDashboardProps = {
  campaignId: number;
  campaignTitle?: string;
};

export function CampaignPerformanceDashboard({
  campaignId,
  campaignTitle,
}: CampaignPerformanceDashboardProps) {
  const [tab, setTab] = useState<PerformanceTab>("performance");

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-white/10 px-6 py-6 lg:px-8">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          {campaignTitle
            ? `${campaignTitle} — Performance`
            : `Campaign ${campaignId} — Performance`}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Summary metrics, daily trends, and participation records.
        </p>

        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as PerformanceTab)}
          className="mt-6 gap-0"
        >
          <TabsList
            variant="default"
            className="h-auto gap-2 bg-transparent p-0 text-zinc-500"
          >
            <TabsTrigger
              value="performance"
              className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 data-active:bg-zinc-800 data-active:text-white data-active:shadow-none"
            >
              Performance
            </TabsTrigger>
            <TabsTrigger
              value="participations"
              className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 data-active:bg-zinc-800 data-active:text-white data-active:shadow-none"
            >
              Participations
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-1 flex-col px-6 py-6 lg:px-8">
        {tab === "performance" ? (
          <CampaignPerformanceTab campaignId={campaignId} />
        ) : (
          <CampaignParticipationsTab campaignId={campaignId} />
        )}
      </div>
    </div>
  );
}
