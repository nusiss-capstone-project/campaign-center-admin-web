/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { data_TemplateConfigBody } from './data_TemplateConfigBody';
export type data_TemplateVOSwagger = {
    config?: data_TemplateConfigBody;
    created_at?: string;
    id?: number;
    status?: data_TemplateVOSwagger.status;
    type?: data_TemplateVOSwagger.type;
    unit?: string;
    updated_at?: string;
    voucher_type?: string;
};
export namespace data_TemplateVOSwagger {
    export enum status {
        DRAFT = 'DRAFT',
        PUBLISHED = 'PUBLISHED',
    }
    export enum type {
        FIXED = 'FIXED',
        DYNAMIC = 'DYNAMIC',
    }
}

