/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { data_WebLandingPageContent } from './data_WebLandingPageContent';
import type { data_WebParticipationStatus } from './data_WebParticipationStatus';
export type data_WebCampaignLandingPageData = {
    campaignId?: number;
    joined?: boolean;
    landingPage?: data_WebLandingPageContent;
    market?: string;
    name?: string;
    participation?: data_WebParticipationStatus;
    timeZone?: string;
    userId?: number;
};

