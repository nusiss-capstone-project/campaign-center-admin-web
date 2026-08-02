/**
 * Flat capability flags for admin UI.
 * Add fields here when introducing new menus/actions; map them in `role-matrix.ts`.
 */
export type AdminCapabilities = {
  // —— Menus ——
  menuDashboard: boolean;
  menuCampaigns: boolean;
  menuLandingPages: boolean;
  menuTasks: boolean;
  menuRewards: boolean;
  menuRewardProjects: boolean;
  menuRewardFinanceDocs: boolean;
  menuRewardTemplates: boolean;
  menuSettings: boolean;

  // —— Campaign center ——
  canCreateCampaign: boolean;
  canEditCampaign: boolean;
  canPublishCampaign: boolean;
  canCreateLandingPage: boolean;
  canEditLandingPage: boolean;
  canPublishLandingPage: boolean;

  // —— Task ——
  canCreateTaskGroup: boolean;
  canEditTaskGroup: boolean;
  canPublishTaskGroup: boolean;
  canCreateTask: boolean;
  canEditTask: boolean;
  canPublishTask: boolean;

  // —— Reward ——
  canViewProjects: boolean;
  canCreateProject: boolean;
  canViewFinanceDocs: boolean;
  canCreateFinanceDoc: boolean;
  canEditFinanceDoc: boolean;
  canSubmitFinanceDoc: boolean;
  canApproveFinanceDoc: boolean;
  canRecordFinancePayment: boolean;
  canCreateIssueRequest: boolean;
  canEditIssueRequest: boolean;
  canSubmitIssueRequest: boolean;
  canApproveIssueRequest: boolean;
  canViewTemplates: boolean;
  canCreateTemplate: boolean;
  canEditTemplate: boolean;
  canPublishTemplate: boolean;
};

export type RewardCapabilities = Pick<
  AdminCapabilities,
  | "canViewProjects"
  | "canCreateProject"
  | "canViewFinanceDocs"
  | "canCreateFinanceDoc"
  | "canEditFinanceDoc"
  | "canSubmitFinanceDoc"
  | "canApproveFinanceDoc"
  | "canRecordFinancePayment"
  | "canCreateIssueRequest"
  | "canEditIssueRequest"
  | "canSubmitIssueRequest"
  | "canApproveIssueRequest"
  | "canViewTemplates"
  | "canCreateTemplate"
  | "canEditTemplate"
  | "canPublishTemplate"
>;

export const DENY_ALL_CAPABILITIES: AdminCapabilities = {
  menuDashboard: false,
  menuCampaigns: false,
  menuLandingPages: false,
  menuTasks: false,
  menuRewards: false,
  menuRewardProjects: false,
  menuRewardFinanceDocs: false,
  menuRewardTemplates: false,
  menuSettings: false,
  canCreateCampaign: false,
  canEditCampaign: false,
  canPublishCampaign: false,
  canCreateLandingPage: false,
  canEditLandingPage: false,
  canPublishLandingPage: false,
  canCreateTaskGroup: false,
  canEditTaskGroup: false,
  canPublishTaskGroup: false,
  canCreateTask: false,
  canEditTask: false,
  canPublishTask: false,
  canViewProjects: false,
  canCreateProject: false,
  canViewFinanceDocs: false,
  canCreateFinanceDoc: false,
  canEditFinanceDoc: false,
  canSubmitFinanceDoc: false,
  canApproveFinanceDoc: false,
  canRecordFinancePayment: false,
  canCreateIssueRequest: false,
  canEditIssueRequest: false,
  canSubmitIssueRequest: false,
  canApproveIssueRequest: false,
  canViewTemplates: false,
  canCreateTemplate: false,
  canEditTemplate: false,
  canPublishTemplate: false,
};

export const ALLOW_ALL_CAPABILITIES: AdminCapabilities = {
  menuDashboard: true,
  menuCampaigns: true,
  menuLandingPages: true,
  menuTasks: true,
  menuRewards: true,
  menuRewardProjects: true,
  menuRewardFinanceDocs: true,
  menuRewardTemplates: true,
  menuSettings: true,
  canCreateCampaign: true,
  canEditCampaign: true,
  canPublishCampaign: true,
  canCreateLandingPage: true,
  canEditLandingPage: true,
  canPublishLandingPage: true,
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
  canApproveFinanceDoc: true,
  canRecordFinancePayment: true,
  canCreateIssueRequest: true,
  canEditIssueRequest: true,
  canSubmitIssueRequest: true,
  canApproveIssueRequest: true,
  canViewTemplates: true,
  canCreateTemplate: true,
  canEditTemplate: true,
  canPublishTemplate: true,
};

export function pickRewardCapabilities(
  caps: AdminCapabilities,
): RewardCapabilities {
  return {
    canViewProjects: caps.canViewProjects,
    canCreateProject: caps.canCreateProject,
    canViewFinanceDocs: caps.canViewFinanceDocs,
    canCreateFinanceDoc: caps.canCreateFinanceDoc,
    canEditFinanceDoc: caps.canEditFinanceDoc,
    canSubmitFinanceDoc: caps.canSubmitFinanceDoc,
    canApproveFinanceDoc: caps.canApproveFinanceDoc,
    canRecordFinancePayment: caps.canRecordFinancePayment,
    canCreateIssueRequest: caps.canCreateIssueRequest,
    canEditIssueRequest: caps.canEditIssueRequest,
    canSubmitIssueRequest: caps.canSubmitIssueRequest,
    canApproveIssueRequest: caps.canApproveIssueRequest,
    canViewTemplates: caps.canViewTemplates,
    canCreateTemplate: caps.canCreateTemplate,
    canEditTemplate: caps.canEditTemplate,
    canPublishTemplate: caps.canPublishTemplate,
  };
}
