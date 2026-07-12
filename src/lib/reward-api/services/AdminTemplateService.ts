/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { data_BaseResponse } from '../models/data_BaseResponse';
import type { data_CreateTemplateRequestSwagger } from '../models/data_CreateTemplateRequestSwagger';
import type { data_CreateTemplateResponse } from '../models/data_CreateTemplateResponse';
import type { data_PageResult } from '../models/data_PageResult';
import type { data_PublishTemplateResponse } from '../models/data_PublishTemplateResponse';
import type { data_TemplateConfigSchemaRef } from '../models/data_TemplateConfigSchemaRef';
import type { data_TemplateVOSwagger } from '../models/data_TemplateVOSwagger';
import type { data_UpdateTemplateRequestSwagger } from '../models/data_UpdateTemplateRequestSwagger';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminTemplateService {
    /**
     * List templates
     * List reward templates for campaign ops. Each item config follows template type; see TemplateVOSwagger and TemplateConfigSchemaRef.
     * @param page Page number
     * @param size Page size
     * @returns any OK
     * @throws ApiError
     */
    public static getRewardMsV1AdminTemplates(
        page: number = 1,
        size: number = 20,
    ): CancelablePromise<(data_BaseResponse & {
        data?: (data_PageResult & {
            items?: Array<data_TemplateVOSwagger>;
        });
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/reward-ms/v1/admin/templates',
            query: {
                'page': page,
                'size': size,
            },
            errors: {
                400: `Bad Request`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Create template
     * Create a reward template for campaign ops. Config schema depends on type: FIXED uses FixTemplateConfigVO (amount); DYNAMIC uses DynamicTemplateConfigVO (base_metric, rate, optional cap). See CreateFixedTemplateRequestSwagger / CreateDynamicTemplateRequestSwagger and TemplateConfigSchemaRef definitions for examples.
     * @param body Template payload
     * @returns any OK
     * @throws ApiError
     */
    public static postRewardMsV1AdminTemplates(
        body: data_CreateTemplateRequestSwagger,
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
     * Template config schemas
     * Reference endpoint documenting FixTemplateConfigVO and DynamicTemplateConfigVO shapes.
     * @returns any OK
     * @throws ApiError
     */
    public static getRewardMsV1AdminTemplatesConfigSchemas(): CancelablePromise<(data_BaseResponse & {
        data?: data_TemplateConfigSchemaRef;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/reward-ms/v1/admin/templates/config-schemas',
        });
    }
    /**
     * Update template
     * Update template config in DRAFT status only. Config schema follows template type: FIXED uses amount; DYNAMIC uses base_metric, rate and optional cap.
     * @param templateId Template ID
     * @param body Template config payload
     * @returns any OK
     * @throws ApiError
     */
    public static putRewardMsV1AdminTemplates(
        templateId: number,
        body: data_UpdateTemplateRequestSwagger,
    ): CancelablePromise<(data_BaseResponse & {
        data?: data_TemplateVOSwagger;
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
