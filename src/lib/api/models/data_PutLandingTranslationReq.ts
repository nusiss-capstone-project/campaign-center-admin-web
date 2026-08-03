/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { data_LandingPageRepeatableItemVO } from './data_LandingPageRepeatableItemVO';
export type data_PutLandingTranslationReq = {
    description: string;
    faq?: Array<data_LandingPageRepeatableItemVO>;
    operator?: string;
    steps?: Array<data_LandingPageRepeatableItemVO>;
    terms: string;
    title: string;
};

