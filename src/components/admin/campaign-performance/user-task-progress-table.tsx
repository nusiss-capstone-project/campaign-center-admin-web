import type { UserTaskProgressVO } from "@/lib/admin/task-types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatEpoch } from "@/lib/admin/campaign-performance-utils";

type UserTaskProgressTableProps = {
  rows: UserTaskProgressVO[];
};

export function UserTaskProgressTable({
  rows,
}: Readonly<UserTaskProgressTableProps>) {
  return (
    <div className="overflow-hidden rounded-xl">
      <Table className="border-0">
        <TableHeader>
          <TableRow className="border-0 hover:bg-transparent">
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Task ID
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Name
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Status
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Created At
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Updated At
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id ?? `${row.name}-${row.created_at}`}
              className="border-0 hover:bg-white/[0.03]"
            >
              <TableCell className="border-0 px-4 py-4 font-mono text-xs text-zinc-300">
                {row.id ?? "—"}
              </TableCell>
              <TableCell className="border-0 px-4 py-4 text-sm text-white">
                {row.name || "—"}
              </TableCell>
              <TableCell className="border-0 px-4 py-4 text-sm text-zinc-300">
                {row.status || "—"}
              </TableCell>
              <TableCell className="border-0 px-4 py-4 text-sm text-zinc-400">
                {formatEpoch(row.created_at)}
              </TableCell>
              <TableCell className="border-0 px-4 py-4 text-sm text-zinc-400">
                {formatEpoch(row.updated_at)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
