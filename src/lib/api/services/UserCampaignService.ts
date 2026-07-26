/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { data_StandardResponse } from '../models/data_StandardResponse';
import type { data_WebCampaignLandingPageData } from '../models/data_WebCampaignLandingPageData';
import type { data_WebCampaignListData } from '../models/data_WebCampaignListData';
import type { data_WebDepositData } from '../models/data_WebDepositData';
import type { data_WebDepositReq } from '../models/data_WebDepositReq';
import type { data_WebJoinCampaignData } from '../models/data_WebJoinCampaignData';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserCampaignService {
    /**
     * List available campaigns (user, mock)
     * @returns any success
     * @throws ApiError
     */
    public static getWebCampaigns(): CancelablePromise<(data_StandardResponse & {
        data?: data_WebCampaignListData;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/web/campaigns',
            errors: {
                401: `unauthorized`,
            },
        });
    }
    /**
     * Deposit for campaign task (user, mock)
     * @param campaignId Campaign ID
     * @param body Deposit amount
     * @returns any success
     * @throws ApiError
     */
    public static postWebCampaignsDeposit(
        campaignId: number,
        body: data_WebDepositReq,
    ): CancelablePromise<(data_StandardResponse & {
        data?: data_WebDepositData;
    })> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/web/campaigns/{campaignId}/deposit',
            path: {
                'campaignId': campaignId,
            },
            body: body,
            errors: {
                400: `bad request`,
                401: `unauthorized`,
            },
        });
    }
    /**
     * Join campaign (user, mock)
     * @param campaignId Campaign ID
     * @returns any success
     * @throws ApiError
     */
    public static postWebCampaignsJoin(
        campaignId: number,
    ): CancelablePromise<(data_StandardResponse & {
        data?: data_WebJoinCampaignData;
    })> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/web/campaigns/{campaignId}/join',
            path: {
                'campaignId': campaignId,
            },
            errors: {
                400: `bad request`,
                401: `unauthorized`,
            },
        });
    }
    /**
     * Get campaign landing page (user, mock)
     * @param campaignId Campaign ID
     * @param lang Preferred language; default en
     * @returns any success
     * @throws ApiError
     */
    public static getWebCampaignsLandingPage(
        campaignId: number,
        lang?: string,
    ): CancelablePromise<(data_StandardResponse & {
        data?: data_WebCampaignLandingPageData;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/web/campaigns/{campaignId}/landing-page',
            path: {
                'campaignId': campaignId,
            },
            query: {
                'lang': lang,
            },
            errors: {
                400: `bad request`,
                401: `unauthorized`,
            },
        });
    }
}
