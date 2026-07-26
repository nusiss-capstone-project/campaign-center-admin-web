"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import type { data_TemplateVOSwagger } from "@/lib/reward-api/models/data_TemplateVOSwagger";
import {
  canEditTemplateStatus,
  useRewardCapabilities,
} from "@/lib/admin/reward/reward-capabilities";
import { fetchTemplateById, updateTemplate } from "@/lib/admin/reward/reward-api";
import {
  parseTemplateToFormValues,
  toUpdateTemplatePayload,
  type TemplateFormValues,
} from "@/lib/admin/reward/template-form-values";
import { rewardApiErrorMessage } from "@/lib/admin/reward/reward-utils";
import { TemplateConfigForm } from "@/components/admin/reward/template-config-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminEditTemplatePage() {
  const params = useParams<{ templateId: string }>();
  const router = useRouter();
  const templateId = Number(params.templateId);
  const caps = useRewardCapabilities();

  const [template, setTemplate] = useState<data_TemplateVOSwagger | null>(null);
  const [values, setValues] = useState<TemplateFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (cancelled: () => boolean) => {
    if (!Number.isFinite(templateId) || templateId <= 0) {
      setLoadError("Invalid template ID");
      setLoading(false);
      return;
    }

    setLoading(true);
    setLoadError(null);
    try {
      const data = await fetchTemplateById(templateId);
      if (cancelled()) return;
      setTemplate(data);
      setValues(parseTemplateToFormValues(data));
    } catch (err) {
      if (cancelled()) return;
      setLoadError(rewardApiErrorMessage(err));
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
  }, [load]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values || !template) return;
    setError(null);
    setSubmitting(true);
    try {
      const payload = toUpdateTemplatePayload(values.type, values.config);
      await updateTemplate(templateId, payload);
      router.push(`/admin/rewards/templates/${templateId}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : rewardApiErrorMessage(err),
      );
    } finally {
      setSubmitting(false);
    }
  }

  const status = template?.status ?? "";
  const editable = caps.canEditTemplate && canEditTemplateStatus(status);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-zinc-500">Loading template…</p>
      </div>
    );
  }

  if (loadError || !template || !values) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Link
          href={`/admin/rewards/templates/${templateId}`}
          className="text-sm text-zinc-500 hover:text-zinc-300"
        >
          ← Template detail
        </Link>
        <p
          className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          role="alert"
        >
          {loadError ?? "Unable to load template"}
        </p>
      </div>
    );
  }

  if (!editable) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Link
          href={`/admin/rewards/templates/${templateId}`}
          className="text-sm text-zinc-500 hover:text-zinc-300"
        >
          ← Template detail
        </Link>
        <p className="text-sm text-zinc-400">
          This template cannot be edited in status {status || "UNKNOWN"}.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <Link
        href={`/admin/rewards/templates/${templateId}`}
        className="text-sm text-zinc-500 hover:text-zinc-300"
      >
        ← Template detail
      </Link>
      <Card className="border-white/10 bg-zinc-900/40">
        <CardHeader>
          <CardTitle>Edit template config</CardTitle>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="flex flex-col gap-4">
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            <div className="rounded-lg border border-white/10 bg-zinc-950/40 p-4 text-sm text-zinc-400">
              <p>Type: {values.type === "FIXED" ? "Fixed" : "Dynamic"}</p>
              <p className="mt-1">Voucher type: {values.voucherType || "—"}</p>
              <p className="mt-1">Unit: {values.unit || "—"}</p>
            </div>
            <TemplateConfigForm
              values={values}
              onChange={setValues}
              paymentConfigs={[]}
              configOnly
            />
          </CardContent>
          <CardFooter className="flex flex-wrap justify-between gap-3 border-t border-white/10 bg-transparent">
            <Button variant="outline" type="button" asChild>
              <Link href={`/admin/rewards/templates/${templateId}`}>
                Cancel
              </Link>
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-white text-black hover:bg-zinc-200"
            >
              {submitting ? "Saving…" : "Save config"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
