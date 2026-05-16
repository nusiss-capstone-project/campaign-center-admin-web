"use client";

import { useEffect, useMemo, useState } from "react";

import { LandingPagesDashboard } from "@/components/admin/landing-pages-dashboard";
import type { LandingPageStatusFilter } from "@/components/admin/landing-pages-page-header";
import type { LandingPageDisplayRow } from "@/lib/admin/landing-page-row";
import { normalizeLandingPageRows } from "@/lib/admin/landing-page-row";
import {
  buildLandingPagesListUrl,
  type LandingPagesListResponse,
} from "@/lib/admin/landing-pages-fetch";
import { fetchWithClerkAuthorization } from "@/lib/auth/clerk-token";
import { isNonProductionRuntime } from "@/lib/is-non-production-runtime";

function statusToQuery(status: LandingPageStatusFilter): number | undefined {
  if (status === "all") return undefined;
  return Number(status);
}

export default function AdminLandingPagesPage() {
  const [rows, setRows] = useState<LandingPageDisplayRow[]>([]);
  const [total, setTotal] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [defaultLangFilter, setDefaultLangFilter] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<LandingPageStatusFilter>("all");

  const listParams = useMemo(
    () => ({
      page: 1,
      pageSize: 10,
      defaultLang: defaultLangFilter.trim() || undefined,
      status: statusToQuery(statusFilter),
    }),
    [defaultLangFilter, statusFilter],
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErrorMessage(null);

      const url = buildLandingPagesListUrl(listParams);
      if (isNonProductionRuntime()) {
        console.log("[admin/landing-pages] request URL:", url);
      }

      try {
        const res = await fetchWithClerkAuthorization(url);
        if (!res.ok) {
          throw new Error(`${res.status} ${res.statusText}`);
        }

        const body = (await res.json()) as LandingPagesListResponse;
        if (cancelled) return;

        if (body.code != null && body.code !== 0) {
          setErrorMessage(body.message ?? "Request failed");
          setRows([]);
          setTotal(0);
          return;
        }

        const rawItems = body.data?.items;
        const items = Array.isArray(rawItems)
          ? (rawItems as Record<string, unknown>[])
          : [];
        setRows(normalizeLandingPageRows(items));
        const t = body.data?.total;
        setTotal(typeof t === "number" ? t : items.length);
      } catch (e) {
        if (cancelled) return;
        setErrorMessage(e instanceof Error ? e.message : "Request failed");
        setRows([]);
        setTotal(0);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [listParams, refreshKey]);

  return (
    <LandingPagesDashboard
      rows={rows}
      total={total}
      errorMessage={errorMessage}
      loading={loading}
      languageFilter={defaultLangFilter}
      onLanguageFilterChange={setDefaultLangFilter}
      statusFilter={statusFilter}
      onStatusFilterChange={setStatusFilter}
      onMutated={() => setRefreshKey((k) => k + 1)}
    />
  );
}
