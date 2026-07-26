"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

type RewardAsyncListBodyProps = {
  loading: boolean;
  errorMessage: string | null;
  isEmpty: boolean;
  loadingLabel: string;
  emptyLabel: string;
  onRetry?: () => void;
  children: ReactNode;
};

export function RewardAsyncListBody({
  loading,
  errorMessage,
  isEmpty,
  loadingLabel,
  emptyLabel,
  onRetry,
  children,
}: Readonly<RewardAsyncListBodyProps>) {
  if (loading) {
    return <p className="text-sm text-zinc-500">{loadingLabel}</p>;
  }

  if (errorMessage) {
    return (
      <div className="flex flex-col gap-3">
        <p
          className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          role="alert"
        >
          {errorMessage}
        </p>
        {onRetry ? (
          <Button variant="outline" onClick={onRetry} className="w-fit">
            Retry
          </Button>
        ) : null}
      </div>
    );
  }

  if (isEmpty) {
    return <p className="text-sm text-zinc-500">{emptyLabel}</p>;
  }

  return children;
}
