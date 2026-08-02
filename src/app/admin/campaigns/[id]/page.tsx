"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import type { data_CampaignVO } from "@/lib/api/models/data_CampaignVO";
import { fetchCampaignDetail } from "@/lib/admin/campaign-admin-fetch";
import {
  emptyCampaignFormValues,
  parseCampaignDetailToFormValues,
  pickCampaignDetailName,
  pickCampaignStatus,
  pickCampaignVersion,
  statusCodeToLabel,
  type CampaignFormValues,
} from "@/lib/admin/campaign-form-values";
import { parseRouteId } from "@/lib/admin/parse-route-id";
import { CampaignDetailsForm } from "@/components/admin/campaign-details-form";
import { EditCampaignButton } from "@/components/admin/edit-campaign-button";
import { useAdminCapabilities } from "@/components/admin/admin-access-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminCampaignDetailPage() {
  const params = useParams();
  const campaignId = parseRouteId(params.id);
  const caps = useAdminCapabilities();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [raw, setRaw] = useState<data_CampaignVO | null>(null);
  const [values, setValues] = useState<CampaignFormValues>(
    emptyCampaignFormValues(),
  );

  useEffect(() => {
    if (!Number.isFinite(campaignId) || campaignId <= 0) {
      setError("Invalid campaign id");
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCampaignDetail(campaignId);
        if (cancelled) return;
        setRaw(data);
        setValues(parseCampaignDetailToFormValues(data));
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Load failed");
        setRaw(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [campaignId]);

  const statusCode = pickCampaignStatus(raw);
  const statusLabel = statusCodeToLabel(statusCode);
  const version = pickCampaignVersion(raw);
  const canEdit = statusCode === 1 || statusCode === 2;
  const statusCategory = statusCode === 2 ? "published" : "draft";
  const titleName =
    values.name.trim() ||
    pickCampaignDetailName(raw) ||
    `Campaign ${campaignId}`;

  function renderContent() {
    if (loading) {
      return <p className="text-sm text-zinc-500">Loading…</p>;
    }
    if (error) {
      return (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      );
    }
    return (
      <CampaignDetailsForm
        values={values}
        readOnly
        statusLabel={statusLabel}
        versionLabel={version != null ? String(version) : null}
      />
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="outline"
          asChild
          className="border-white/10 bg-zinc-900/50"
        >
          <Link href="/admin/campaigns">← Campaigns</Link>
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            asChild
            className="border-white/10 bg-zinc-900/50"
          >
            <Link href={`/admin/campaigns/${campaignId}/performance`}>
              Performance
            </Link>
          </Button>
          {canEdit && caps.canEditCampaign ? (
            <EditCampaignButton
              campaignId={campaignId}
              statusCategory={statusCategory}
              className="border-0 bg-white text-black hover:bg-zinc-200"
            >
              Edit
            </EditCampaignButton>
          ) : null}
        </div>
      </div>

      <Card className="border-white/10 bg-zinc-900/40 text-zinc-100 ring-white/10">
        <CardHeader>
          <CardTitle className="text-white">{titleName}</CardTitle>
          <CardDescription className="text-zinc-500">
            View campaign details
          </CardDescription>
        </CardHeader>
        <CardContent>{renderContent()}</CardContent>
        {!loading && !error ? (
          <CardFooter className="border-t border-white/10 bg-transparent">
            <Button variant="outline" asChild className="border-white/10">
              <Link href="/admin/campaigns">Back to list</Link>
            </Button>
          </CardFooter>
        ) : null}
      </Card>
    </div>
  );
}
