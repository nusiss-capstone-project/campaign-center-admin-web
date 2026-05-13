"use client";

import { useEffect, useState } from "react";

import { CampaignsDashboard } from "@/components/admin/campaigns-dashboard";
import type { CampaignDisplayRow } from "@/lib/admin/campaign-row";
import { normalizeCampaignRows } from "@/lib/admin/campaign-row";
import { buildPublicApiUrl } from "@/lib/admin/campaign-admin-api";
import { isNonProductionRuntime } from "@/lib/is-non-production-runtime";

type CampaignsApiResponse = {
  code?: number;
  message?: string;
  data?: {
    total?: number;
    items?: unknown[];
  };
};

function buildCampaignsListUrl(): string {
  return buildPublicApiUrl(
    "/campaign-center-api/v1/admin/campaigns?page=1&pageSize=10",
  );
}

export default function AdminCampaignsPage() {
  const [rows, setRows] = useState<CampaignDisplayRow[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchCampaigns() {
      setLoading(true);
      setErrorMessage(null);

      const url = buildCampaignsListUrl();
      if (isNonProductionRuntime()) {
        console.log("[admin/campaigns] request URL:", url);
      }

      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`${res.status} ${res.statusText}`);
        }

        const body = (await res.json()) as CampaignsApiResponse;
        if (cancelled) return;

        if (body.code != null && body.code !== 0) {
          setErrorMessage(body.message ?? "Request failed");
          setRows([]);
          return;
        }

        const rawItems = body.data?.items;
        const items = Array.isArray(rawItems)
          ? (rawItems as Record<string, unknown>[])
          : [];
        setRows(normalizeCampaignRows(items));
      } catch (e) {
        if (cancelled) return;
        setErrorMessage(
          e instanceof Error ? e.message : "Request failed",
        );
        setRows([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchCampaigns();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return (
    <CampaignsDashboard
      rows={rows}
      errorMessage={errorMessage}
      loading={loading}
      onCampaignsMutated={() => setRefreshKey((k) => k + 1)}
    />
  );
}
