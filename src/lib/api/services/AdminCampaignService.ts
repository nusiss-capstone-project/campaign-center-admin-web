/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { api_CreateCampaignReq } from '../models/api_CreateCampaignReq';
import type { api_PublishOperatorReq } from '../models/api_PublishOperatorReq';
import type { api_UpdateCampaignReq } from '../models/api_UpdateCampaignReq';
import type { data_StandardResponse } from '../models/data_StandardResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminCampaignService {
    /**
     * List campaigns (admin)
     * @param page Page (default 1)
     * @param pageSize Page size (default 10)
     * @param status Campaign status filter
     * @param type Campaign type e.g. TOPUP_REWARD
     * @returns data_StandardResponse success
     * @throws ApiError
     */
    public static getAdminCampaigns(
        page?: number,
        pageSize?: number,
        status?: number,
        type?: string,
    ): CancelablePromise<data_StandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/campaigns',
            query: {
                'page': page,
                'pageSize': pageSize,
                'status': status,
                'type': type,
            },
            errors: {
                503: `database unavailable`,
            },
        });
    }
    /**
     * Create campaign (admin)
     * @param body Campaign payload
     * @returns data_StandardResponse success
     * @throws ApiError
     */
    public static postAdminCampaigns(
        body: api_CreateCampaignReq,
    ): CancelablePromise<data_StandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/campaigns',
            body: body,
            errors: {
                400: `validation error`,
                503: `database unavailable`,
            },
        });
    }
    /**
     * Get campaign detail (admin)
     * @param campaignId Campaign ID
     * @returns data_StandardResponse success
     * @throws ApiError
     */
    public static getAdminCampaigns1(
        campaignId: number,
    ): CancelablePromise<data_StandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/campaigns/{campaignId}',
            path: {
                'campaignId': campaignId,
            },
            errors: {
                404: `not found`,
                503: `database unavailable`,
            },
        });
    }
    /**
     * Update campaign (admin)
     * @param campaignId Campaign ID
     * @param body Campaign payload
     * @returns data_StandardResponse success
     * @throws ApiError
     */
    public static putAdminCampaigns(
        campaignId: number,
        body: api_UpdateCampaignReq,
    ): CancelablePromise<data_StandardResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/campaigns/{campaignId}',
            path: {
                'campaignId': campaignId,
            },
            body: body,
            errors: {
                400: `bad request`,
                404: `not found`,
                409: `not draft`,
                503: `database unavailable`,
            },
        });
    }
    /**
     * Archive campaign (admin)
     * @param campaignId Campaign ID
     * @param body Operator
     * @returns data_StandardResponse success
     * @throws ApiError
     */
    public static postAdminCampaignsArchive(
        campaignId: number,
        body: api_PublishOperatorReq,
    ): CancelablePromise<data_StandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/campaigns/{campaignId}/archive',
            path: {
                'campaignId': campaignId,
            },
            body: body,
            errors: {
                400: `bad request`,
                404: `not found`,
                409: `not eligible or already archived`,
                503: `database unavailable`,
            },
        });
    }
    /**
     * Publish campaign (admin)
     * @param campaignId Campaign ID
     * @param body Operator
     * @returns data_StandardResponse success
     * @throws ApiError
     */
    public static postAdminCampaignsPublish(
        campaignId: number,
        body: api_PublishOperatorReq,
    ): CancelablePromise<data_StandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/campaigns/{campaignId}/publish',
            path: {
                'campaignId': campaignId,
            },
            body: body,
            errors: {
                404: `not found`,
                503: `database unavailable`,
            },
        });
    }
}
