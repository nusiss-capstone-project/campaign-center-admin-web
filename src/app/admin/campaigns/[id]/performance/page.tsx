"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { CampaignPerformanceDashboard } from "@/components/admin/campaign-performance/campaign-performance-dashboard";
import { Button } from "@/components/ui/button";
import { fetchCampaignDetail } from "@/lib/admin/campaign-admin-fetch";
import { pickStr } from "@/lib/admin/campaign-performance-utils";

function parseCampaignId(raw: string | string[] | undefined): number {
  const s = Array.isArray(raw) ? raw[0] : raw;
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : NaN;
}

function pickCampaignName(data: unknown): string {
  const o =
    data && typeof data === "object" && !Array.isArray(data)
      ? (data as Record<string, unknown>)
      : null;
  if (!o) return "";
  return pickStr(o, ["name", "campaignName", "campaign_name"]);
}

export default function AdminCampaignPerformancePage() {
  const params = useParams();
  const campaignId = parseCampaignId(params?.id);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (!Number.isFinite(campaignId)) return;
    let cancelled = false;
    void (async () => {
      try {
        const data = await fetchCampaignDetail(campaignId);
        if (cancelled) return;
        setTitle(pickCampaignName(data));
      } catch {
        if (!cancelled) setTitle("");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [campaignId]);

  if (!Number.isFinite(campaignId)) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-400" role="alert">
          Invalid campaign id.
        </p>
        <Button variant="outline" asChild className="mt-4 border-white/10">
          <Link href="/admin/campaigns">← Campaigns</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-white/10 px-6 py-4 lg:px-8">
        <Button variant="outline" asChild className="border-white/10 bg-zinc-900/50">
          <Link href={`/admin/campaigns/${campaignId}`}>← Campaign details</Link>
        </Button>
      </div>
      <CampaignPerformanceDashboard
        campaignId={campaignId}
        campaignTitle={title || undefined}
      />
    </div>
  );
}
