import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const SPECS: Record<string, { chip: string; text: string; dot: string }> = {
  GRANTED: {
    chip: "border-emerald-500/20 bg-emerald-500/10",
    text: "text-emerald-300",
    dot: "bg-emerald-400",
  },
  PENDING: {
    chip: "border-amber-500/20 bg-amber-500/10",
    text: "text-amber-300",
    dot: "bg-amber-400",
  },
  FAILED: {
    chip: "border-red-500/20 bg-red-500/10",
    text: "text-red-300",
    dot: "bg-red-400",
  },
  SKIPPED: {
    chip: "border-zinc-600/40 bg-zinc-800/60",
    text: "text-zinc-400",
    dot: "bg-zinc-500",
  },
};

const DEFAULT_SPEC = {
  chip: "border-zinc-600/50 bg-zinc-800/80",
  text: "text-zinc-300",
  dot: "bg-zinc-400",
};

export function RewardStatusBadge({ status }: { status: string }) {
  const key = status.trim().toUpperCase();
  const spec = SPECS[key] ?? DEFAULT_SPEC;
  const label = status.trim() || "—";

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        spec.chip,
        spec.text,
      )}
    >
      <span
        className={cn("size-1.5 shrink-0 rounded-full", spec.dot)}
        aria-hidden
      />
      {label}
    </Badge>
  );
}
