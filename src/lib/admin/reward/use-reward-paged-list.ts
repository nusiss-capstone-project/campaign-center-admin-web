"use client";

import { useCallback, useEffect, useState } from "react";

import { rewardApiErrorMessage } from "@/lib/admin/reward/reward-utils";

type PagedResult<T> = {
  rows: T[];
  total: number;
};

export function useRewardPagedList<T>(
  fetchPage: () => Promise<PagedResult<T>>,
) {
  const [rows, setRows] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const load = useCallback(
    async (cancelled: () => boolean) => {
      setLoading(true);
      setErrorMessage(null);
      try {
        const result = await fetchPage();
        if (cancelled()) return;
        setRows(result.rows);
        setTotal(result.total);
      } catch (err) {
        if (cancelled()) return;
        setErrorMessage(rewardApiErrorMessage(err));
        setRows([]);
        setTotal(0);
      } finally {
        if (!cancelled()) setLoading(false);
      }
    },
    [fetchPage],
  );

  useEffect(() => {
    let cancelled = false;
    void load(() => cancelled);
    return () => {
      cancelled = true;
    };
  }, [load, refreshKey]);

  return {
    rows,
    total,
    loading,
    errorMessage,
    retry: () => setRefreshKey((k) => k + 1),
  };
}
