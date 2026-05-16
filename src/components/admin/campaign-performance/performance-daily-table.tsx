import type { CampaignPerformanceDailyRow } from "@/lib/admin/campaign-performance-row";
import { formatAdminMoney } from "@/lib/admin/campaign-performance-utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type PerformanceDailyTableProps = {
  rows: CampaignPerformanceDailyRow[];
  loading?: boolean;
};

export function PerformanceDailyTable({
  rows,
  loading = false,
}: PerformanceDailyTableProps) {
  if (loading) {
    return <p className="text-sm text-zinc-500">Loading daily performance…</p>;
  }

  if (rows.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        No daily performance for the selected date range.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl">
      <Table className="border-0">
        <TableHeader>
          <TableRow className="border-0 hover:bg-transparent">
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Date
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Participant Count
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Participation Count
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Reward Issued Count
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Reward Issued Amount
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Currency
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.date}
              className="border-0 hover:bg-white/[0.03]"
            >
              <TableCell className="border-0 px-4 py-4 text-sm text-white">
                {row.date}
              </TableCell>
              <TableCell className="border-0 px-4 py-4 text-sm tabular-nums text-zinc-300">
                {row.participantCount.toLocaleString()}
              </TableCell>
              <TableCell className="border-0 px-4 py-4 text-sm tabular-nums text-zinc-300">
                {row.participationCount.toLocaleString()}
              </TableCell>
              <TableCell className="border-0 px-4 py-4 text-sm tabular-nums text-zinc-300">
                {row.rewardIssuedCount.toLocaleString()}
              </TableCell>
              <TableCell className="border-0 px-4 py-4 text-sm tabular-nums text-zinc-300">
                {formatAdminMoney(row.rewardIssuedAmount, row.currency)}
              </TableCell>
              <TableCell className="border-0 px-4 py-4 text-sm text-zinc-400">
                {row.currency}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
