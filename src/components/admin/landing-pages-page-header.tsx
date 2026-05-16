"use client";

import Link from "next/link";
import { Bell } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type LandingPageStatusFilter = "all" | "1" | "2" | "3";

type LandingPagesPageHeaderProps = {
  total: number;
  languageFilter: string;
  onLanguageFilterChange: (value: string) => void;
  statusFilter: LandingPageStatusFilter;
  onStatusFilterChange: (value: LandingPageStatusFilter) => void;
};

export function LandingPagesPageHeader({
  total,
  languageFilter,
  onLanguageFilterChange,
  statusFilter,
  onStatusFilterChange,
}: LandingPagesPageHeaderProps) {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Landing Pages
          </h1>
          <Badge
            variant="secondary"
            className="h-6 rounded-full border border-white/10 bg-zinc-900 px-2.5 text-xs font-medium text-zinc-200"
          >
            {total} total
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-9 border-white/10 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            aria-label="Notifications"
          >
            <Bell className="size-4" strokeWidth={1.75} />
          </Button>
          <Button
            asChild
            className="h-9 border-0 bg-white px-4 text-sm font-medium text-black hover:bg-zinc-200"
          >
            <Link href="/admin/landing-pages/create">Create Landing Page</Link>
          </Button>
        </div>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <label className="grid min-w-[200px] flex-1 gap-1.5 text-sm sm:max-w-xs">
          <span className="text-zinc-400">Default Language</span>
          <Input
            value={languageFilter}
            onChange={(e) => onLanguageFilterChange(e.target.value)}
            placeholder="e.g. en"
            className="h-9 border-white/10 bg-zinc-900/80 text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-white/20"
            aria-label="Filter by default language"
          />
        </label>
        <label className="grid w-full gap-1.5 text-sm sm:w-48">
          <span className="text-zinc-400">Status</span>
          <Select
            value={statusFilter}
            onValueChange={(v) =>
              onStatusFilterChange(v as LandingPageStatusFilter)
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
              <SelectItem value="1">Draft</SelectItem>
              <SelectItem value="2">Published</SelectItem>
              <SelectItem value="3">Archived</SelectItem>
            </SelectContent>
          </Select>
        </label>
      </div>
    </div>
  );
}
