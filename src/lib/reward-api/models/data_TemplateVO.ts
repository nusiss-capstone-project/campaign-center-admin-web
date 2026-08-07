/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
export type data_TemplateVO = {
    config?: any;
    created_at?: string;
    id?: number;
    status?: data_TemplateVO.status;
    title?: string;
    type?: data_TemplateVO.type;
    unit?: string;
    updated_at?: string;
    voucher_type?: string;
};
export namespace data_TemplateVO {
    export enum status {
        DRAFT = 'DRAFT',
        PUBLISHED = 'PUBLISHED',
    }
    export enum type {
        FIXED = 'FIXED',
        DYNAMIC = 'DYNAMIC',
    }
}

