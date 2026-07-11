/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { data_ApproveFinanceDocRequest } from '../models/data_ApproveFinanceDocRequest';
import type { data_BaseResponse } from '../models/data_BaseResponse';
import type { data_CreateFinanceDocRequest } from '../models/data_CreateFinanceDocRequest';
import type { data_CreateFinanceDocResponse } from '../models/data_CreateFinanceDocResponse';
import type { data_FinanceDocVO } from '../models/data_FinanceDocVO';
import type { data_PageResult } from '../models/data_PageResult';
import type { data_SubmitFinanceDocRequest } from '../models/data_SubmitFinanceDocRequest';
import type { data_UpdateFinanceDocContentRequest } from '../models/data_UpdateFinanceDocContentRequest';
import type { data_UpdateFinanceDocResponse } from '../models/data_UpdateFinanceDocResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminFinanceDocService {
    /**
     * List finance docs
     * List finance docs for admin users.
     * @param page Page number
     * @param size Page size
     * @returns any OK
     * @throws ApiError
     */
    public static getRewardMsV1AdminFinanceDocs(
        page: number = 1,
        size: number = 20,
    ): CancelablePromise<(data_BaseResponse & {
        data?: data_PageResult;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/reward-ms/v1/admin/finance-docs',
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
     * Create finance doc
     * Create a finance doc for budget application.
     * @param body Finance doc payload
     * @returns any OK
     * @throws ApiError
     */
    public static postRewardMsV1AdminFinanceDocs(
        body: data_CreateFinanceDocRequest,
    ): CancelablePromise<(data_BaseResponse & {
        data?: data_CreateFinanceDocResponse;
    })> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/reward-ms/v1/admin/finance-docs',
            body: body,
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Get finance doc detail
     * Get finance doc detail by doc_id.
     * @param docId Finance doc ID
     * @returns any OK
     * @throws ApiError
     */
    public static getRewardMsV1AdminFinanceDocs1(
        docId: string,
    ): CancelablePromise<(data_BaseResponse & {
        data?: data_FinanceDocVO;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/reward-ms/v1/admin/finance-docs/{doc_id}',
            path: {
                'doc_id': docId,
            },
            errors: {
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Update finance doc
     * Update finance doc description and application_detail in DRAFT or REJECTED status.
     * @param docId Finance doc ID
     * @param body Finance doc payload
     * @returns any OK
     * @throws ApiError
     */
    public static putRewardMsV1AdminFinanceDocs(
        docId: string,
        body: data_UpdateFinanceDocContentRequest,
    ): CancelablePromise<(data_BaseResponse & {
        data?: data_FinanceDocVO;
    })> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/reward-ms/v1/admin/finance-docs/{doc_id}',
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
     * Approve or reject finance doc
     * Move finance doc from TO_APPROVE to APPROVED or REJECTED. When approved, a Kafka event is published to initialize project budget.
     * @param docId Finance doc ID
     * @param body Approval payload
     * @returns any OK
     * @throws ApiError
     */
    public static patchRewardMsV1AdminFinanceDocsApproval(
        docId: string,
        body: data_ApproveFinanceDocRequest,
    ): CancelablePromise<(data_BaseResponse & {
        data?: data_UpdateFinanceDocResponse;
    })> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/reward-ms/v1/admin/finance-docs/{doc_id}/approval',
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
     * Submit finance doc for approval
     * Move finance doc from DRAFT or REJECTED to TO_APPROVE.
     * @param docId Finance doc ID
     * @param body Submit payload
     * @returns any OK
     * @throws ApiError
     */
    public static patchRewardMsV1AdminFinanceDocsSubmission(
        docId: string,
        body?: data_SubmitFinanceDocRequest,
    ): CancelablePromise<(data_BaseResponse & {
        data?: data_UpdateFinanceDocResponse;
    })> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/reward-ms/v1/admin/finance-docs/{doc_id}/submission',
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
}
