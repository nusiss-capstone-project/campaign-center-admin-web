"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useAdminCapabilities } from "@/components/admin/admin-access-provider";
import { ListPagination } from "@/components/admin/campaign-performance/list-pagination";
import { UserGroupsDataTable } from "@/components/admin/user-groups-data-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  listUserGroups,
  userGroupApiErrorMessage,
} from "@/lib/admin/user-group-fetch";
import { USER_GROUP_STATUSES } from "@/lib/admin/user-group-fields";
import {
  normalizeUserGroupRows,
  type UserGroupDisplayRow,
} from "@/lib/admin/user-group-row";

const PAGE_SIZE = 10;

export default function AdminUserGroupsPage() {
  const caps = useAdminCapabilities();
  const [rows, setRows] = useState<UserGroupDisplayRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await listUserGroups({
          page,
          pageSize: PAGE_SIZE,
          status: statusFilter === "all" ? undefined : statusFilter,
        });
        if (cancelled) return;
        setRows(normalizeUserGroupRows(data.items ?? []));
        setTotal(typeof data.total === "number" ? data.total : 0);
      } catch (e) {
        if (cancelled) return;
        setError(userGroupApiErrorMessage(e));
        setRows([]);
        setTotal(0);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [page, statusFilter]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">User Groups</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Define audience rules with field conditions.
          </p>
        </div>
        {caps.canCreateUserGroup ? (
          <Button asChild className="border-0 bg-white text-black hover:bg-zinc-200">
            <Link href="/admin/user-groups/create">Create</Link>
          </Button>
        ) : null}
      </div>

      <Card className="border-white/10 bg-zinc-900/40 text-zinc-100 ring-white/10">
        <CardHeader className="flex flex-row flex-wrap items-end justify-between gap-3 space-y-0">
          <div>
            <CardTitle className="text-white">Groups</CardTitle>
            <CardDescription className="text-zinc-500">
              Filter by status and browse paginated results.
            </CardDescription>
          </div>
          <label className="grid gap-1.5 text-sm">
            <span className="text-zinc-400">Status</span>
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setPage(1);
                setStatusFilter(v);
              }}
            >
              <SelectTrigger className="h-9 w-40 border-white/10 bg-zinc-900/80">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {USER_GROUP_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="mb-4 text-sm text-red-400" role="alert">
              {error}
            </p>
          ) : null}
          <UserGroupsDataTable rows={rows} loading={loading} />
          <ListPagination
            page={page}
            pageSize={PAGE_SIZE}
            total={total}
            disabled={loading}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}
