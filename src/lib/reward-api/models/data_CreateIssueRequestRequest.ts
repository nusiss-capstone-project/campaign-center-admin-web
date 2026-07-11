/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type data_CreateIssueRequestRequest = {
    amount: string;
    creator?: string;
    expense_type: data_CreateIssueRequestRequest.expense_type;
    remark?: string;
    unit: string;
    voucher_type: string;
};
export namespace data_CreateIssueRequestRequest {
    export enum expense_type {
        REFUND = 'REFUND',
        REWARD = 'REWARD',
        OTHERS = 'OTHERS',
    }
}

