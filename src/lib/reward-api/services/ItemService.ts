/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { data_BaseResponse } from '../models/data_BaseResponse';
import type { data_ItemVO } from '../models/data_ItemVO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ItemService {
    /**
     * Item Create
     * Create an item record.
     * @param user Item information
     * @returns any OK
     * @throws ApiError
     */
    public static postRewardMsV1Items(
        user: data_ItemVO,
    ): CancelablePromise<(data_BaseResponse & {
        data?: data_ItemVO;
    })> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/reward-ms/v1/items',
            body: user,
            errors: {
                400: `Bad Request`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Item Query with ID
     * Get item information by item ID.
     * @param itemId Item.ID
     * @returns any OK
     * @throws ApiError
     */
    public static getRewardMsV1Items(
        itemId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/reward-ms/v1/items/{item_id}',
            path: {
                'item_id': itemId,
            },
        });
    }
}
