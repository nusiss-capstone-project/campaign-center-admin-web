import type { data_AdminParticipantVO } from "@/lib/api/models/data_AdminParticipant";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatEpoch } from "@/lib/admin/campaign-performance-utils";

type ParticipantsUsersTableProps = {
  rows: data_AdminParticipantVO[];
};

export function ParticipantsUsersTable({
  rows,
}: Readonly<ParticipantsUsersTableProps>) {
  return (
    <div className="overflow-hidden rounded-xl">
      <Table className="border-0">
        <TableHeader>
          <TableRow className="border-0 hover:bg-transparent">
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              User ID
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Risk Level
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Joined At
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.user_id ?? `${row.joined_at}-${row.risk_level}`}
              className="border-0 hover:bg-white/[0.03]"
            >
              <TableCell className="border-0 px-4 py-4 font-mono text-xs text-zinc-300">
                {row.user_id ?? "—"}
              </TableCell>
              <TableCell className="border-0 px-4 py-4 text-sm text-white">
                {row.risk_level || "—"}
              </TableCell>
              <TableCell className="border-0 px-4 py-4 text-sm text-zinc-400">
                {formatEpoch(row.joined_at)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
