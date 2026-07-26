/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { data_CampaignVO } from '../models/data_CampaignVO';
import type { data_CreateCampaignReq } from '../models/data_CreateCampaignReq';
import type { data_PublishOperatorReq } from '../models/data_PublishOperatorReq';
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
     * @param campaignId Campaign ID filter
     * @returns data_StandardResponse success
     * @throws ApiError
     */
    public static getAdminCampaigns(
        page?: number,
        pageSize?: number,
        status?: number,
        campaignId?: number,
    ): CancelablePromise<data_StandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/campaigns',
            query: {
                'page': page,
                'pageSize': pageSize,
                'status': status,
                'campaignId': campaignId,
            },
            errors: {
                503: `database unavailable`,
            },
        });
    }
    /**
     * Create campaign (admin)
     * @param body Campaign name
     * @returns data_StandardResponse success
     * @throws ApiError
     */
    public static postAdminCampaigns(
        body: data_CreateCampaignReq,
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
        body: data_PublishOperatorReq,
    ): CancelablePromise<data_StandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/campaigns/{campaignId}/publish',
            path: {
                'campaignId': campaignId,
            },
            body: body,
            errors: {
                400: `validation error`,
                404: `not found`,
            },
        });
    }
    /**
     * Create campaign version (admin)
     * @param campaignId Campaign ID
     * @returns data_StandardResponse success
     * @throws ApiError
     */
    public static postAdminCampaignsVersions(
        campaignId: number,
    ): CancelablePromise<data_StandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/campaigns/{campaignId}/versions',
            path: {
                'campaignId': campaignId,
            },
            errors: {
                400: `bad request`,
                404: `not found`,
            },
        });
    }
    /**
     * Edit campaign draft version (admin)
     * @param campaignId Campaign ID
     * @param version Version
     * @param body Draft content; read-only fields are ignored
     * @returns data_StandardResponse success
     * @throws ApiError
     */
    public static putAdminCampaignsVersions(
        campaignId: number,
        version: number,
        body: data_CampaignVO,
    ): CancelablePromise<data_StandardResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/campaigns/{campaignId}/versions/{version}',
            path: {
                'campaignId': campaignId,
                'version': version,
            },
            body: body,
            errors: {
                400: `bad request`,
                404: `not found`,
                409: `not editable`,
            },
        });
    }
}
