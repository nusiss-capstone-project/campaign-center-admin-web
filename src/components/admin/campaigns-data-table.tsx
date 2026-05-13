"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, MoreHorizontal, Send } from "lucide-react";

import type { CampaignDisplayRow } from "@/lib/admin/campaign-row";
import { canArchiveCampaign } from "@/lib/admin/campaign-row";
import {
  archiveCampaign,
  publishCampaign,
} from "@/lib/admin/campaign-admin-fetch";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CampaignStatusBadge } from "@/components/admin/campaign-status-badge";
import { CampaignTypeBadge } from "@/components/admin/campaign-type-badge";

type CampaignsDataTableProps = {
  rows: CampaignDisplayRow[];
  onCampaignsMutated?: () => void;
};

export function CampaignsDataTable({
  rows,
  onCampaignsMutated,
}: CampaignsDataTableProps) {
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [publishingId, setPublishingId] = useState<number | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  async function handlePublish(row: CampaignDisplayRow) {
    if (row.statusCategory !== "draft") return;
    setBanner(null);
    setPublishingId(row.id);
    try {
      await publishCampaign(row.id);
      onCampaignsMutated?.();
    } catch (e) {
      setBanner(
        e instanceof Error ? e.message : "Publish failed",
      );
    } finally {
      setPublishingId(null);
    }
  }

  async function handleArchive(row: CampaignDisplayRow) {
    if (!canArchiveCampaign(row)) return;
    setBanner(null);
    try {
      await archiveCampaign(row.id);
      setMenuOpenId(null);
      onCampaignsMutated?.();
    } catch (e) {
      setBanner(
        e instanceof Error ? e.message : "Archive failed",
      );
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
              Campaign Name
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Type
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Target Market
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Segment
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Status
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Campaign Period
            </TableHead>
            <TableHead className="h-11 border-0 px-4 text-right text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const canEdit =
              row.statusCategory === "draft" ||
              row.statusCategory === "published";
            const canArchive = canArchiveCampaign(row);
            const menuOpen = menuOpenId === row.id;

            return (
              <TableRow
                key={row.id}
                className="border-0 hover:bg-white/[0.03]"
              >
                <TableCell className="border-0 px-4 py-4 font-medium text-white">
                  {row.name}
                </TableCell>
                <TableCell className="border-0 px-4 py-4">
                  <CampaignTypeBadge typeRaw={row.typeRaw} />
                </TableCell>
                <TableCell className="border-0 px-4 py-4 text-sm text-zinc-400">
                  {row.targetMarket}
                </TableCell>
                <TableCell className="border-0 px-4 py-4 text-sm text-zinc-400">
                  {row.segment}
                </TableCell>
                <TableCell className="border-0 px-4 py-4">
                  <CampaignStatusBadge
                    category={row.statusCategory}
                    label={row.statusLabel}
                  />
                </TableCell>
                <TableCell className="border-0 px-4 py-4 text-sm text-zinc-500">
                  {row.periodLabel}
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
                        href={`/admin/campaigns/${row.id}`}
                        aria-label={`View ${row.name}`}
                      >
                        <Eye className="size-4" strokeWidth={1.75} />
                      </Link>
                    </Button>
                    {row.statusCategory === "draft" ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="text-zinc-400 hover:bg-white/5 hover:text-white disabled:opacity-40"
                        aria-label="Publish campaign"
                        disabled={publishingId === row.id}
                        onClick={() => void handlePublish(row)}
                      >
                        <Send className="size-4" strokeWidth={1.75} />
                      </Button>
                    ) : null}
                    <Popover
                      open={menuOpen}
                      onOpenChange={(open) =>
                        setMenuOpenId(open ? row.id : null)
                      }
                    >
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="text-zinc-400 hover:bg-white/5 hover:text-white"
                          aria-label="More actions"
                          aria-expanded={menuOpen}
                        >
                          <MoreHorizontal
                            className="size-4"
                            strokeWidth={1.75}
                          />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        align="end"
                        sideOffset={6}
                        className="w-48 border border-white/10 bg-zinc-900 p-1 text-zinc-100 shadow-xl ring-1 ring-black/40"
                      >
                        <Link
                          href={`/admin/campaigns/${row.id}`}
                          className="block rounded-md px-3 py-2 text-sm text-white hover:bg-white/10"
                          onClick={() => setMenuOpenId(null)}
                        >
                          View Details
                        </Link>
                        {canEdit ? (
                          <Link
                            href={`/admin/campaigns/${row.id}/edit`}
                            className="block rounded-md px-3 py-2 text-sm text-white hover:bg-white/10"
                            onClick={() => setMenuOpenId(null)}
                          >
                            Edit
                          </Link>
                        ) : null}
                        <Link
                          href={`/admin/campaigns/create?duplicateFrom=${row.id}`}
                          className="block rounded-md px-3 py-2 text-sm text-white hover:bg-white/10"
                          onClick={() => setMenuOpenId(null)}
                        >
                          Duplicate
                        </Link>
                        <button
                          type="button"
                          disabled={!canArchive}
                          title={
                            !canArchive
                              ? row.statusCategory === "archive"
                                ? "Already archived"
                                : row.statusCategory !== "draft" &&
                                    row.statusCategory !== "published"
                                  ? "Only draft or published campaigns can be archived"
                                  : row.campaignStartMs == null ||
                                      row.campaignEndMs == null
                                    ? "Campaign schedule is required to archive"
                                    : "Archive is available when the campaign is outside its activity period"
                              : undefined
                          }
                          className="w-full rounded-md px-3 py-2 text-left text-sm text-red-400 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                          onClick={() => void handleArchive(row)}
                        >
                          Archive
                        </button>
                      </PopoverContent>
                    </Popover>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
