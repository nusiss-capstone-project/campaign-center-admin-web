/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { api_RewardRulesReq } from './api_RewardRulesReq';
export type api_UpdateCampaignReq = {
    campaignEndTime: string;
    campaignStartTime: string;
    landingPageId?: number;
    name: string;
    registrationEndTime: string;
    registrationStartTime: string;
    rewardRules: api_RewardRulesReq;
    targetMarket: string;
    targetUserSegment: string;
};

