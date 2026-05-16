/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { api_UserProfileHTTPResponse } from '../models/api_UserProfileHTTPResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserProfileService {
    /**
     * Get user profile (user)
     * @returns api_UserProfileHTTPResponse success
     * @throws ApiError
     */
    public static getWebUserProfile(): CancelablePromise<api_UserProfileHTTPResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/web/user-profile',
            errors: {
                404: `user not found`,
                503: `database unavailable`,
            },
        });
    }
}
