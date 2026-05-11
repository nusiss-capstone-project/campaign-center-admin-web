import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function typeKey(raw: string): "email" | "push" | "sms" | "inapp" | "other" {
  const s = raw.toLowerCase();
  if (s.includes("email")) return "email";
  if (s.includes("sms")) return "sms";
  if (s.includes("in-app") || s.includes("inapp") || s.includes("in_app"))
    return "inapp";
  if (
    s.includes("push") ||
    s.includes("topup") ||
    s.includes("top-up") ||
    s.includes("reward")
  )
    return "push";
  return "other";
}

const STYLES: Record<
  ReturnType<typeof typeKey>,
  { label: string; className: string }
> = {
  email: {
    label: "Email",
    className:
      "border-emerald-500/25 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/15",
  },
  push: {
    label: "Push",
    className:
      "border-amber-500/25 bg-amber-500/10 text-amber-200 hover:bg-amber-500/15",
  },
  sms: {
    label: "SMS",
    className:
      "border-violet-500/25 bg-violet-500/10 text-violet-200 hover:bg-violet-500/15",
  },
  inapp: {
    label: "In-App",
    className:
      "border-cyan-500/25 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/15",
  },
  other: {
    label: "",
    className:
      "border-zinc-600/50 bg-zinc-800/80 text-zinc-300 hover:bg-zinc-800",
  },
};

function formatTypeLabel(raw: string): string {
  if (!raw || raw === "—") return "—";
  return raw
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export function CampaignTypeBadge({ typeRaw }: { typeRaw: string }) {
  const key = typeKey(typeRaw);
  const spec = STYLES[key];
  const label = key === "other" ? formatTypeLabel(typeRaw) : spec.label;

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-md border px-2 py-0.5 text-[11px] font-medium capitalize",
        spec.className,
      )}
    >
      {label}
    </Badge>
  );
}
