"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { data_CampaignVO } from "@/lib/api/models/data_CampaignVO";
import {
  fetchCampaignDetail,
  publishCampaign,
  saveCampaignVersion,
} from "@/lib/admin/campaign-admin-fetch";
import {
  emptyCampaignFormValues,
  parseCampaignDetailToFormValues,
  pickCampaignStatus,
  pickCampaignVersion,
  statusCodeToLabel,
  toCampaignVOPayload,
  type CampaignFormValues,
} from "@/lib/admin/campaign-form-values";
import { parseRouteId } from "@/lib/admin/parse-route-id";
import { CampaignDetailsForm } from "@/components/admin/campaign-details-form";
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

export default function AdminEditCampaignPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = parseRouteId(params.id);
  const caps = useAdminCapabilities();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [raw, setRaw] = useState<data_CampaignVO | null>(null);
  const [values, setValues] = useState<CampaignFormValues>(
    emptyCampaignFormValues(),
  );
  const [version, setVersion] = useState<number | null>(null);
  const [hasSaved, setHasSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

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
      setHasSaved(false);
      setDirty(false);
      try {
        const detail = await fetchCampaignDetail(campaignId);
        if (cancelled) return;

        const ver = pickCampaignVersion(detail);
        if (ver == null) {
          throw new Error("Campaign version missing from detail");
        }

        setRaw(detail);
        setVersion(ver);
        setValues(parseCampaignDetailToFormValues(detail));
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
  const canEdit = caps.canEditCampaign && version != null && !loading;
  const canPublish =
    caps.canPublishCampaign &&
    canEdit &&
    hasSaved &&
    !dirty &&
    !saving &&
    !publishing;

  function onFormChange(next: CampaignFormValues) {
    setValues(next);
    setDirty(true);
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (version == null) {
      setError("Missing version");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = toCampaignVOPayload(values, {
        id: campaignId,
        version,
        status: statusCode ?? 1,
      });
      const saved = await saveCampaignVersion(campaignId, version, payload);
      // Save responses are often empty / partial — do not re-parse them into
      // the form or fields will clear. Keep the submitted values.
      const nextRaw = {
        ...payload,
        ...(saved && typeof saved === "object" ? saved : {}),
      };
      setRaw(nextRaw);
      const ver = pickCampaignVersion(nextRaw) ?? version;
      setVersion(ver);
      setHasSaved(true);
      setDirty(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function onPublish() {
    if (version == null || !hasSaved || dirty) {
      setError("Save the draft before publishing.");
      return;
    }
    setPublishing(true);
    setError(null);
    try {
      await publishCampaign(campaignId);
      router.push(`/admin/campaigns/${campaignId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publish failed");
      setPublishing(false);
    }
  }

  function renderContent() {
    if (loading) {
      return <p className="text-sm text-zinc-500">Loading…</p>;
    }
    if (!canEdit && !loading) {
      return (
        <output className="block text-sm text-amber-300">
          This campaign is not editable in its current state.
        </output>
      );
    }
    return (
      <>
        {error ? (
          <p className="mb-4 text-sm text-red-400" role="alert">
            {error}
          </p>
        ) : null}
        <CampaignDetailsForm
          values={values}
          readOnly={false}
          onChange={onFormChange}
          statusLabel={statusLabel}
          versionLabel={version != null ? String(version) : null}
        />
      </>
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
          <Link href={`/admin/campaigns/${campaignId}`}>← Detail</Link>
        </Button>
      </div>

      <Card className="border-white/10 bg-zinc-900/40 text-zinc-100 ring-white/10">
        <CardHeader>
          <CardTitle className="text-white">Edit campaign version</CardTitle>
          <CardDescription className="text-zinc-500">
            Save draft content, then publish when ready. Publish stays disabled
            until you save at least once in this session.
          </CardDescription>
        </CardHeader>
        <form onSubmit={(e) => void onSave(e)}>
          <CardContent>{renderContent()}</CardContent>
          <CardFooter className="flex flex-wrap justify-between gap-3 border-t border-white/10 bg-transparent">
            <Button
              variant="outline"
              type="button"
              asChild
              className="border-white/10"
            >
              <Link href={`/admin/campaigns/${campaignId}`}>Cancel</Link>
            </Button>
            <div className="flex flex-wrap gap-2">
              <Button
                type="submit"
                disabled={loading || saving || publishing || !canEdit}
                variant="outline"
                className="border-white/10"
              >
                {saving ? "Saving…" : "Save draft"}
              </Button>
              <Button
                type="button"
                disabled={!canPublish}
                title={
                  !hasSaved || dirty
                    ? "Save the draft before publishing"
                    : undefined
                }
                className="border-0 bg-white text-black hover:bg-zinc-200 disabled:opacity-40"
                onClick={() => void onPublish()}
              >
                {publishing ? "Publishing…" : "Publish"}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
