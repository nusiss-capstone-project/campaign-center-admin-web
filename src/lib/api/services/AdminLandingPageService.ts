/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { api_GenerateLandingTranslationHTTPResponse } from '../models/api_GenerateLandingTranslationHTTPResponse';
import type { api_GenerateLandingTranslationReq } from '../models/api_GenerateLandingTranslationReq';
import type { api_LandingPageBody } from '../models/api_LandingPageBody';
import type { api_LandingPageLocaleDetailHTTPResponse } from '../models/api_LandingPageLocaleDetailHTTPResponse';
import type { api_LandingPageTranslatedLangsHTTPResponse } from '../models/api_LandingPageTranslatedLangsHTTPResponse';
import type { api_PublishOperatorReq } from '../models/api_PublishOperatorReq';
import type { api_PutLandingTranslationHTTPResponse } from '../models/api_PutLandingTranslationHTTPResponse';
import type { api_PutLandingTranslationReq } from '../models/api_PutLandingTranslationReq';
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
     * @param defaultLang Default language filter e.g. en
     * @returns data_StandardResponse success
     * @throws ApiError
     */
    public static getAdminLandingPages(
        page?: number,
        pageSize?: number,
        status?: number,
        defaultLang?: string,
    ): CancelablePromise<data_StandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/landing-pages',
            query: {
                'page': page,
                'pageSize': pageSize,
                'status': status,
                'defaultLang': defaultLang,
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
     * @param lang Requested language (falls back to default)
     * @returns data_StandardResponse success
     * @throws ApiError
     */
    public static getAdminLandingPages1(
        landingPageId: number,
        lang?: string,
    ): CancelablePromise<data_StandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/landing-pages/{landingPageId}',
            path: {
                'landingPageId': landingPageId,
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
     * Get landing page detail by locale (admin)
     * title/description/terms come from campaign_landing_page_translations when a row exists for lang; otherwise from campaign_landing_pages. bannerImageUrl, status, timestamps always from campaign_landing_pages.
     * @param landingPageId Landing page ID
     * @param lang Locale tag, e.g. ja, zh-CN
     * @returns api_LandingPageLocaleDetailHTTPResponse success
     * @throws ApiError
     */
    public static getAdminLandingPagesDetail(
        landingPageId: number,
        lang: string,
    ): CancelablePromise<api_LandingPageLocaleDetailHTTPResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/landing-pages/{landingPageId}/detail/{lang}',
            path: {
                'landingPageId': landingPageId,
                'lang': lang,
            },
            errors: {
                400: `invalid path`,
                404: `not found`,
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
    /**
     * List translated locales for a landing page (admin)
     * Distinct lang values from the translation table only (excludes default_lang unless a translation row exists).
     * @param landingPageId Landing page ID
     * @returns api_LandingPageTranslatedLangsHTTPResponse success
     * @throws ApiError
     */
    public static getAdminLandingPagesTranslations(
        landingPageId: number,
    ): CancelablePromise<api_LandingPageTranslatedLangsHTTPResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/landing-pages/{landingPageId}/translations',
            path: {
                'landingPageId': landingPageId,
            },
            errors: {
                400: `invalid path`,
                404: `landing page not found`,
                503: `database unavailable`,
            },
        });
    }
    /**
     * Generate landing page translation preview (admin)
     * Returns LLM-translated title/description/terms for the given landing page. Does not persist.
     * @param landingPageId Landing page ID
     * @param body Source/target languages and optional source copy (falls back to landing page fields when empty)
     * @returns api_GenerateLandingTranslationHTTPResponse success
     * @throws ApiError
     */
    public static postAdminLandingPagesTranslationsGenerate(
        landingPageId: number,
        body: api_GenerateLandingTranslationReq,
    ): CancelablePromise<api_GenerateLandingTranslationHTTPResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/landing-pages/{landingPageId}/translations/generate',
            path: {
                'landingPageId': landingPageId,
            },
            body: body,
            errors: {
                400: `validation or empty source`,
                404: `landing page not found`,
                500: `internal error`,
                503: `OpenAI not configured or database unavailable`,
            },
        });
    }
    /**
     * Upsert landing page translation (admin)
     * Creates or updates campaign_landing_page_translations for the given landing page and language code.
     * @param landingPageId Landing page ID
     * @param lang BCP-47 or short language tag, e.g. ja, zh-CN
     * @param body Translated fields
     * @returns api_PutLandingTranslationHTTPResponse success
     * @throws ApiError
     */
    public static putAdminLandingPagesTranslations(
        landingPageId: number,
        lang: string,
        body: api_PutLandingTranslationReq,
    ): CancelablePromise<api_PutLandingTranslationHTTPResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/landing-pages/{landingPageId}/translations/{lang}',
            path: {
                'landingPageId': landingPageId,
                'lang': lang,
            },
            body: body,
            errors: {
                400: `validation error`,
                404: `landing page not found`,
                500: `internal error`,
                503: `database unavailable`,
            },
        });
    }
}
