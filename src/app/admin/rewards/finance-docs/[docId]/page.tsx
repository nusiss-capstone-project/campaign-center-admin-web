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

  const loadAll = useCallback(
    async (cancelled: () => boolean) => {
      setLoadingDoc(true);
      setLoadingPayments(true);
      setLoadingIssueRequests(true);
      setDocError(null);
      setPaymentsError(null);
      setIssueRequestsError(null);

      try {
        const detail = await fetchFinanceDocDetail(docId);
        if (cancelled()) return;
        setDoc(detail);
      } catch (err) {
        if (cancelled()) return;
        setDocError(rewardApiErrorMessage(err));
        setDoc(null);
      } finally {
        if (!cancelled()) setLoadingDoc(false);
      }

      try {
        const paymentRows = await fetchFinancePayments(docId);
        if (cancelled()) return;
        setPayments(paymentRows);
      } catch (err) {
        if (cancelled()) return;
        setPaymentsError(rewardApiErrorMessage(err));
        setPayments([]);
      } finally {
        if (!cancelled()) setLoadingPayments(false);
      }

      try {
        const issueResult = await fetchIssueRequests({
          docId,
          page: 1,
          size: 20,
        });
        if (cancelled()) return;
        setIssueRequests(issueResult.rows);
        setIssueRequestsTotal(issueResult.total);
      } catch (err) {
        if (cancelled()) return;
        setIssueRequestsError(rewardApiErrorMessage(err));
        setIssueRequests([]);
        setIssueRequestsTotal(0);
      } finally {
        if (!cancelled()) setLoadingIssueRequests(false);
      }

      try {
        const configs = await fetchPaymentConfigs();
        if (cancelled()) return;
        setPaymentConfigs(configs);
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

  if (loadingDoc) {
    return (
      <div className="p-6">
        <p className="text-sm text-zinc-500">Loading finance doc…</p>
      </div>
    );
  }

  if (docError || !doc) {
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
          {docError ?? "Finance doc not found"}
        </p>
        <Button
          variant="outline"
          className="w-fit"
          onClick={() => setRefreshKey((k) => k + 1)}
        >
          Retry
        </Button>
      </div>
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
      onRefresh={() => setRefreshKey((k) => k + 1)}
    />
  );
}
