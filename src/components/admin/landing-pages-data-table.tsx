"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, Pencil, Send } from "lucide-react";

import type { LandingPageDisplayRow } from "@/lib/admin/landing-page-row";
import { publishLandingPage } from "@/lib/admin/landing-pages-fetch";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LandingPageStatusBadge } from "@/components/admin/landing-page-status-badge";

type LandingPagesDataTableProps = {
  rows: LandingPageDisplayRow[];
  onMutated?: () => void;
};

export function LandingPagesDataTable({
  rows,
  onMutated,
}: LandingPagesDataTableProps) {
  const [publishingId, setPublishingId] = useState<number | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  async function handlePublish(row: LandingPageDisplayRow) {
    if (row.statusCategory !== "draft") return;
    setBanner(null);
    setPublishingId(row.id);
    try {
      await publishLandingPage(row.id);
      onMutated?.();
    } catch (e) {
      setBanner(e instanceof Error ? e.message : "Publish failed");
    } finally {
      setPublishingId(null);
    }
  }

  return (
    <div className="overflow-hidden rounded-xl">
      {banner ? (
        <p
          className="mb-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300"
          role="alert"
        >
          {banner}
        </p>
      ) : null}
      <Table className="border-0">
        <TableHeader>
          <TableRow className="border-0 hover:bg-transparent">
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              ID
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Default Language
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Title
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Status
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Created At
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-right text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              className="border-0 hover:bg-white/[0.03]"
            >
              <TableCell className="border-0 px-4 py-4 font-mono text-sm text-zinc-300">
                {row.id}
              </TableCell>
              <TableCell className="border-0 px-4 py-4 text-sm text-zinc-400">
                {row.language}
              </TableCell>
              <TableCell className="border-0 px-4 py-4 font-medium text-white">
                {row.title}
              </TableCell>
              <TableCell className="border-0 px-4 py-4">
                <LandingPageStatusBadge
                  category={row.statusCategory}
                  label={row.statusLabel}
                />
              </TableCell>
              <TableCell className="border-0 px-4 py-4 text-sm text-zinc-500">
                {row.createdAtLabel}
              </TableCell>
              <TableCell className="border-0 px-4 py-4">
                <div className="flex justify-end gap-0.5">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-zinc-400 hover:bg-white/5 hover:text-white"
                    asChild
                  >
                    <Link
                      href={`/admin/landing-pages/${row.id}`}
                      aria-label={`View ${row.title}`}
                    >
                      <Eye className="size-4" strokeWidth={1.75} />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-zinc-400 hover:bg-white/5 hover:text-white"
                    asChild
                  >
                    <Link
                      href={`/admin/landing-pages/${row.id}/edit`}
                      aria-label={`Edit ${row.title}`}
                    >
                      <Pencil className="size-4" strokeWidth={1.75} />
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="text-zinc-400 hover:bg-white/5 hover:text-white disabled:opacity-40"
                    aria-label="Publish landing page"
                    disabled={
                      row.statusCategory !== "draft" ||
                      publishingId === row.id
                    }
                    title={
                      row.statusCategory !== "draft"
                        ? "Only draft landing pages can be published"
                        : undefined
                    }
                    onClick={() => void handlePublish(row)}
                  >
                    <Send className="size-4" strokeWidth={1.75} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
