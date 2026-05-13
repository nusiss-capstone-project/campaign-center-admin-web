"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { CampaignDetailsForm } from "@/components/admin/campaign-details-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchCampaignDetail } from "@/lib/admin/campaign-admin-fetch";
import {
  emptyCampaignFormValues,
  parseCampaignDetailToFormValues,
  pickCampaignStatus,
  statusCodeToLabel,
} from "@/lib/admin/campaign-form-values";

export default function AdminCampaignDetailPage() {
  const params = useParams();
  const idParam = params?.id;
  const campaignId =
    typeof idParam === "string"
      ? Number(idParam)
      : Array.isArray(idParam)
        ? Number(idParam[0])
        : NaN;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [raw, setRaw] = useState<unknown>(null);
  const [values, setValues] = useState(() => emptyCampaignFormValues());

  useEffect(() => {
    if (!Number.isFinite(campaignId) || campaignId <= 0) {
      setLoading(false);
      setError("Invalid campaign id");
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
  const canEdit = statusCode === 1 || statusCode === 2;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="outline" asChild className="border-white/10 bg-zinc-900/50">
          <Link href="/admin/campaigns">← Campaigns</Link>
        </Button>
        {canEdit ? (
          <Button asChild className="border-0 bg-white text-black hover:bg-zinc-200">
            <Link href={`/admin/campaigns/${campaignId}/edit`}>Edit</Link>
          </Button>
        ) : null}
      </div>

      <Card className="border-white/10 bg-zinc-900/40 text-zinc-100 ring-white/10">
        <CardHeader>
          <CardTitle className="text-white">
            {values.name || `Campaign ${campaignId}`}
          </CardTitle>
          <CardDescription className="text-zinc-500">
            View campaign details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-zinc-500">Loading…</p>
          ) : error ? (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          ) : (
            <CampaignDetailsForm
              values={values}
              readOnly
              statusLabel={statusLabel}
            />
          )}
        </CardContent>
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
