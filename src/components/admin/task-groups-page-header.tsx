"use client";

import Link from "next/link";
import { Plus, Search } from "lucide-react";

import { useAdminCapabilities } from "@/components/admin/admin-access-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type TaskGroupStatusFilter = "all" | "DRAFT" | "PUBLISHED";

type TaskGroupsPageHeaderProps = {
  totalCount: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: TaskGroupStatusFilter;
  onStatusFilterChange: (value: TaskGroupStatusFilter) => void;
};

export function TaskGroupsPageHeader({
  totalCount,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: Readonly<TaskGroupsPageHeaderProps>) {
  const caps = useAdminCapabilities();

  return (
    <header className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Task Groups
          </h1>
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
            List
          </span>
          <span className="text-sm text-zinc-500">{totalCount} total</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] flex-1 sm:min-w-[260px] sm:flex-none">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500"
              strokeWidth={1.75}
              aria-hidden
            />
            <Input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search task groups..."
              className="h-9 border-white/10 bg-zinc-900/80 pl-9 text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-white/20"
              aria-label="Search task groups"
            />
          </div>
          {caps.canCreateTaskGroup ? (
            <Button
              asChild
              className="h-9 border-0 bg-white px-4 text-sm font-medium text-black hover:bg-zinc-200"
            >
              <Link href="/admin/task-group/create">
                <Plus className="mr-1.5 size-4" />
                Create Task Group
              </Link>
            </Button>
          ) : null}
        </div>
      </div>

      <label className="grid w-full gap-1.5 text-sm sm:w-48">
        <span className="text-zinc-400">Status</span>
        <Select
          value={statusFilter}
          onValueChange={(v) =>
            onStatusFilterChange(v as TaskGroupStatusFilter)
          }
        >
          <SelectTrigger
            size="default"
            className="h-9 w-full border-white/10 bg-zinc-900/80 text-zinc-100"
          >
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
          </SelectContent>
        </Select>
      </label>
    </header>
  );
}
