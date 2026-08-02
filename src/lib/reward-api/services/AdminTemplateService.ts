/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { data_BaseResponse } from '../models/data_BaseResponse';
import type { data_CreateTemplateRequest } from '../models/data_CreateTemplateRequest';
import type { data_CreateTemplateResponse } from '../models/data_CreateTemplateResponse';
import type { data_PageResult } from '../models/data_PageResult';
import type { data_PublishTemplateResponse } from '../models/data_PublishTemplateResponse';
import type { data_TemplateVO } from '../models/data_TemplateVO';
import type { data_UpdateTemplateRequest } from '../models/data_UpdateTemplateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminTemplateService {
    /**
     * List templates
     * List reward templates for campaign ops. Each item config is FixTemplateConfigVO or DynamicTemplateConfigVO based on type. Optional status filter: DRAFT or PUBLISHED.
     * @param page Page number
     * @param size Page size
     * @param status Template status filter
     * @returns any OK
     * @throws ApiError
     */
    public static getRewardMsV1AdminTemplates(
        page: number = 1,
        size: number = 20,
        status?: 'DRAFT' | 'PUBLISHED',
    ): CancelablePromise<(data_BaseResponse & {
        data?: (data_PageResult & {
            items?: Array<data_TemplateVO>;
        });
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/reward-ms/v1/admin/templates',
            query: {
                'page': page,
                'size': size,
                'status': status,
            },
            errors: {
                400: `Bad Request`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Create template
     * Create a reward template for campaign ops. When type=FIXED, config is FixTemplateConfigVO (amount only); when type=DYNAMIC, config is DynamicTemplateConfigVO (base_metric, rate, optional cap).
     * @param body Template payload
     * @returns any OK
     * @throws ApiError
     */
    public static postRewardMsV1AdminTemplates(
        body: data_CreateTemplateRequest,
    ): CancelablePromise<(data_BaseResponse & {
        data?: data_CreateTemplateResponse;
    })> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/reward-ms/v1/admin/templates',
            body: body,
            errors: {
                400: `Bad Request`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Update template
     * Update template config in DRAFT status only. When type=FIXED, config is FixTemplateConfigVO; when type=DYNAMIC, config is DynamicTemplateConfigVO.
     * @param templateId Template ID
     * @param body Template config payload
     * @returns any OK
     * @throws ApiError
     */
    public static putRewardMsV1AdminTemplates(
        templateId: number,
        body: data_UpdateTemplateRequest,
    ): CancelablePromise<(data_BaseResponse & {
        data?: data_TemplateVO;
    })> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/reward-ms/v1/admin/templates/{template_id}',
            path: {
                'template_id': templateId,
            },
            body: body,
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Publish template
     * Move template from DRAFT to PUBLISHED.
     * @param templateId Template ID
     * @returns any OK
     * @throws ApiError
     */
    public static putRewardMsV1AdminTemplatesPublish(
        templateId: number,
    ): CancelablePromise<(data_BaseResponse & {
        data?: data_PublishTemplateResponse;
    })> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/reward-ms/v1/admin/templates/{template_id}/publish',
            path: {
                'template_id': templateId,
            },
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
}
