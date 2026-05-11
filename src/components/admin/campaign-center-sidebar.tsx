"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  HelpCircle,
  LayoutDashboard,
  LayoutTemplate,
  Megaphone,
  Settings,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/admin/landing-pages", label: "Landing Pages", icon: LayoutTemplate },
  { href: "/admin/audiences", label: "Audiences", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
] as const;

export function CampaignCenterSidebar() {
  const pathname = usePathname();

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
        {NAV.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin"
              ? pathname === "/admin"
              : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
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
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <Link
          href="/admin/help"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-900/60 hover:text-zinc-100"
        >
          <HelpCircle className="size-4 shrink-0" strokeWidth={1.75} />
          Help & Support
        </Link>

        <div className="mt-3 flex items-center gap-3 rounded-lg px-3 py-3">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-zinc-100 ring-1 ring-white/10"
            aria-hidden
          >
            JD
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">John Doe</p>
            <p className="truncate text-xs text-zinc-500">john@company.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
