/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { data_ApproveIssueRequestRequest } from '../models/data_ApproveIssueRequestRequest';
import type { data_BaseResponse } from '../models/data_BaseResponse';
import type { data_CreateIssueRequestRequest } from '../models/data_CreateIssueRequestRequest';
import type { data_IssueRequestVO } from '../models/data_IssueRequestVO';
import type { data_PageResult } from '../models/data_PageResult';
import type { data_SubmitIssueRequestRequest } from '../models/data_SubmitIssueRequestRequest';
import type { data_UpdateIssueRequestRequest } from '../models/data_UpdateIssueRequestRequest';
import type { data_UpdateIssueRequestResponse } from '../models/data_UpdateIssueRequestResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminIssueRequestService {
    /**
     * List issue requests
     * List issue requests for a finance doc.
     * @param docId Finance doc ID
     * @param page Page number
     * @param size Page size
     * @returns any OK
     * @throws ApiError
     */
    public static getRewardMsV1AdminFinanceDocsIssueRequests(
        docId: string,
        page: number = 1,
        size: number = 20,
    ): CancelablePromise<(data_BaseResponse & {
        data?: data_PageResult;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/reward-ms/v1/admin/finance-docs/{doc_id}/issue-requests',
            path: {
                'doc_id': docId,
            },
            query: {
                'page': page,
                'size': size,
            },
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Create issue request
     * Create an issue request for campaign budget allocation.
     * @param docId Finance doc ID
     * @param body Issue request payload
     * @returns any OK
     * @throws ApiError
     */
    public static postRewardMsV1AdminFinanceDocsIssueRequests(
        docId: string,
        body: data_CreateIssueRequestRequest,
    ): CancelablePromise<(data_BaseResponse & {
        data?: data_IssueRequestVO;
    })> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/reward-ms/v1/admin/finance-docs/{doc_id}/issue-requests',
            path: {
                'doc_id': docId,
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
     * Update issue request
     * Update issue request amount, voucher_type and unit in DRAFT or REJECTED status.
     * @param docId Finance doc ID
     * @param issueRequestId Issue request ID
     * @param body Issue request payload
     * @returns any OK
     * @throws ApiError
     */
    public static putRewardMsV1AdminFinanceDocsIssueRequests(
        docId: string,
        issueRequestId: number,
        body: data_UpdateIssueRequestRequest,
    ): CancelablePromise<(data_BaseResponse & {
        data?: data_IssueRequestVO;
    })> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/reward-ms/v1/admin/finance-docs/{doc_id}/issue-requests/{issue_request_id}',
            path: {
                'doc_id': docId,
                'issue_request_id': issueRequestId,
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
     * Approve or reject issue request
     * Approve or reject issue request and publish budget update event.
     * @param docId Finance doc ID
     * @param issueRequestId Issue request ID
     * @param body Approval payload
     * @returns any OK
     * @throws ApiError
     */
    public static patchRewardMsV1AdminFinanceDocsIssueRequestsApproval(
        docId: string,
        issueRequestId: number,
        body: data_ApproveIssueRequestRequest,
    ): CancelablePromise<(data_BaseResponse & {
        data?: data_UpdateIssueRequestResponse;
    })> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/reward-ms/v1/admin/finance-docs/{doc_id}/issue-requests/{issue_request_id}/approval',
            path: {
                'doc_id': docId,
                'issue_request_id': issueRequestId,
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
     * Submit issue request
     * Submit issue request and publish budget withhold event.
     * @param docId Finance doc ID
     * @param issueRequestId Issue request ID
     * @param body Submit payload
     * @returns any OK
     * @throws ApiError
     */
    public static patchRewardMsV1AdminFinanceDocsIssueRequestsSubmission(
        docId: string,
        issueRequestId: number,
        body: data_SubmitIssueRequestRequest,
    ): CancelablePromise<(data_BaseResponse & {
        data?: data_UpdateIssueRequestResponse;
    })> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/reward-ms/v1/admin/finance-docs/{doc_id}/issue-requests/{issue_request_id}/submission',
            path: {
                'doc_id': docId,
                'issue_request_id': issueRequestId,
            },
            body: body,
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
}
