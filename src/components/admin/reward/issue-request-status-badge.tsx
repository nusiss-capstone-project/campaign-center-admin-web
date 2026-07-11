"use client";

import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-zinc-500/15 text-zinc-300 ring-zinc-500/25",
  REJECTED: "bg-red-500/15 text-red-300 ring-red-500/25",
  TO_APPROVE: "bg-amber-500/15 text-amber-300 ring-amber-500/25",
  APPROVED: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/25",
  ISSUING: "bg-blue-500/15 text-blue-300 ring-blue-500/25",
  ONGOING: "bg-blue-500/15 text-blue-300 ring-blue-500/25",
  ISSUED: "bg-violet-500/15 text-violet-300 ring-violet-500/25",
  ENDED: "bg-zinc-500/15 text-zinc-400 ring-zinc-500/25",
};

const DOT_STYLES: Record<string, string> = {
  DRAFT: "bg-zinc-400",
  REJECTED: "bg-red-400",
  TO_APPROVE: "bg-amber-400",
  APPROVED: "bg-emerald-400",
  ISSUING: "bg-blue-400",
  ONGOING: "bg-blue-400",
  ISSUED: "bg-violet-400",
  ENDED: "bg-zinc-500",
};

export function IssueRequestStatusBadge({ status }: { status: string }) {
  const key = status.toUpperCase();
  const style = STATUS_STYLES[key] ?? "bg-zinc-500/10 text-zinc-400 ring-zinc-500/20";
  const dot = DOT_STYLES[key] ?? "bg-zinc-500";
  const label = status || "Unknown";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        style,
      )}
    >
      <span className={cn("size-1.5 rounded-full", dot)} aria-hidden />
      {label}
    </span>
  );
}
