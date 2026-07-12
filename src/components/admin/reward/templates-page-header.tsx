"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { useRewardCapabilities } from "@/lib/admin/reward/reward-capabilities";
import { Button } from "@/components/ui/button";

type TemplatesPageHeaderProps = {
  total: number;
};

export function TemplatesPageHeader({ total }: TemplatesPageHeaderProps) {
  const caps = useRewardCapabilities();

  return (
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
  );
}
