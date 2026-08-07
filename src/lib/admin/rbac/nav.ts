import type { LucideIcon } from "lucide-react";
import {
  FileText,
  FolderKanban,
  Gift,
  LayoutTemplate,
  ListTodo,
  Megaphone,
  Settings,
  Shapes,
  Users,
} from "lucide-react";

import type { AdminCapabilities } from "@/lib/admin/rbac/capabilities";

export type AdminNavItem = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
  visible: (caps: AdminCapabilities) => boolean;
};

/** Primary sidebar entries (Dashboard itself is omitted — it is the home shell). */
export const ADMIN_PRIMARY_NAV: AdminNavItem[] = [
  {
    href: "/admin/campaigns",
    label: "Campaigns",
    description: "Create, edit, and publish campaigns.",
    icon: Megaphone,
    visible: (c) => c.menuCampaigns,
  },
  {
    href: "/admin/landing-pages",
    label: "Landing Pages",
    description: "Manage landing page content and locales.",
    icon: LayoutTemplate,
    visible: (c) => c.menuLandingPages,
  },
  {
    href: "/admin/user-groups",
    label: "User Groups",
    description: "Define audience rule groups.",
    icon: Users,
    visible: (c) => c.menuUserGroups,
  },
  {
    href: "/admin/task-group",
    label: "Tasks",
    description: "Configure task groups and task rules.",
    icon: ListTodo,
    visible: (c) => c.menuTasks,
  },
  {
    href: "/admin/rewards/projects",
    label: "Reward Management",
    description: "Projects, finance docs, and templates.",
    icon: Gift,
    visible: (c) => c.menuRewards,
  },
  {
    href: "/admin/settings",
    label: "Settings",
    description: "Console settings.",
    icon: Settings,
    visible: (c) => c.menuSettings,
  },
];

/** Extra home cards under Reward when the parent menu is visible. */
export const ADMIN_REWARD_SHORTCUTS: AdminNavItem[] = [
  {
    href: "/admin/rewards/projects",
    label: "Projects",
    description: "View reward projects.",
    icon: FolderKanban,
    visible: (c) => c.menuRewardProjects,
  },
  {
    href: "/admin/rewards/finance-docs",
    label: "Finance Docs",
    description: "Review and approve finance documents.",
    icon: FileText,
    visible: (c) => c.menuRewardFinanceDocs,
  },
  {
    href: "/admin/rewards/templates",
    label: "Templates",
    description: "Manage reward templates.",
    icon: Shapes,
    visible: (c) => c.menuRewardTemplates,
  },
];

export function visibleAdminNav(
  items: AdminNavItem[],
  caps: AdminCapabilities,
): AdminNavItem[] {
  return items.filter((item) => item.visible(caps));
}
