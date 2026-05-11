/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { api_LandingPageBody } from '../models/api_LandingPageBody';
import type { api_PublishOperatorReq } from '../models/api_PublishOperatorReq';
import type { data_StandardResponse } from '../models/data_StandardResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminLandingPageService {
    /**
     * List landing pages (admin)
     * @param page Page
     * @param pageSize Page size
     * @param status Status filter
     * @param language Language filter e.g. en-US
     * @returns data_StandardResponse success
     * @throws ApiError
     */
    public static getAdminLandingPages(
        page?: number,
        pageSize?: number,
        status?: number,
        language?: string,
    ): CancelablePromise<data_StandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/landing-pages',
            query: {
                'page': page,
                'pageSize': pageSize,
                'status': status,
                'language': language,
            },
            errors: {
                503: `database unavailable`,
            },
        });
    }
    /**
     * Create landing page (admin)
     * @param body Landing page content
     * @returns data_StandardResponse success
     * @throws ApiError
     */
    public static postAdminLandingPages(
        body: api_LandingPageBody,
    ): CancelablePromise<data_StandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/landing-pages',
            body: body,
            errors: {
                400: `validation error`,
                503: `database unavailable`,
            },
        });
    }
    /**
     * Get landing page (admin)
     * @param landingPageId Landing page ID
     * @returns data_StandardResponse success
     * @throws ApiError
     */
    public static getAdminLandingPages1(
        landingPageId: number,
    ): CancelablePromise<data_StandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/landing-pages/{landingPageId}',
            path: {
                'landingPageId': landingPageId,
            },
            errors: {
                404: `not found`,
                503: `database unavailable`,
            },
        });
    }
    /**
     * Update landing page (admin)
     * @param landingPageId Landing page ID
     * @param body Landing page content
     * @returns data_StandardResponse success
     * @throws ApiError
     */
    public static putAdminLandingPages(
        landingPageId: number,
        body: api_LandingPageBody,
    ): CancelablePromise<data_StandardResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/landing-pages/{landingPageId}',
            path: {
                'landingPageId': landingPageId,
            },
            body: body,
            errors: {
                404: `not found`,
                409: `not draft`,
                503: `database unavailable`,
            },
        });
    }
    /**
     * Publish landing page (admin)
     * @param landingPageId Landing page ID
     * @param body Operator
     * @returns data_StandardResponse success
     * @throws ApiError
     */
    public static postAdminLandingPagesPublish(
        landingPageId: number,
        body: api_PublishOperatorReq,
    ): CancelablePromise<data_StandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/landing-pages/{landingPageId}/publish',
            path: {
                'landingPageId': landingPageId,
            },
            body: body,
            errors: {
                404: `not found`,
                503: `database unavailable`,
            },
        });
    }
}
