"use client";

import { useCallback, useEffect, useState } from "react";

import { ListPagination } from "@/components/admin/campaign-performance/list-pagination";
import { ParticipationsDataTable } from "@/components/admin/campaign-performance/participations-data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchCampaignParticipations } from "@/lib/admin/campaign-performance-api";
import type { CampaignParticipationRow } from "@/lib/admin/campaign-performance-row";
import { apiErrorMessage } from "@/lib/admin/campaign-performance-utils";

const PAGE_SIZE = 20;

const REWARD_STATUS_OPTIONS = [
  { value: "all", label: "All reward statuses" },
  { value: "GRANTED", label: "Granted" },
  { value: "PENDING", label: "Pending" },
  { value: "FAILED", label: "Failed" },
  { value: "SKIPPED", label: "Skipped" },
] as const;

type CampaignParticipationsTabProps = {
  campaignId: number;
};

export function CampaignParticipationsTab({
  campaignId,
}: CampaignParticipationsTabProps) {
  const [userIdInput, setUserIdInput] = useState("");
  const [rewardStatus, setRewardStatus] = useState("all");
  const [appliedFilters, setAppliedFilters] = useState({
    userId: "",
    rewardStatus: "all",
  });

  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<CampaignParticipationRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const userIdTrim = appliedFilters.userId.trim();
    const userId =
      userIdTrim !== "" && Number.isFinite(Number(userIdTrim))
        ? Number(userIdTrim)
        : undefined;
    if (userIdTrim !== "" && userId == null) {
      setError("User ID must be a valid number.");
      setRows([]);
      setTotal(0);
      setLoading(false);
      return;
    }

    try {
      const result = await fetchCampaignParticipations(campaignId, {
        page,
        pageSize: PAGE_SIZE,
        userId,
        rewardStatus:
          appliedFilters.rewardStatus !== "all"
            ? appliedFilters.rewardStatus
            : undefined,
      });
      setRows(result.rows);
      setTotal(result.total);
    } catch (e) {
      setRows([]);
      setTotal(0);
      setError(apiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [appliedFilters, campaignId, page]);

  useEffect(() => {
    void load();
  }, [load]);

  function handleApplyFilters() {
    setPage(1);
    setAppliedFilters({
      userId: userIdInput,
      rewardStatus,
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-white/10 bg-zinc-900/30 p-4">
        <label className="grid gap-1.5 text-sm">
          <span className="text-xs text-zinc-500">User ID</span>
          <Input
            inputMode="numeric"
            placeholder="e.g. 10001"
            value={userIdInput}
            onChange={(e) => setUserIdInput(e.target.value)}
            className="h-9 w-36 border-white/10 bg-zinc-900/80"
          />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="text-xs text-zinc-500">Reward status</span>
          <Select value={rewardStatus} onValueChange={setRewardStatus}>
            <SelectTrigger className="h-9 w-44 border-white/10 bg-zinc-900/80">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REWARD_STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
        <Button
          type="button"
          className="border-0 bg-white text-black hover:bg-zinc-200"
          onClick={handleApplyFilters}
        >
          Apply filters
        </Button>
      </div>

      {error ? (
        <p
          className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-zinc-500">Loading participations…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-zinc-500">No participation records found.</p>
      ) : (
        <ParticipationsDataTable rows={rows} />
      )}

      <ListPagination
        page={page}
        pageSize={PAGE_SIZE}
        total={total}
        onPageChange={setPage}
        disabled={loading}
      />
    </div>
  );
}
