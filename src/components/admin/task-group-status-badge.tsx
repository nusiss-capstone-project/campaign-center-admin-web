import type { TaskStatus } from "@/lib/admin/task-types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const SPECS: Record<
  TaskStatus,
  { dot: string; chip: string; text: string }
> = {
  DRAFT: {
    dot: "bg-amber-400",
    chip: "border-amber-500/25 bg-amber-500/10",
    text: "text-amber-200",
  },
  PUBLISHED: {
    dot: "bg-emerald-400",
    chip: "border-emerald-500/20 bg-emerald-500/10",
    text: "text-emerald-300",
  },
};

export function TaskGroupStatusBadge({
  status,
  label,
}: {
  status: TaskStatus;
  label: string;
}) {
  const spec = SPECS[status];
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide",
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
