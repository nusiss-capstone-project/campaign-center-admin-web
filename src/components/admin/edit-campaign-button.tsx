"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

import { createCampaignVersion } from "@/lib/admin/campaign-admin-fetch";
import { campaignEditHref } from "@/lib/admin/campaign-edit-href";
import type { CampaignStatusCategory } from "@/lib/admin/campaign-row";
import { Button } from "@/components/ui/button";

type EditCampaignButtonProps = {
  campaignId: number;
  statusCategory: CampaignStatusCategory;
  children?: ReactNode;
  className?: string;
  variant?: "ghost" | "default" | "outline";
  size?: "default" | "sm" | "icon" | "icon-sm";
  /** When true, render as a menu row (`button`) instead of Button. */
  asMenuItem?: boolean;
  onStarted?: () => void;
  onError?: (message: string) => void;
};

/**
 * Draft → go to editor.
 * Published → create a new draft version once, then go to editor.
 */
export function EditCampaignButton({
  campaignId,
  statusCategory,
  children = "Edit",
  className,
  variant = "ghost",
  size = "default",
  asMenuItem = false,
  onStarted,
  onError,
}: Readonly<EditCampaignButtonProps>) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const href = campaignEditHref(campaignId);

  async function handleClick() {
    if (pending) return;
    onStarted?.();
    if (statusCategory !== "published") {
      router.push(href);
      return;
    }
    setPending(true);
    try {
      await createCampaignVersion(campaignId);
      router.push(href);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to create new version";
      onError?.(message);
      setPending(false);
    }
  }

  if (asMenuItem) {
    return (
      <button
        type="button"
        disabled={pending}
        className={
          className ??
          "w-full rounded-md px-3 py-2 text-left text-sm text-white hover:bg-white/10 disabled:opacity-50"
        }
        onClick={() => void handleClick()}
      >
        {pending ? "Creating version…" : children}
      </button>
    );
  }

  if (statusCategory !== "published") {
    return (
      <Button variant={variant} size={size} className={className} asChild>
        <Link href={href}>{children}</Link>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      disabled={pending}
      onClick={() => void handleClick()}
    >
      {pending ? "…" : children}
    </Button>
  );
}
