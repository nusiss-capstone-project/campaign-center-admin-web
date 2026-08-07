/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { data_BaseResponse } from '../models/data_BaseResponse';
import type { data_CreateUserGroupRequest } from '../models/data_CreateUserGroupRequest';
import type { data_UpdateUserGroupRequest } from '../models/data_UpdateUserGroupRequest';
import type { data_UserGroupCountVO } from '../models/data_UserGroupCountVO';
import type { data_UserGroupListResponse } from '../models/data_UserGroupListResponse';
import type { data_UserGroupStatusVO } from '../models/data_UserGroupStatusVO';
import type { data_UserGroupVO } from '../models/data_UserGroupVO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminService {
    /**
     * List user groups
     * @param page page
     * @param pageSize page size
     * @param status status
     * @param usergroupId user group id
     * @returns any OK
     * @throws ApiError
     */
    public static getUsergroupMsV1AdminUsergroups(
        page?: number,
        pageSize?: number,
        status?: string,
        usergroupId?: number,
    ): CancelablePromise<(data_BaseResponse & {
        data?: data_UserGroupListResponse;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/usergroup-ms/v1/admin/usergroups',
            query: {
                'page': page,
                'pageSize': pageSize,
                'status': status,
                'usergroup_id': usergroupId,
            },
        });
    }
    /**
     * Create user group
     * @param body create payload
     * @returns any OK
     * @throws ApiError
     */
    public static postUsergroupMsV1AdminUsergroups(
        body: data_CreateUserGroupRequest,
    ): CancelablePromise<(data_BaseResponse & {
        data?: data_UserGroupVO;
    })> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/usergroup-ms/v1/admin/usergroups',
            body: body,
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * Get user group
     * @param userGroupId user group id
     * @returns any OK
     * @throws ApiError
     */
    public static getUsergroupMsV1AdminUsergroups1(
        userGroupId: number,
    ): CancelablePromise<(data_BaseResponse & {
        data?: data_UserGroupVO;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/usergroup-ms/v1/admin/usergroups/{user_group_id}',
            path: {
                'user_group_id': userGroupId,
            },
        });
    }
    /**
     * Update user group
     * @param userGroupId user group id
     * @param body update payload
     * @returns any OK
     * @throws ApiError
     */
    public static putUsergroupMsV1AdminUsergroups(
        userGroupId: number,
        body: data_UpdateUserGroupRequest,
    ): CancelablePromise<(data_BaseResponse & {
        data?: data_UserGroupVO;
    })> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/usergroup-ms/v1/admin/usergroups/{user_group_id}',
            path: {
                'user_group_id': userGroupId,
            },
            body: body,
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * Estimate user group size
     * @param userGroupId user group id
     * @returns any OK
     * @throws ApiError
     */
    public static getUsergroupMsV1AdminUsergroupsCount(
        userGroupId: number,
    ): CancelablePromise<(data_BaseResponse & {
        data?: data_UserGroupCountVO;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/usergroup-ms/v1/admin/usergroups/{user_group_id}/count',
            path: {
                'user_group_id': userGroupId,
            },
        });
    }
    /**
     * Offline user group
     * @param userGroupId user group id
     * @returns any OK
     * @throws ApiError
     */
    public static postUsergroupMsV1AdminUsergroupsOffline(
        userGroupId: number,
    ): CancelablePromise<(data_BaseResponse & {
        data?: data_UserGroupStatusVO;
    })> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/usergroup-ms/v1/admin/usergroups/{user_group_id}/offline',
            path: {
                'user_group_id': userGroupId,
            },
        });
    }
    /**
     * Publish user group
     * @param userGroupId user group id
     * @returns any OK
     * @throws ApiError
     */
    public static postUsergroupMsV1AdminUsergroupsPublish(
        userGroupId: number,
    ): CancelablePromise<(data_BaseResponse & {
        data?: data_UserGroupStatusVO;
    })> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/usergroup-ms/v1/admin/usergroups/{user_group_id}/publish',
            path: {
                'user_group_id': userGroupId,
            },
        });
    }
}
