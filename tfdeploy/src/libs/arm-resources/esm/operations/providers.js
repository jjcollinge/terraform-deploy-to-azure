/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
 */
import * as msRest from "ms-rest-js";
import * as Mappers from "../models/providersMappers";
import * as Parameters from "../models/parameters";
/** Class representing a Providers. */
var Providers = /** @class */ (function () {
    /**
     * Create a Providers.
     * @param {ResourceManagementClientContext} client Reference to the service client.
     */
    function Providers(client) {
        this.client = client;
    }
    Providers.prototype.unregister = function (resourceProviderNamespace, options, callback) {
        return this.client.sendOperationRequest({
            resourceProviderNamespace: resourceProviderNamespace,
            options: options
        }, unregisterOperationSpec, callback);
    };
    Providers.prototype.register = function (resourceProviderNamespace, options, callback) {
        return this.client.sendOperationRequest({
            resourceProviderNamespace: resourceProviderNamespace,
            options: options
        }, registerOperationSpec, callback);
    };
    Providers.prototype.list = function (options, callback) {
        return this.client.sendOperationRequest({
            options: options
        }, listOperationSpec, callback);
    };
    Providers.prototype.get = function (resourceProviderNamespace, options, callback) {
        return this.client.sendOperationRequest({
            resourceProviderNamespace: resourceProviderNamespace,
            options: options
        }, getOperationSpec, callback);
    };
    Providers.prototype.listNext = function (nextPageLink, options, callback) {
        return this.client.sendOperationRequest({
            nextPageLink: nextPageLink,
            options: options
        }, listNextOperationSpec, callback);
    };
    return Providers;
}());
export { Providers };
// Operation Specifications
var serializer = new msRest.Serializer(Mappers);
var unregisterOperationSpec = {
    httpMethod: "POST",
    path: "subscriptions/{subscriptionId}/providers/{resourceProviderNamespace}/unregister",
    urlParameters: [
        Parameters.resourceProviderNamespace,
        Parameters.subscriptionId
    ],
    queryParameters: [
        Parameters.apiVersion
    ],
    headerParameters: [
        Parameters.acceptLanguage
    ],
    responses: {
        200: {
            bodyMapper: Mappers.Provider
        },
        default: {
            bodyMapper: Mappers.CloudError
        }
    },
    serializer: serializer
};
var registerOperationSpec = {
    httpMethod: "POST",
    path: "subscriptions/{subscriptionId}/providers/{resourceProviderNamespace}/register",
    urlParameters: [
        Parameters.resourceProviderNamespace,
        Parameters.subscriptionId
    ],
    queryParameters: [
        Parameters.apiVersion
    ],
    headerParameters: [
        Parameters.acceptLanguage
    ],
    responses: {
        200: {
            bodyMapper: Mappers.Provider
        },
        default: {
            bodyMapper: Mappers.CloudError
        }
    },
    serializer: serializer
};
var listOperationSpec = {
    httpMethod: "GET",
    path: "subscriptions/{subscriptionId}/providers",
    urlParameters: [
        Parameters.subscriptionId
    ],
    queryParameters: [
        Parameters.top,
        Parameters.expand,
        Parameters.apiVersion
    ],
    headerParameters: [
        Parameters.acceptLanguage
    ],
    responses: {
        200: {
            bodyMapper: Mappers.ProviderListResult
        },
        default: {
            bodyMapper: Mappers.CloudError
        }
    },
    serializer: serializer
};
var getOperationSpec = {
    httpMethod: "GET",
    path: "subscriptions/{subscriptionId}/providers/{resourceProviderNamespace}",
    urlParameters: [
        Parameters.resourceProviderNamespace,
        Parameters.subscriptionId
    ],
    queryParameters: [
        Parameters.expand,
        Parameters.apiVersion
    ],
    headerParameters: [
        Parameters.acceptLanguage
    ],
    responses: {
        200: {
            bodyMapper: Mappers.Provider
        },
        default: {
            bodyMapper: Mappers.CloudError
        }
    },
    serializer: serializer
};
var listNextOperationSpec = {
    httpMethod: "GET",
    baseUrl: "https://management.azure.com",
    path: "{nextLink}",
    urlParameters: [
        Parameters.nextPageLink
    ],
    headerParameters: [
        Parameters.acceptLanguage
    ],
    responses: {
        200: {
            bodyMapper: Mappers.ProviderListResult
        },
        default: {
            bodyMapper: Mappers.CloudError
        }
    },
    serializer: serializer
};
//# sourceMappingURL=providers.js.map