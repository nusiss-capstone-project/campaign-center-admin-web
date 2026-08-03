/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { data_ImageUploadData } from '../models/data_ImageUploadData';
import type { data_StandardResponse } from '../models/data_StandardResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminImagesService {
    /**
     * Upload image (admin)
     * @param file Image file (jpg/png/webp/gif, max 5MB)
     * @returns any success
     * @throws ApiError
     */
    public static postAdminImagesUpload(
        file: Blob,
    ): CancelablePromise<(data_StandardResponse & {
        data?: data_ImageUploadData;
    })> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/images/upload',
            formData: {
                'file': file,
            },
            errors: {
                400: `validation error`,
                500: `internal error`,
                503: `oss not configured`,
            },
        });
    }
}
