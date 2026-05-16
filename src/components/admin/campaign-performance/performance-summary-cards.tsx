import type { CampaignPerformanceSummary } from "@/lib/admin/campaign-performance-row";
import { formatSummaryRewardAmount } from "@/lib/admin/campaign-performance-row";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PerformanceSummaryCardsProps = {
  summary: CampaignPerformanceSummary | null;
  loading?: boolean;
};

function SummaryCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card className="border-white/10 bg-zinc-900/40 text-zinc-100 ring-white/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tabular-nums text-white">{value}</p>
        {hint ? (
          <p className="mt-1 text-xs text-zinc-500">{hint}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function PerformanceSummaryCards({
  summary,
  loading = false,
}: PerformanceSummaryCardsProps) {
  if (loading) {
    return (
      <p className="text-sm text-zinc-500">Loading performance summary…</p>
    );
  }

  if (!summary) {
    return (
      <p className="text-sm text-zinc-500">No performance summary available.</p>
    );
  }

  const failedHint =
    summary.rewardFailedCount != null
      ? `${summary.rewardFailedCount} failed`
      : undefined;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        title="Total Participants"
        value={summary.participantCount.toLocaleString()}
      />
      <SummaryCard
        title="Total Participations"
        value={summary.participationCount.toLocaleString()}
      />
      <SummaryCard
        title="Rewards Issued"
        value={summary.rewardIssuedCount.toLocaleString()}
        hint={failedHint}
      />
      <SummaryCard
        title="Reward Amount"
        value={formatSummaryRewardAmount(summary)}
        hint={summary.currency}
      />
    </div>
  );
}
