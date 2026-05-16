/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { api_SimulateTopUpReq } from '../models/api_SimulateTopUpReq';
import type { data_StandardResponse } from '../models/data_StandardResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserCampaignService {
    /**
     * List available campaigns (user)
     * @returns data_StandardResponse success
     * @throws ApiError
     */
    public static getWebCampaigns(): CancelablePromise<data_StandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/web/campaigns',
            errors: {
                503: `database unavailable`,
            },
        });
    }
    /**
     * Join campaign (user)
     * @param campaignId Campaign ID
     * @returns data_StandardResponse success or business error code in body
     * @throws ApiError
     */
    public static postWebCampaignsJoin(
        campaignId: number,
    ): CancelablePromise<data_StandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/web/campaigns/{campaignId}/join',
            path: {
                'campaignId': campaignId,
            },
            errors: {
                400: `bad request`,
                503: `database unavailable`,
            },
        });
    }
    /**
     * Get campaign landing page (user)
     * @param campaignId Campaign ID
     * @param lang Preferred language; falls back to default
     * @returns data_StandardResponse success
     * @throws ApiError
     */
    public static getWebCampaignsLandingPage(
        campaignId: number,
        lang?: string,
    ): CancelablePromise<data_StandardResponse> {
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
                404: `not found`,
                503: `database unavailable`,
            },
        });
    }
    /**
     * Simulate top-up with account recharge (user)
     * @param campaignId Campaign ID
     * @param body Top-up amount
     * @returns data_StandardResponse success, manual review, or business error code
     * @throws ApiError
     */
    public static postWebCampaignsTopUp(
        campaignId: number,
        body: api_SimulateTopUpReq,
    ): CancelablePromise<data_StandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/web/campaigns/{campaignId}/top-up',
            path: {
                'campaignId': campaignId,
            },
            body: body,
            errors: {
                400: `bad request`,
                503: `database unavailable`,
            },
        });
    }
}
