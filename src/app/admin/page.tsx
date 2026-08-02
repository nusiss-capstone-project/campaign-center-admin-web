"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  FileText,
  FolderKanban,
  Gift,
  LayoutTemplate,
  ListTodo,
  Megaphone,
  Settings,
} from "lucide-react";

import { useAdminAccess } from "@/components/admin/admin-access-provider";
import type { AdminCapabilities } from "@/lib/admin/rbac/capabilities";
import { cn } from "@/lib/utils";

type HomeLink = {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  visible: (caps: AdminCapabilities) => boolean;
};

const HOME_LINKS: HomeLink[] = [
  {
    href: "/admin/campaigns",
    title: "Campaigns",
    description: "Create and manage campaign versions.",
    icon: Megaphone,
    visible: (c) => c.menuCampaigns,
  },
  {
    href: "/admin/landing-pages",
    title: "Landing Pages",
    description: "Edit and publish landing page content.",
    icon: LayoutTemplate,
    visible: (c) => c.menuLandingPages,
  },
  {
    href: "/admin/task-group",
    title: "Tasks",
    description: "Configure task groups and publish tasks.",
    icon: ListTodo,
    visible: (c) => c.menuTasks,
  },
  {
    href: "/admin/rewards/projects",
    title: "Projects",
    description: "Browse reward projects.",
    icon: FolderKanban,
    visible: (c) => c.menuRewardProjects,
  },
  {
    href: "/admin/rewards/finance-docs",
    title: "Finance Docs",
    description: "Review finance documents and approvals.",
    icon: FileText,
    visible: (c) => c.menuRewardFinanceDocs,
  },
  {
    href: "/admin/rewards/templates",
    title: "Templates",
    description: "Manage reward templates.",
    icon: Gift,
    visible: (c) => c.menuRewardTemplates,
  },
  {
    href: "/admin/settings",
    title: "Settings",
    description: "Admin settings.",
    icon: Settings,
    visible: (c) => c.menuSettings,
  },
];

export default function AdminHomePage() {
  const { user, roleLabel, caps, loading, error } = useAdminAccess();
  const links = HOME_LINKS.filter((item) => item.visible(caps));

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 p-6 lg:px-8 lg:py-10">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          Home
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          {loading
            ? "Loading…"
            : `Welcome${user?.username ? `, ${user.username}` : ""}`}
        </h1>
        <p className="text-sm text-zinc-500">
          {error
            ? "Could not load your profile. Menu below uses signed-in role when available."
            : `Signed in as ${roleLabel}. Choose a module you can access.`}
        </p>
      </header>

      {loading ? (
        <p className="text-sm text-zinc-500">Loading available menus…</p>
      ) : links.length === 0 ? (
        <p className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          No modules are available for your role. Contact an administrator.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {links.map(({ href, title, description, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "group rounded-xl border border-white/10 bg-zinc-900/50 p-5 transition-colors",
                "hover:border-white/20 hover:bg-zinc-900",
              )}
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-zinc-800 text-zinc-200 ring-1 ring-white/10 transition group-hover:text-white">
                <Icon className="size-4" strokeWidth={1.75} aria-hidden />
              </div>
              <h2 className="mt-4 text-sm font-semibold text-white">{title}</h2>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                {description}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
