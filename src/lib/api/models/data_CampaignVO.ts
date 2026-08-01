/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { data_BudgetVO } from './data_BudgetVO';
import type { data_CampaignRewardRuleVO } from './data_CampaignRewardRuleVO';
import type { data_TargetUserGroupVO } from './data_TargetUserGroupVO';
export type data_CampaignVO = {
    budgets?: data_BudgetVO;
    campaignEndTime?: number;
    campaignStartTime?: number;
    createdAt?: number;
    id?: number;
    landingPageId?: number;
    market?: string;
    name?: string;
    registrationEndTime?: number;
    registrationStartTime?: number;
    rewardRules?: data_CampaignRewardRuleVO;
    status?: number;
    targetUserGroups?: data_TargetUserGroupVO;
    timeZone?: string;
    updatedAt?: number;
    version?: number;
};

