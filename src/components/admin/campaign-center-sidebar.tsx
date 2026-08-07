"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  Gift,
  HelpCircle,
  LayoutDashboard,
  LayoutTemplate,
  ListTodo,
  Megaphone,
  Settings,
  Users,
} from "lucide-react";

import { useAdminAccess } from "@/components/admin/admin-access-provider";
import { initialsFromUsername } from "@/lib/admin/identity/current-user";
import type { AdminCapabilities } from "@/lib/admin/rbac/capabilities";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  visible: (caps: AdminCapabilities) => boolean;
};

const NAV: NavItem[] = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    visible: (c) => c.menuDashboard,
  },
  {
    href: "/admin/campaigns",
    label: "Campaigns",
    icon: Megaphone,
    visible: (c) => c.menuCampaigns,
  },
  {
    href: "/admin/landing-pages",
    label: "Landing Pages",
    icon: LayoutTemplate,
    visible: (c) => c.menuLandingPages,
  },
  {
    href: "/admin/user-groups",
    label: "User Groups",
    icon: Users,
    visible: (c) => c.menuUserGroups,
  },
  {
    href: "/admin/task-group",
    label: "Tasks",
    icon: ListTodo,
    visible: (c) => c.menuTasks,
  },
  {
    href: "/admin/rewards/projects",
    label: "Reward Management",
    icon: Gift,
    visible: (c) => c.menuRewards,
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: Settings,
    visible: (c) => c.menuSettings,
  },
];

type RewardSection = "projects" | "finance-docs" | "templates";

function rewardSectionFromPath(pathname: string): RewardSection | null {
  if (pathname.startsWith("/admin/rewards/finance-docs")) return "finance-docs";
  if (pathname.startsWith("/admin/rewards/templates")) return "templates";
  if (pathname.startsWith("/admin/rewards")) return "projects";
  return null;
}

const CAMPAIGN_PATH_PATTERN = /^\/admin\/campaigns\/(\d+)(?:\/|$)/;

function campaignIdFromPath(pathname: string): string | null {
  const m = CAMPAIGN_PATH_PATTERN.exec(pathname);
  return m?.[1] ?? null;
}

function isNavActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  if (href === "/admin/rewards/projects") {
    return pathname.startsWith("/admin/rewards");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function subLinkClass(active: boolean): string {
  return cn(
    "rounded-md px-2.5 py-2 text-xs font-medium transition-colors",
    active
      ? "bg-zinc-800 text-white"
      : "text-zinc-500 hover:bg-zinc-900/60 hover:text-zinc-200",
  );
}

function CampaignSubnav({
  campaignId,
  pathname,
}: Readonly<{ campaignId: string; pathname: string }>) {
  const detailHref = `/admin/campaigns/${campaignId}`;
  const performanceHref = `${detailHref}/performance`;
  const detailsActive =
    pathname === detailHref || pathname === `${detailHref}/edit`;

  return (
    <div className="ml-4 flex flex-col gap-0.5 border-l border-white/10 py-1 pl-3">
      <Link href={detailHref} className={subLinkClass(detailsActive)}>
        Details
      </Link>
      <Link
        href={performanceHref}
        className={subLinkClass(pathname.startsWith(performanceHref))}
      >
        Performance
      </Link>
    </div>
  );
}

function RewardSubnav({
  rewardSection,
  caps,
}: Readonly<{ rewardSection: RewardSection; caps: AdminCapabilities }>) {
  return (
    <div className="ml-4 flex flex-col gap-0.5 border-l border-white/10 py-1 pl-3">
      {caps.menuRewardProjects ? (
        <Link
          href="/admin/rewards/projects"
          className={subLinkClass(rewardSection === "projects")}
        >
          Projects
        </Link>
      ) : null}
      {caps.menuRewardFinanceDocs ? (
        <Link
          href="/admin/rewards/finance-docs"
          className={subLinkClass(rewardSection === "finance-docs")}
        >
          Finance Docs
        </Link>
      ) : null}
      {caps.menuRewardTemplates ? (
        <Link
          href="/admin/rewards/templates"
          className={subLinkClass(rewardSection === "templates")}
        >
          Templates
        </Link>
      ) : null}
    </div>
  );
}

function SidebarNavItem({
  href,
  label,
  icon: Icon,
  pathname,
  campaignId,
  rewardSection,
  caps,
}: Readonly<{
  href: string;
  label: string;
  icon: LucideIcon;
  pathname: string;
  campaignId: string | null;
  rewardSection: RewardSection | null;
  caps: AdminCapabilities;
}>) {
  const active = isNavActive(pathname, href);

  return (
    <div className="flex flex-col gap-0.5">
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
          active
            ? "bg-zinc-900 text-white"
            : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-100",
        )}
      >
        <Icon className="size-4 shrink-0 opacity-80" strokeWidth={1.75} />
        {label}
      </Link>
      {href === "/admin/campaigns" && campaignId ? (
        <CampaignSubnav campaignId={campaignId} pathname={pathname} />
      ) : null}
      {href === "/admin/rewards/projects" && rewardSection ? (
        <RewardSubnav rewardSection={rewardSection} caps={caps} />
      ) : null}
    </div>
  );
}

function SidebarUserCard() {
  const { user, roleLabel, loading, error } = useAdminAccess();
  const username = user?.username?.trim() || (loading ? "Loading…" : "—");
  const initials = initialsFromUsername(user?.username || "");

  return (
    <div className="mt-3 flex items-center gap-3 rounded-lg px-3 py-3">
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-zinc-100 ring-1 ring-white/10"
        aria-hidden
      >
        {initials}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-white">{username}</p>
        <p className="truncate text-xs text-zinc-500">
          {error ? "Failed to load role" : roleLabel}
        </p>
      </div>
    </div>
  );
}

export function CampaignCenterSidebar() {
  const pathname = usePathname();
  const campaignId = campaignIdFromPath(pathname);
  const rewardSection = rewardSectionFromPath(pathname);
  const { caps } = useAdminAccess();
  const visibleNav = NAV.filter((item) => item.visible(caps));

  return (
    <aside className="flex w-[260px] shrink-0 flex-col border-r border-white/10 bg-black">
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
        <div className="flex size-9 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/25">
          <Megaphone className="size-4" strokeWidth={2} aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-tight text-white">
            Campaign Center
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        {visibleNav.map(({ href, label, icon }) => (
          <SidebarNavItem
            key={href}
            href={href}
            label={label}
            icon={icon}
            pathname={pathname}
            campaignId={campaignId}
            rewardSection={rewardSection}
            caps={caps}
          />
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <Link
          href="/admin/help"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-900/60 hover:text-zinc-100"
        >
          <HelpCircle className="size-4 shrink-0" strokeWidth={1.75} />
          Help & Support
        </Link>

        <SidebarUserCard />
      </div>
    </aside>
  );
}
