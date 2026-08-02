/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { data_GenerateLandingTranslationData } from '../models/data_GenerateLandingTranslationData';
import type { data_GenerateLandingTranslationReq } from '../models/data_GenerateLandingTranslationReq';
import type { data_LandingPageBody } from '../models/data_LandingPageBody';
import type { data_LandingPageCreateResp } from '../models/data_LandingPageCreateResp';
import type { data_LandingPageDetailVO } from '../models/data_LandingPageDetailVO';
import type { data_LandingPageListData } from '../models/data_LandingPageListData';
import type { data_LandingPagePublishResp } from '../models/data_LandingPagePublishResp';
import type { data_LandingPageTranslatedLangsData } from '../models/data_LandingPageTranslatedLangsData';
import type { data_LandingPageUpdateResp } from '../models/data_LandingPageUpdateResp';
import type { data_PublishOperatorReq } from '../models/data_PublishOperatorReq';
import type { data_PutLandingTranslationData } from '../models/data_PutLandingTranslationData';
import type { data_PutLandingTranslationReq } from '../models/data_PutLandingTranslationReq';
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
     * @returns any success
     * @throws ApiError
     */
    public static getAdminLandingPages(
        page?: number,
        pageSize?: number,
        status?: number,
        defaultLang?: string,
    ): CancelablePromise<(data_StandardResponse & {
        data?: data_LandingPageListData;
    })> {
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
     * @returns any success
     * @throws ApiError
     */
    public static postAdminLandingPages(
        body: data_LandingPageBody,
    ): CancelablePromise<(data_StandardResponse & {
        data?: data_LandingPageCreateResp;
    })> {
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
     * @returns any success
     * @throws ApiError
     */
    public static getAdminLandingPages1(
        landingPageId: number,
        lang?: string,
    ): CancelablePromise<(data_StandardResponse & {
        data?: data_LandingPageDetailVO;
    })> {
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
     * @returns any success
     * @throws ApiError
     */
    public static putAdminLandingPages(
        landingPageId: number,
        body: data_LandingPageBody,
    ): CancelablePromise<(data_StandardResponse & {
        data?: data_LandingPageUpdateResp;
    })> {
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
     * @param landingPageId Landing page ID
     * @param lang Locale tag, e.g. ja, zh-CN
     * @returns any success
     * @throws ApiError
     */
    public static getAdminLandingPagesDetail(
        landingPageId: number,
        lang: string,
    ): CancelablePromise<(data_StandardResponse & {
        data?: data_LandingPageDetailVO;
    })> {
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
     * @returns any success
     * @throws ApiError
     */
    public static postAdminLandingPagesPublish(
        landingPageId: number,
        body: data_PublishOperatorReq,
    ): CancelablePromise<(data_StandardResponse & {
        data?: data_LandingPagePublishResp;
    })> {
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
     * @param landingPageId Landing page ID
     * @returns any success
     * @throws ApiError
     */
    public static getAdminLandingPagesTranslations(
        landingPageId: number,
    ): CancelablePromise<(data_StandardResponse & {
        data?: data_LandingPageTranslatedLangsData;
    })> {
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
     * Returns LLM-translated title/description/terms/steps/faq. Does not persist.
     * @param landingPageId Landing page ID
     * @param body Source/target languages and optional source copy
     * @returns any success
     * @throws ApiError
     */
    public static postAdminLandingPagesTranslationsGenerate(
        landingPageId: number,
        body: data_GenerateLandingTranslationReq,
    ): CancelablePromise<(data_StandardResponse & {
        data?: data_GenerateLandingTranslationData;
    })> {
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
     * @param landingPageId Landing page ID
     * @param lang BCP-47 or short language tag, e.g. ja, zh-CN
     * @param body Translated fields
     * @returns any success
     * @throws ApiError
     */
    public static putAdminLandingPagesTranslations(
        landingPageId: number,
        lang: string,
        body: data_PutLandingTranslationReq,
    ): CancelablePromise<(data_StandardResponse & {
        data?: data_PutLandingTranslationData;
    })> {
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
