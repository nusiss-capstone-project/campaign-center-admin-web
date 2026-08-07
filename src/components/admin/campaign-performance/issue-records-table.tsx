import type { data_IssueRecordVO } from "@/lib/reward-api/models/data_IssueRecordVO";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type IssueRecordsTableProps = {
  rows: data_IssueRecordVO[];
};

export function IssueRecordsTable({
  rows,
}: Readonly<IssueRecordsTableProps>) {
  return (
    <div className="overflow-hidden rounded-xl">
      <Table className="border-0">
        <TableHeader>
          <TableRow className="border-0 hover:bg-transparent">
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Voucher ID
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Voucher Type
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Unit
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Amount
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={row.voucher_id ?? `issue-${index}`}
              className="border-0 hover:bg-white/[0.03]"
            >
              <TableCell className="border-0 px-4 py-4 font-mono text-xs text-zinc-300">
                {row.voucher_id || "—"}
              </TableCell>
              <TableCell className="border-0 px-4 py-4 text-sm text-white">
                {row.voucher_type || "—"}
              </TableCell>
              <TableCell className="border-0 px-4 py-4 text-sm text-zinc-300">
                {row.unit || "—"}
              </TableCell>
              <TableCell className="border-0 px-4 py-4 text-sm tabular-nums text-zinc-300">
                {row.reward_amount || "—"}
              </TableCell>
              <TableCell className="border-0 px-4 py-4 text-sm text-zinc-300">
                {row.status || "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
