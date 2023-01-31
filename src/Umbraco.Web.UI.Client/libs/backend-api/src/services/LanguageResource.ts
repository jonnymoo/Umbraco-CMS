/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Language } from '../models/Language';
import type { LanguageCreateModel } from '../models/LanguageCreateModel';
import type { LanguageUpdateModel } from '../models/LanguageUpdateModel';
import type { PagedLanguage } from '../models/PagedLanguage';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class LanguageResource {

    /**
     * @returns PagedLanguage Success
     * @throws ApiError
     */
    public static getLanguage({
        skip,
        take = 100,
    }: {
        skip?: number,
        take?: number,
    }): CancelablePromise<PagedLanguage> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/language',
            query: {
                'skip': skip,
                'take': take,
            },
        });
    }

    /**
     * @returns any Created
     * @throws ApiError
     */
    public static postLanguage({
        requestBody,
    }: {
        requestBody?: LanguageCreateModel,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/umbraco/management/api/v1/language',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
            },
        });
    }

    /**
     * @returns Language Success
     * @throws ApiError
     */
    public static getLanguageByIsoCode({
        isoCode,
    }: {
        isoCode: string,
    }): CancelablePromise<Language> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/language/{isoCode}',
            path: {
                'isoCode': isoCode,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static deleteLanguageByIsoCode({
        isoCode,
    }: {
        isoCode: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/umbraco/management/api/v1/language/{isoCode}',
            path: {
                'isoCode': isoCode,
            },
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
            },
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static putLanguageByIsoCode({
        isoCode,
        requestBody,
    }: {
        isoCode: string,
        requestBody?: LanguageUpdateModel,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/umbraco/management/api/v1/language/{isoCode}',
            path: {
                'isoCode': isoCode,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
            },
        });
    }

}
