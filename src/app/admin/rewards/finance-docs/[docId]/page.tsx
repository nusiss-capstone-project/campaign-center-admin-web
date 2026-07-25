"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import type { data_FinanceDocVO } from "@/lib/reward-api/models/data_FinanceDocVO";
import type { data_PaymentConfigVO } from "@/lib/reward-api/models/data_PaymentConfigVO";
import {
  fetchFinanceDocDetail,
  fetchFinancePayments,
  fetchIssueRequests,
  fetchPaymentConfigs,
} from "@/lib/admin/reward/reward-api";
import type {
  FinancePaymentDisplayRow,
  IssueRequestDisplayRow,
} from "@/lib/admin/reward/reward-row";
import { rewardApiErrorMessage } from "@/lib/admin/reward/reward-utils";
import { FinanceDocDetailDashboard } from "@/components/admin/reward/finance-doc-detail-dashboard";
import { Button } from "@/components/ui/button";

async function loadWithCancel<T>(
  cancelled: () => boolean,
  run: () => Promise<T>,
  onSuccess: (value: T) => void,
  onError: (message: string) => void,
  onDone: () => void,
): Promise<void> {
  try {
    const value = await run();
    if (cancelled()) return;
    onSuccess(value);
  } catch (err) {
    if (cancelled()) return;
    onError(rewardApiErrorMessage(err));
  } finally {
    if (!cancelled()) onDone();
  }
}

function FinanceDocLoadingState() {
  return (
    <div className="p-6">
      <p className="text-sm text-zinc-500">Loading finance doc…</p>
    </div>
  );
}

function FinanceDocErrorState({
  message,
  onRetry,
}: Readonly<{ message: string; onRetry: () => void }>) {
  return (
    <div className="flex flex-col gap-4 p-6">
      <Link
        href="/admin/rewards/finance-docs"
        className="text-sm text-zinc-500 hover:text-zinc-300"
      >
        ← Finance Docs
      </Link>
      <p
        className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        role="alert"
      >
        {message}
      </p>
      <Button variant="outline" className="w-fit" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}

export default function AdminFinanceDocDetailPage() {
  const params = useParams<{ docId: string }>();
  const docId = params.docId;

  const [doc, setDoc] = useState<data_FinanceDocVO | null>(null);
  const [payments, setPayments] = useState<FinancePaymentDisplayRow[]>([]);
  const [issueRequests, setIssueRequests] = useState<IssueRequestDisplayRow[]>(
    [],
  );
  const [issueRequestsTotal, setIssueRequestsTotal] = useState(0);
  const [paymentConfigs, setPaymentConfigs] = useState<data_PaymentConfigVO[]>(
    [],
  );

  const [loadingDoc, setLoadingDoc] = useState(true);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [loadingIssueRequests, setLoadingIssueRequests] = useState(true);
  const [docError, setDocError] = useState<string | null>(null);
  const [paymentsError, setPaymentsError] = useState<string | null>(null);
  const [issueRequestsError, setIssueRequestsError] = useState<string | null>(
    null,
  );
  const [refreshKey, setRefreshKey] = useState(0);

  const retry = () => setRefreshKey((k) => k + 1);

  const loadAll = useCallback(
    async (cancelled: () => boolean) => {
      setLoadingDoc(true);
      setLoadingPayments(true);
      setLoadingIssueRequests(true);
      setDocError(null);
      setPaymentsError(null);
      setIssueRequestsError(null);

      await loadWithCancel(
        cancelled,
        () => fetchFinanceDocDetail(docId),
        setDoc,
        (message) => {
          setDocError(message);
          setDoc(null);
        },
        () => setLoadingDoc(false),
      );

      await loadWithCancel(
        cancelled,
        () => fetchFinancePayments(docId),
        setPayments,
        (message) => {
          setPaymentsError(message);
          setPayments([]);
        },
        () => setLoadingPayments(false),
      );

      await loadWithCancel(
        cancelled,
        () => fetchIssueRequests({ docId, page: 1, size: 20 }),
        (result) => {
          setIssueRequests(result.rows);
          setIssueRequestsTotal(result.total);
        },
        (message) => {
          setIssueRequestsError(message);
          setIssueRequests([]);
          setIssueRequestsTotal(0);
        },
        () => setLoadingIssueRequests(false),
      );

      try {
        const configs = await fetchPaymentConfigs();
        if (!cancelled()) setPaymentConfigs(configs);
      } catch {
        // Non-blocking for detail view
      }
    },
    [docId],
  );

  useEffect(() => {
    let cancelled = false;
    void loadAll(() => cancelled);
    return () => {
      cancelled = true;
    };
  }, [loadAll, refreshKey]);

  if (loadingDoc) return <FinanceDocLoadingState />;
  if (docError || !doc) {
    return (
      <FinanceDocErrorState
        message={docError ?? "Finance doc not found"}
        onRetry={retry}
      />
    );
  }

  return (
    <FinanceDocDetailDashboard
      doc={doc}
      payments={payments}
      issueRequests={issueRequests}
      issueRequestsTotal={issueRequestsTotal}
      paymentConfigs={paymentConfigs}
      loadingPayments={loadingPayments}
      loadingIssueRequests={loadingIssueRequests}
      errorPayments={paymentsError}
      errorIssueRequests={issueRequestsError}
      onRefresh={retry}
    />
  );
}
