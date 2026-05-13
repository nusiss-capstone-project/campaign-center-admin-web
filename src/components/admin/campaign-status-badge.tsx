import type { CampaignStatusCategory } from "@/lib/admin/campaign-row";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const SPECS: Record<
  CampaignStatusCategory,
  { dot: string; chip: string; text: string }
> = {
  draft: {
    dot: "bg-zinc-400",
    chip: "border-zinc-600/50 bg-zinc-800/80",
    text: "text-zinc-300",
  },
  published: {
    dot: "bg-emerald-400",
    chip: "border-emerald-500/20 bg-emerald-500/10",
    text: "text-emerald-300",
  },
  archive: {
    dot: "bg-zinc-500",
    chip: "border-zinc-600/40 bg-zinc-800/60",
    text: "text-zinc-400",
  },
};

export function CampaignStatusBadge({
  category,
  label,
}: {
  category: CampaignStatusCategory;
  label: string;
}) {
  const spec = SPECS[category];
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
