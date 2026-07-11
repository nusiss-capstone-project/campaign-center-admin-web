/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { data_BaseResponse } from '../models/data_BaseResponse';
import type { data_PaymentConfigVO } from '../models/data_PaymentConfigVO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminPaymentConfigService {
    /**
     * List payment configs
     * List payment address and account options for finance doc creation.
     * @returns any OK
     * @throws ApiError
     */
    public static getRewardMsV1AdminPaymentConfigs(): CancelablePromise<(data_BaseResponse & {
        data?: Array<data_PaymentConfigVO>;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/reward-ms/v1/admin/payment-configs',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
}
