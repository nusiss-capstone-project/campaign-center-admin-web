"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { data_PaymentConfigVO } from "@/lib/reward-api/models/data_PaymentConfigVO";
import {
  createTemplate,
  fetchPaymentConfigs,
} from "@/lib/admin/reward/reward-api";
import {
  emptyTemplateFormValues,
  toCreateTemplatePayload,
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

export default function AdminCreateTemplatePage() {
  const router = useRouter();
  const [values, setValues] = useState<TemplateFormValues>(
    emptyTemplateFormValues(),
  );
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
        const configs = await fetchPaymentConfigs();
        if (cancelled) return;
        setPaymentConfigs(configs);
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
      const payload = toCreateTemplatePayload(values);
      const templateId = await createTemplate(payload);
      router.push(`/admin/rewards/templates/${templateId}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : rewardApiErrorMessage(err),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <Link
        href="/admin/rewards/templates"
        className="text-sm text-zinc-500 hover:text-zinc-300"
      >
        ← Templates
      </Link>
      <Card className="border-white/10 bg-zinc-900/40">
        <CardHeader>
          <CardTitle>Create template</CardTitle>
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
              <TemplateConfigForm
                values={values}
                onChange={setValues}
                paymentConfigs={paymentConfigs}
              />
            )}
          </CardContent>
          <CardFooter className="flex flex-wrap justify-between gap-3 border-t border-white/10 bg-transparent">
            <Button variant="outline" type="button" asChild>
              <Link href="/admin/rewards/templates">Cancel</Link>
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
