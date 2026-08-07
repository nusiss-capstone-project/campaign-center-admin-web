/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
export type data_CreateTemplateRequest = {
    config: Record<string, any>;
    title: string;
    type: data_CreateTemplateRequest.type;
    unit: string;
    voucher_type: string;
};
export namespace data_CreateTemplateRequest {
    export enum type {
        FIXED = 'FIXED',
        DYNAMIC = 'DYNAMIC',
    }
}

