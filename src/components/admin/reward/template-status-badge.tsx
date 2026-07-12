"use client";

import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-zinc-500/15 text-zinc-300 ring-zinc-500/25",
  PUBLISHED: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/25",
};

const DOT_STYLES: Record<string, string> = {
  DRAFT: "bg-zinc-400",
  PUBLISHED: "bg-emerald-400",
};

export function TemplateStatusBadge({ status }: { status: string }) {
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
