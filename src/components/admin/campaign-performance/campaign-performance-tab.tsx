"use client";

import { useCallback, useEffect, useState } from "react";

import { PerformanceDailyTable } from "@/components/admin/campaign-performance/performance-daily-table";
import { PerformanceSummaryCards } from "@/components/admin/campaign-performance/performance-summary-cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  fetchCampaignPerformanceDaily,
  fetchCampaignPerformanceSummary,
} from "@/lib/admin/campaign-performance-api";
import type {
  CampaignPerformanceDailyRow,
  CampaignPerformanceSummary,
} from "@/lib/admin/campaign-performance-row";
import {
  apiErrorMessage,
  defaultPerformanceDateRange,
} from "@/lib/admin/campaign-performance-utils";

type CampaignPerformanceTabProps = {
  campaignId: number;
};

export function CampaignPerformanceTab({
  campaignId,
}: CampaignPerformanceTabProps) {
  const defaults = defaultPerformanceDateRange();
  const [startDate, setStartDate] = useState(defaults.startDate);
  const [endDate, setEndDate] = useState(defaults.endDate);
  const [appliedRange, setAppliedRange] = useState(defaults);

  const [summary, setSummary] = useState<CampaignPerformanceSummary | null>(
    null,
  );
  const [dailyRows, setDailyRows] = useState<CampaignPerformanceDailyRow[]>(
    [],
  );
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [dailyLoading, setDailyLoading] = useState(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [dailyError, setDailyError] = useState<string | null>(null);

  const loadSummary = useCallback(async () => {
    setSummaryLoading(true);
    setSummaryError(null);
    try {
      const data = await fetchCampaignPerformanceSummary(campaignId);
      setSummary(data);
    } catch (e) {
      setSummary(null);
      setSummaryError(apiErrorMessage(e));
    } finally {
      setSummaryLoading(false);
    }
  }, [campaignId]);

  const loadDaily = useCallback(
    async (range: { startDate: string; endDate: string }) => {
      if (!range.startDate || !range.endDate) {
        setDailyError("Start and end dates are required.");
        setDailyRows([]);
        return;
      }
      if (range.startDate > range.endDate) {
        setDailyError("Start date must be on or before end date.");
        setDailyRows([]);
        return;
      }
      setDailyLoading(true);
      setDailyError(null);
      try {
        const rows = await fetchCampaignPerformanceDaily(
          campaignId,
          range.startDate,
          range.endDate,
        );
        setDailyRows(rows);
      } catch (e) {
        setDailyRows([]);
        setDailyError(apiErrorMessage(e));
      } finally {
        setDailyLoading(false);
      }
    },
    [campaignId],
  );

  useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    void loadDaily(appliedRange);
  }, [appliedRange, loadDaily]);

  function handleApplyRange() {
    setAppliedRange({ startDate, endDate });
  }

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="mb-4 text-sm font-medium text-zinc-300">Summary</h2>
        {summaryError ? (
          <p
            className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
            role="alert"
          >
            {summaryError}
          </p>
        ) : null}
        <PerformanceSummaryCards summary={summary} loading={summaryLoading} />
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-sm font-medium text-zinc-300">Daily performance</h2>
          <div className="flex flex-wrap items-end gap-3">
            <label className="grid gap-1.5 text-sm">
              <span className="text-xs text-zinc-500">Start date</span>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-9 w-[10.5rem] border-white/10 bg-zinc-900/80"
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="text-xs text-zinc-500">End date</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-9 w-[10.5rem] border-white/10 bg-zinc-900/80"
              />
            </label>
            <Button
              type="button"
              className="border-0 bg-white text-black hover:bg-zinc-200"
              onClick={handleApplyRange}
            >
              Apply
            </Button>
          </div>
        </div>
        {dailyError ? (
          <p
            className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
            role="alert"
          >
            {dailyError}
          </p>
        ) : null}
        <PerformanceDailyTable rows={dailyRows} loading={dailyLoading} />
      </section>
    </div>
  );
}
