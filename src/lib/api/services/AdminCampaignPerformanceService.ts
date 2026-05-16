/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { data_StandardResponse } from '../models/data_StandardResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminCampaignPerformanceService {
    /**
     * List campaign participations (admin)
     * @param campaignId Campaign ID
     * @param page Page (default 1)
     * @param pageSize Page size (default 20)
     * @param userId Filter by user ID
     * @param status Filter by reward status e.g. GRANTED
     * @returns data_StandardResponse success
     * @throws ApiError
     */
    public static getAdminCampaignsParticipations(
        campaignId: number,
        page?: number,
        pageSize?: number,
        userId?: number,
        status?: string,
    ): CancelablePromise<data_StandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/campaigns/{campaignId}/participations',
            path: {
                'campaignId': campaignId,
            },
            query: {
                'page': page,
                'pageSize': pageSize,
                'userId': userId,
                'status': status,
            },
            errors: {
                404: `campaign not found`,
                503: `database unavailable`,
            },
        });
    }
    /**
     * List campaign daily performance (admin)
     * @param campaignId Campaign ID
     * @param startDate Start date YYYY-MM-DD
     * @param endDate End date YYYY-MM-DD
     * @returns data_StandardResponse success
     * @throws ApiError
     */
    public static getAdminCampaignsPerformanceDaily(
        campaignId: number,
        startDate: string,
        endDate: string,
    ): CancelablePromise<data_StandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/campaigns/{campaignId}/performance/daily',
            path: {
                'campaignId': campaignId,
            },
            query: {
                'startDate': startDate,
                'endDate': endDate,
            },
            errors: {
                400: `bad request`,
                404: `campaign not found`,
                503: `database unavailable`,
            },
        });
    }
    /**
     * Get campaign performance summary (admin)
     * @param campaignId Campaign ID
     * @returns data_StandardResponse success
     * @throws ApiError
     */
    public static getAdminCampaignsPerformanceSummary(
        campaignId: number,
    ): CancelablePromise<data_StandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/campaigns/{campaignId}/performance/summary',
            path: {
                'campaignId': campaignId,
            },
            errors: {
                404: `campaign not found`,
                503: `database unavailable`,
            },
        });
    }
}
