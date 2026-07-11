/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { data_BaseResponse } from '../models/data_BaseResponse';
import type { data_CreateProjectRequest } from '../models/data_CreateProjectRequest';
import type { data_CreateProjectResponse } from '../models/data_CreateProjectResponse';
import type { data_PageResult } from '../models/data_PageResult';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminProjectService {
    /**
     * List projects
     * List reward projects with page and size.
     * @param page Page number
     * @param size Page size
     * @returns any OK
     * @throws ApiError
     */
    public static getRewardMsV1AdminProjects(
        page: number = 1,
        size: number = 20,
    ): CancelablePromise<(data_BaseResponse & {
        data?: data_PageResult;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/reward-ms/v1/admin/projects',
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
     * Create project
     * Create a reward project.
     * @param body Project payload
     * @returns any OK
     * @throws ApiError
     */
    public static postRewardMsV1AdminProjects(
        body: data_CreateProjectRequest,
    ): CancelablePromise<(data_BaseResponse & {
        data?: data_CreateProjectResponse;
    })> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/reward-ms/v1/admin/projects',
            body: body,
            errors: {
                400: `Bad Request`,
                500: `Internal Server Error`,
            },
        });
    }
}
