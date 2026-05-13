"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { api_UpdateCampaignReq } from "@/lib/api/models/api_UpdateCampaignReq";
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
import {
  fetchCampaignDetail,
  updateCampaign,
} from "@/lib/admin/campaign-admin-fetch";
import type { CampaignFormValues } from "@/lib/admin/campaign-form-values";
import {
  emptyCampaignFormValues,
  localDatetimeToIso,
  parseCampaignDetailToFormValues,
  pickCampaignStatus,
  statusCodeToLabel,
} from "@/lib/admin/campaign-form-values";

function toUpdatePayload(v: CampaignFormValues): api_UpdateCampaignReq {
  const landingTrim = v.landingPageId.trim();
  const body: api_UpdateCampaignReq = {
    name: v.name.trim(),
    targetMarket: v.targetMarket.trim(),
    targetUserSegment: v.targetUserSegment.trim(),
    registrationStartTime: localDatetimeToIso(v.registrationStartTime),
    registrationEndTime: localDatetimeToIso(v.registrationEndTime),
    campaignStartTime: localDatetimeToIso(v.campaignStartTime),
    campaignEndTime: localDatetimeToIso(v.campaignEndTime),
    rewardRules: {
      rewardType: v.rewardType.trim(),
      rewardAmount: Number(v.rewardAmount),
      topupThreshold: Number(v.topupThreshold),
      maxClaimPerUser: Number(v.maxClaimPerUser),
    },
  };
  if (landingTrim !== "") {
    const n = Number(landingTrim);
    if (!Number.isNaN(n)) body.landingPageId = n;
  }
  return body;
}

export default function AdminCampaignEditPage() {
  const params = useParams();
  const router = useRouter();
  const idParam = params?.id;
  const campaignId =
    typeof idParam === "string"
      ? Number(idParam)
      : Array.isArray(idParam)
        ? Number(idParam[0])
        : NaN;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
        const code = pickCampaignStatus(data);
        if (code === 3) {
          router.replace(`/admin/campaigns/${campaignId}`);
          return;
        }
        if (code !== 1 && code !== 2) {
          setError("Only draft or published campaigns can be edited.");
          setRaw(data);
          setValues(parseCampaignDetailToFormValues(data));
          return;
        }
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
  }, [campaignId, router]);

  const statusCode = pickCampaignStatus(raw);
  const statusLabel = statusCodeToLabel(statusCode);
  const canSubmit = statusCode === 1 || statusCode === 2;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setSaving(true);
    const payload = toUpdatePayload(values);
    if (
      !payload.name ||
      !payload.targetMarket ||
      !payload.targetUserSegment ||
      !payload.registrationStartTime ||
      !payload.registrationEndTime ||
      !payload.campaignStartTime ||
      !payload.campaignEndTime
    ) {
      setError("Fill required fields and valid date/time values.");
      setSaving(false);
      return;
    }
    try {
      await updateCampaign(campaignId, payload);
      router.push(`/admin/campaigns/${campaignId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="outline" asChild className="border-white/10 bg-zinc-900/50">
          <Link href={`/admin/campaigns/${campaignId}`}>← Details</Link>
        </Button>
      </div>

      <Card className="border-white/10 bg-zinc-900/40 text-zinc-100 ring-white/10">
        <CardHeader>
          <CardTitle className="text-white">Edit campaign</CardTitle>
          <CardDescription className="text-zinc-500">
            Update fields and save (draft or published only)
          </CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="flex flex-col gap-4">
            {loading ? (
              <p className="text-sm text-zinc-500">Loading…</p>
            ) : (
              <>
                {error ? (
                  <p className="text-sm text-red-400" role="alert">
                    {error}
                  </p>
                ) : null}
                <CampaignDetailsForm
                  values={values}
                  readOnly={!canSubmit}
                  onChange={setValues}
                  statusLabel={statusLabel}
                />
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-wrap justify-between gap-3 border-t border-white/10 bg-transparent">
            <Button variant="outline" type="button" asChild className="border-white/10">
              <Link href={`/admin/campaigns/${campaignId}`}>Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={loading || saving || !canSubmit}
              className="border-0 bg-white text-black hover:bg-zinc-200"
            >
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
