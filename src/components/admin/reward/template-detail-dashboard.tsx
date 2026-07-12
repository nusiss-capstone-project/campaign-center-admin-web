"use client";

import Link from "next/link";
import { useState } from "react";

import type { data_TemplateVOSwagger } from "@/lib/reward-api/models/data_TemplateVOSwagger";
import {
  canEditTemplateStatus,
  canPublishTemplateStatus,
  useRewardCapabilities,
} from "@/lib/admin/reward/reward-capabilities";
import { publishTemplate } from "@/lib/admin/reward/reward-api";
import {
  configSummary,
  parseTemplateToFormValues,
  parseTemplateType,
} from "@/lib/admin/reward/template-form-values";
import { rewardApiErrorMessage } from "@/lib/admin/reward/reward-utils";
import { TemplateConfigForm } from "@/components/admin/reward/template-config-form";
import { TemplateStatusBadge } from "@/components/admin/reward/template-status-badge";
import { Button } from "@/components/ui/button";

type TemplateDetailDashboardProps = {
  template: data_TemplateVOSwagger;
  onRefresh: () => void;
};

export function TemplateDetailDashboard({
  template,
  onRefresh,
}: TemplateDetailDashboardProps) {
  const caps = useRewardCapabilities();
  const templateId = template.id ?? 0;
  const status = template.status ?? "UNKNOWN";
  const type = parseTemplateType(template.type);
  const formValues = parseTemplateToFormValues(template);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showEdit =
    caps.canEditTemplate && canEditTemplateStatus(status);
  const showPublish =
    caps.canPublishTemplate && canPublishTemplateStatus(status);

  async function handlePublish() {
    setError(null);
    setSubmitting(true);
    try {
      await publishTemplate(templateId);
      onRefresh();
    } catch (err) {
      setError(rewardApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-white/10 px-6 py-6 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link
              href="/admin/rewards/templates"
              className="text-sm text-zinc-500 hover:text-zinc-300"
            >
              ← Templates
            </Link>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                Template #{templateId}
              </h1>
              <TemplateStatusBadge status={status} />
            </div>
            <p className="mt-1 text-sm text-zinc-500">
              {type === "FIXED" ? "Fixed" : "Dynamic"} · {template.voucher_type ?? "—"} ·{" "}
              {template.unit ?? "—"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {showEdit ? (
              <Button variant="outline" asChild>
                <Link href={`/admin/rewards/templates/${templateId}/edit`}>
                  Edit config
                </Link>
              </Button>
            ) : null}
            {showPublish ? (
              <Button
                className="bg-white text-black hover:bg-zinc-200"
                disabled={submitting}
                onClick={() => void handlePublish()}
              >
                {submitting ? "Publishing…" : "Publish"}
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-6 px-6 py-6 lg:px-8">
        {error ? (
          <p
            className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-5">
            <h2 className="text-sm font-medium text-zinc-200">Overview</h2>
            <dl className="mt-4 grid gap-3 text-sm">
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <dt className="text-zinc-500">Type</dt>
                <dd className="text-zinc-300">
                  {type === "FIXED" ? "Fixed" : "Dynamic"}
                </dd>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <dt className="text-zinc-500">Voucher type</dt>
                <dd className="text-zinc-300">{template.voucher_type ?? "—"}</dd>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <dt className="text-zinc-500">Unit</dt>
                <dd className="text-zinc-300">{template.unit ?? "—"}</dd>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <dt className="text-zinc-500">Config</dt>
                <dd className="text-zinc-300">
                  {configSummary(type, template.config)}
                </dd>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <dt className="text-zinc-500">Created</dt>
                <dd className="text-zinc-300">{template.created_at ?? "—"}</dd>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <dt className="text-zinc-500">Updated</dt>
                <dd className="text-zinc-300">{template.updated_at ?? "—"}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-5">
            <h2 className="text-sm font-medium text-zinc-200">Config preview</h2>
            <div className="mt-4">
              <TemplateConfigForm
                values={formValues}
                onChange={() => {}}
                paymentConfigs={[]}
                configOnly
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
