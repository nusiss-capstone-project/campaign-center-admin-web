/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { data_TemplateConfigBody } from './data_TemplateConfigBody';
export type data_CreateTemplateRequestSwagger = {
    config?: data_TemplateConfigBody;
    type?: data_CreateTemplateRequestSwagger.type;
    unit?: string;
    voucher_type?: string;
};
export namespace data_CreateTemplateRequestSwagger {
    export enum type {
        FIXED = 'FIXED',
        DYNAMIC = 'DYNAMIC',
    }
}

