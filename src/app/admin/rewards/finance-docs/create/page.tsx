"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { data_PaymentConfigVO } from "@/lib/reward-api/models/data_PaymentConfigVO";
import {
  createFinanceDoc,
  fetchPaymentConfigs,
  fetchProjects,
} from "@/lib/admin/reward/reward-api";
import {
  emptyFinanceDocFormValues,
  toCreateFinanceDocPayload,
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

export default function AdminCreateFinanceDocPage() {
  const router = useRouter();
  const [values, setValues] = useState<FinanceDocFormValues>(
    emptyFinanceDocFormValues(),
  );
  const [projects, setProjects] = useState<ProjectDisplayRow[]>([]);
  const [paymentConfigs, setPaymentConfigs] = useState<data_PaymentConfigVO[]>(
    [],
  );
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [metaError, setMetaError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadMeta() {
      setLoadingMeta(true);
      setMetaError(null);
      try {
        const [projectResult, configs] = await Promise.all([
          fetchProjects({ page: 1, size: 100 }),
          fetchPaymentConfigs(),
        ]);
        if (cancelled) return;
        setProjects(projectResult.rows);
        setPaymentConfigs(configs);
        if (projectResult.rows.length > 0) {
          setValues((prev) => ({
            ...prev,
            projectId: String(projectResult.rows[0].id),
          }));
        }
      } catch (err) {
        if (cancelled) return;
        setMetaError(rewardApiErrorMessage(err));
      } finally {
        if (!cancelled) setLoadingMeta(false);
      }
    }
    void loadMeta();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const payload = toCreateFinanceDocPayload(values);
      const docId = await createFinanceDoc(payload);
      router.push(`/admin/rewards/finance-docs/${docId}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : rewardApiErrorMessage(err),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
      <Link
        href="/admin/rewards/finance-docs"
        className="text-sm text-zinc-500 hover:text-zinc-300"
      >
        ← Finance Docs
      </Link>
      <Card className="border-white/10 bg-zinc-900/40">
        <CardHeader>
          <CardTitle>Create finance doc</CardTitle>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="flex flex-col gap-4">
            {metaError ? (
              <p className="text-sm text-destructive" role="alert">
                {metaError}
              </p>
            ) : null}
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            {loadingMeta ? (
              <p className="text-sm text-zinc-500">Loading form options…</p>
            ) : (
              <FinanceDocForm
                values={values}
                onChange={setValues}
                projects={projects}
                paymentConfigs={paymentConfigs}
              />
            )}
          </CardContent>
          <CardFooter className="flex flex-wrap justify-between gap-3 border-t border-white/10 bg-transparent">
            <Button variant="outline" type="button" asChild>
              <Link href="/admin/rewards/finance-docs">Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={submitting || loadingMeta || Boolean(metaError)}
              className="bg-white text-black hover:bg-zinc-200"
            >
              {submitting ? "Creating…" : "Create"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
