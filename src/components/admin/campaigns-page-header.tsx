"use client";

import Link from "next/link";
import { Bell, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CampaignsPageHeaderProps = {
  publishedCount: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
};

export function CampaignsPageHeader({
  publishedCount,
  searchQuery,
  onSearchChange,
}: CampaignsPageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Campaigns
        </h1>
        <Badge
          variant="secondary"
          className="h-6 rounded-full border border-white/10 bg-zinc-900 px-2.5 text-xs font-medium text-zinc-200"
        >
          {publishedCount} published
        </Badge>
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
            placeholder="Search campaigns..."
            className="h-9 border-white/10 bg-zinc-900/80 pl-9 text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-white/20"
            aria-label="Search campaigns"
          />
        </div>
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
          <Link href="/admin/campaigns/create">Create Campaign</Link>
        </Button>
      </div>
    </header>
  );
}
