import type { CampaignParticipationRow } from "@/lib/admin/campaign-performance-row";
import { RewardStatusBadge } from "@/components/admin/campaign-performance/reward-status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatAdminMoney,
  formatJoinAt,
} from "@/lib/admin/campaign-performance-utils";

type ParticipationsDataTableProps = {
  rows: CampaignParticipationRow[];
};

export function ParticipationsDataTable({
  rows,
}: ParticipationsDataTableProps) {
  return (
    <div className="overflow-hidden rounded-xl">
      <Table className="border-0">
        <TableHeader>
          <TableRow className="border-0 hover:bg-transparent">
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Participation ID
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              User ID
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Reward Amount
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Reward Status
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Joined At
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Failure Reason
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.participationId}
              className="border-0 hover:bg-white/[0.03]"
            >
              <TableCell className="border-0 px-4 py-4 font-mono text-xs text-zinc-300">
                {row.participationId}
              </TableCell>
              <TableCell className="border-0 px-4 py-4 text-sm text-white">
                {row.userId}
              </TableCell>
              <TableCell className="border-0 px-4 py-4 text-sm tabular-nums text-zinc-300">
                {row.rewardAmount != null
                  ? formatAdminMoney(row.rewardAmount, row.currency)
                  : "—"}
              </TableCell>
              <TableCell className="border-0 px-4 py-4">
                <RewardStatusBadge status={row.rewardStatus} />
              </TableCell>
              <TableCell className="border-0 px-4 py-4 text-sm text-zinc-400">
                {formatJoinAt(row.joinAt)}
              </TableCell>
              <TableCell className="max-w-[12rem] border-0 px-4 py-4 text-sm text-zinc-500">
                {row.failureReason || "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
