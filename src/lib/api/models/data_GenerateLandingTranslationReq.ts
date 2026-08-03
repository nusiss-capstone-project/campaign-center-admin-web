/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { data_LandingPageRepeatableItemVO } from './data_LandingPageRepeatableItemVO';
export type data_GenerateLandingTranslationReq = {
    description?: string;
    faq?: Array<data_LandingPageRepeatableItemVO>;
    sourceLang: string;
    steps?: Array<data_LandingPageRepeatableItemVO>;
    targetLang: string;
    terms?: string;
    title?: string;
};

