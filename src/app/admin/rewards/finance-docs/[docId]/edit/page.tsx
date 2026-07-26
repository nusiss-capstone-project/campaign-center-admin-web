"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import type { data_PaymentConfigVO } from "@/lib/reward-api/models/data_PaymentConfigVO";
import {
  fetchFinanceDocDetail,
  fetchPaymentConfigs,
  fetchProjects,
  updateFinanceDoc,
} from "@/lib/admin/reward/reward-api";
import {
  canEditFinanceDocStatus,
  useRewardCapabilities,
} from "@/lib/admin/reward/reward-capabilities";
import {
  parseFinanceDocToFormValues,
  toUpdateFinanceDocPayload,
  type FinanceDocFormValues,
} from "@/lib/admin/reward/reward-form-values";
import type { ProjectDisplayRow } from "@/lib/admin/reward/reward-row";
import { rewardApiErrorMessage } from "@/lib/admin/reward/reward-utils";
import { FinanceDocForm } from "@/components/admin/reward/finance-doc-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminEditFinanceDocPage() {
  const params = useParams<{ docId: string }>();
  const router = useRouter();
  const docId = params.docId;
  const caps = useRewardCapabilities();

  const [values, setValues] = useState<FinanceDocFormValues | null>(null);
  const [status, setStatus] = useState("");
  const [projects, setProjects] = useState<ProjectDisplayRow[]>([]);
  const [paymentConfigs, setPaymentConfigs] = useState<data_PaymentConfigVO[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (cancelled: () => boolean) => {
    setLoading(true);
    setLoadError(null);
    try {
      const [doc, projectResult, configs] = await Promise.all([
        fetchFinanceDocDetail(docId),
        fetchProjects({ page: 1, size: 100 }),
        fetchPaymentConfigs(),
      ]);
      if (cancelled()) return;
      setValues(parseFinanceDocToFormValues(doc));
      setStatus(doc.status ?? "");
      setProjects(projectResult.rows);
      setPaymentConfigs(configs);
    } catch (err) {
      if (cancelled()) return;
      setLoadError(rewardApiErrorMessage(err));
    } finally {
      if (!cancelled()) setLoading(false);
    }
  }, [docId]);

  useEffect(() => {
    let cancelled = false;
    void load(() => cancelled);
    return () => {
      cancelled = true;
    };
  }, [load]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values) return;
    setError(null);
    setSubmitting(true);
    try {
      const payload = toUpdateFinanceDocPayload(values);
      await updateFinanceDoc(docId, payload);
      router.push(`/admin/rewards/finance-docs/${docId}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : rewardApiErrorMessage(err),
      );
    } finally {
      setSubmitting(false);
    }
  }

  const editable =
    caps.canEditFinanceDoc && canEditFinanceDocStatus(status);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-zinc-500">Loading finance doc…</p>
      </div>
    );
  }

  if (loadError || !values) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Link
          href={`/admin/rewards/finance-docs/${docId}`}
          className="text-sm text-zinc-500 hover:text-zinc-300"
        >
          ← Finance doc detail
        </Link>
        <p
          className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          role="alert"
        >
          {loadError ?? "Unable to load finance doc"}
        </p>
      </div>
    );
  }

  if (!editable) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Link
          href={`/admin/rewards/finance-docs/${docId}`}
          className="text-sm text-zinc-500 hover:text-zinc-300"
        >
          ← Finance doc detail
        </Link>
        <p className="text-sm text-zinc-400">
          This finance doc cannot be edited in status {status || "UNKNOWN"}.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
      <Link
        href={`/admin/rewards/finance-docs/${docId}`}
        className="text-sm text-zinc-500 hover:text-zinc-300"
      >
        ← Finance doc detail
      </Link>
      <Card className="border-white/10 bg-zinc-900/40">
        <CardHeader>
          <CardTitle>Edit finance doc</CardTitle>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="flex flex-col gap-4">
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            <FinanceDocForm
              values={values}
              onChange={setValues}
              projects={projects}
              paymentConfigs={paymentConfigs}
              showProjectSelect={false}
            />
          </CardContent>
          <CardFooter className="flex flex-wrap justify-between gap-3 border-t border-white/10 bg-transparent">
            <Button variant="outline" type="button" asChild>
              <Link href={`/admin/rewards/finance-docs/${docId}`}>Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-white text-black hover:bg-zinc-200"
            >
              {submitting ? "Saving…" : "Save changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
