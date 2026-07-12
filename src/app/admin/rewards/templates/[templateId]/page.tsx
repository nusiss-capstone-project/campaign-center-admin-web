"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import type { data_TemplateVOSwagger } from "@/lib/reward-api/models/data_TemplateVOSwagger";
import { fetchTemplateById } from "@/lib/admin/reward/reward-api";
import { rewardApiErrorMessage } from "@/lib/admin/reward/reward-utils";
import { TemplateDetailDashboard } from "@/components/admin/reward/template-detail-dashboard";
import { Button } from "@/components/ui/button";

export default function AdminTemplateDetailPage() {
  const params = useParams<{ templateId: string }>();
  const templateId = Number(params.templateId);

  const [template, setTemplate] = useState<data_TemplateVOSwagger | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const load = useCallback(async (cancelled: () => boolean) => {
    if (!Number.isFinite(templateId) || templateId <= 0) {
      setErrorMessage("Invalid template ID");
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchTemplateById(templateId);
      if (cancelled()) return;
      setTemplate(data);
    } catch (err) {
      if (cancelled()) return;
      setErrorMessage(rewardApiErrorMessage(err));
      setTemplate(null);
    } finally {
      if (!cancelled()) setLoading(false);
    }
  }, [templateId]);

  useEffect(() => {
    let cancelled = false;
    void load(() => cancelled);
    return () => {
      cancelled = true;
    };
  }, [load, refreshKey]);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-zinc-500">Loading template…</p>
      </div>
    );
  }

  if (errorMessage || !template) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Link
          href="/admin/rewards/templates"
          className="text-sm text-zinc-500 hover:text-zinc-300"
        >
          ← Templates
        </Link>
        <p
          className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          role="alert"
        >
          {errorMessage ?? "Template not found"}
        </p>
        <Button
          variant="outline"
          className="w-fit"
          onClick={() => setRefreshKey((k) => k + 1)}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <TemplateDetailDashboard
      template={template}
      onRefresh={() => setRefreshKey((k) => k + 1)}
    />
  );
}
