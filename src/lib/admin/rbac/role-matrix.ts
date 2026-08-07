import type { AdminRole } from "@/lib/admin/rbac/roles";
import { normalizeAdminRole } from "@/lib/admin/rbac/roles";
import {
  ALLOW_ALL_CAPABILITIES,
  DENY_ALL_CAPABILITIES,
  type AdminCapabilities,
} from "@/lib/admin/rbac/capabilities";

/**
 * Role → capability matrix (identity-ms admin roles).
 * Extend by adding a role key and overriding only what differs from deny-all / allow-all.
 */
const ROLE_CAPABILITY_MATRIX: Record<AdminRole, AdminCapabilities> = {
  admin: ALLOW_ALL_CAPABILITIES,

  campaign_ops: {
    ...DENY_ALL_CAPABILITIES,
    menuDashboard: true,
    menuCampaigns: true,
    menuLandingPages: true,
    menuUserGroups: true,
    menuTasks: true,
    menuRewards: true,
    menuRewardProjects: true,
    menuRewardFinanceDocs: true,
    // Templates not listed on reward matrix for campaign_ops; keep usable for campaign wiring.
    menuRewardTemplates: true,
    menuSettings: false,

    canCreateCampaign: true,
    canEditCampaign: true,
    canPublishCampaign: true,
    canCreateLandingPage: true,
    canEditLandingPage: true,
    canPublishLandingPage: true,

    canCreateUserGroup: true,
    canEditUserGroup: true,
    canPublishUserGroup: true,
    canOfflineUserGroup: true,

    canCreateTaskGroup: true,
    canEditTaskGroup: true,
    canPublishTaskGroup: true,
    canCreateTask: true,
    canEditTask: true,
    canPublishTask: true,

    canViewProjects: true,
    canCreateProject: true,
    canViewFinanceDocs: true,
    canCreateFinanceDoc: true,
    canEditFinanceDoc: true,
    canSubmitFinanceDoc: true,
    canApproveFinanceDoc: false,
    canRecordFinancePayment: false,
    canCreateIssueRequest: true,
    canEditIssueRequest: true,
    canSubmitIssueRequest: true,
    canApproveIssueRequest: false,
    canViewTemplates: true,
    canCreateTemplate: true,
    canEditTemplate: true,
    canPublishTemplate: true,
  },

  finance_admin: {
    ...DENY_ALL_CAPABILITIES,
    menuDashboard: true,
    menuRewards: true,
    menuRewardProjects: true,
    menuRewardFinanceDocs: true,
    menuRewardTemplates: false,
    menuSettings: false,

    canViewProjects: true,
    canCreateProject: false,
    canViewFinanceDocs: true,
    canCreateFinanceDoc: false,
    canEditFinanceDoc: false,
    canSubmitFinanceDoc: false,
    canApproveFinanceDoc: true,
    canRecordFinancePayment: true,
    canCreateIssueRequest: false,
    canEditIssueRequest: false,
    canSubmitIssueRequest: false,
    canApproveIssueRequest: true,
    canViewTemplates: false,
    canCreateTemplate: false,
    canEditTemplate: false,
    canPublishTemplate: false,
  },
};

/** Resolve UI capabilities for a raw role string from identity-ms. */
export function capabilitiesForRole(
  role: string | null | undefined,
): AdminCapabilities {
  const normalized = normalizeAdminRole(role);
  if (!normalized) return DENY_ALL_CAPABILITIES;
  return ROLE_CAPABILITY_MATRIX[normalized];
}

/** Register / override a role matrix entry (useful for tests or future roles). */
export function defineRoleCapabilities(
  role: AdminRole,
  caps: AdminCapabilities,
): void {
  ROLE_CAPABILITY_MATRIX[role] = caps;
}
