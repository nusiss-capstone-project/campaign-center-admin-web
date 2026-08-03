"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { useRewardCapabilities } from "@/lib/admin/reward/reward-capabilities";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type TemplateStatusFilter = "all" | "DRAFT" | "PUBLISHED";

type TemplatesPageHeaderProps = {
  total: number;
  statusFilter: TemplateStatusFilter;
  onStatusFilterChange: (value: TemplateStatusFilter) => void;
};

export function TemplatesPageHeader({
  total,
  statusFilter,
  onStatusFilterChange,
}: Readonly<TemplatesPageHeaderProps>) {
  const caps = useRewardCapabilities();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Reward Management
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">
            Templates
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {total} template{total === 1 ? "" : "s"}
          </p>
        </div>
        {caps.canCreateTemplate ? (
          <Button className="bg-white text-black hover:bg-zinc-200" asChild>
            <Link href="/admin/rewards/templates/create">
              <Plus className="size-4" strokeWidth={2} />
              Create template
            </Link>
          </Button>
        ) : null}
      </div>

      <label className="grid w-full gap-1.5 text-sm sm:w-48">
        <span className="text-zinc-400">Status</span>
        <Select
          value={statusFilter}
          onValueChange={(v) =>
            onStatusFilterChange(v as TemplateStatusFilter)
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
    </div>
  );
}
