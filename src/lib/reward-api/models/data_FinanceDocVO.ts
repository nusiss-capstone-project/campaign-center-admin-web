/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { data_ApplicationDetailItemVO } from './data_ApplicationDetailItemVO';
import type { data_ProjectVO } from './data_ProjectVO';
export type data_FinanceDocVO = {
    application_detail?: Array<data_ApplicationDetailItemVO>;
    created_at?: string;
    creator?: string;
    description?: string;
    doc_id?: string;
    project?: data_ProjectVO;
    project_id?: number;
    remark?: string;
    status?: string;
    updated_at?: string;
};

