/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { data_BaseResponse } from '../models/data_BaseResponse';
import type { data_CreateFinancePaymentRequest } from '../models/data_CreateFinancePaymentRequest';
import type { data_FinancePaymentVO } from '../models/data_FinancePaymentVO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminFinancePaymentService {
    /**
     * Get finance payment list
     * Get a list of finance payments under a finance doc.
     * @param docId Finance doc ID
     * @returns any OK
     * @throws ApiError
     */
    public static getRewardMsV1AdminFinanceDocsFinancePayments(
        docId: string,
    ): CancelablePromise<(data_BaseResponse & {
        data?: Array<data_FinancePaymentVO>;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/reward-ms/v1/admin/finance-docs/{doc_id}/finance-payments',
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
     * Create finance payment
     * Create a finance payment and update project budget total_amount.
     * @param docId Finance doc ID
     * @param body Finance payment payload
     * @returns any OK
     * @throws ApiError
     */
    public static postRewardMsV1AdminFinanceDocsFinancePayments(
        docId: string,
        body: data_CreateFinancePaymentRequest,
    ): CancelablePromise<(data_BaseResponse & {
        data?: data_FinancePaymentVO;
    })> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/reward-ms/v1/admin/finance-docs/{doc_id}/finance-payments',
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
     * Get finance payment
     * Get finance payment detail under a finance doc.
     * @param docId Finance doc ID
     * @param paymentId Finance payment ID
     * @returns any OK
     * @throws ApiError
     */
    public static getRewardMsV1AdminFinanceDocsFinancePayments1(
        docId: string,
        paymentId: string,
    ): CancelablePromise<(data_BaseResponse & {
        data?: data_FinancePaymentVO;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/reward-ms/v1/admin/finance-docs/{doc_id}/finance-payments/{payment_id}',
            path: {
                'doc_id': docId,
                'payment_id': paymentId,
            },
            errors: {
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
}
