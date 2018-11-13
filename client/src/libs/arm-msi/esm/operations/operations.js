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
import * as Mappers from "../models/operationsMappers";
import * as Parameters from "../models/parameters";
/** Class representing a Operations. */
var Operations = /** @class */ (function () {
    /**
     * Create a Operations.
     * @param {ManagedServiceIdentityClientContext} client Reference to the service client.
     */
    function Operations(client) {
        this.client = client;
    }
    Operations.prototype.list = function (options, callback) {
        return this.client.sendOperationRequest({
            options: options
        }, listOperationSpec, callback);
    };
    Operations.prototype.listNext = function (nextPageLink, options, callback) {
        return this.client.sendOperationRequest({
            nextPageLink: nextPageLink,
            options: options
        }, listNextOperationSpec, callback);
    };
    return Operations;
}());
export { Operations };
// Operation Specifications
var serializer = new msRest.Serializer(Mappers);
var listOperationSpec = {
    httpMethod: "GET",
    path: "providers/Microsoft.ManagedIdentity/operations",
    queryParameters: [
        Parameters.apiVersion
    ],
    headerParameters: [
        Parameters.acceptLanguage
    ],
    responses: {
        200: {
            bodyMapper: Mappers.OperationListResult
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
            bodyMapper: Mappers.OperationListResult
        },
        default: {
            bodyMapper: Mappers.CloudError
        }
    },
    serializer: serializer
};
//# sourceMappingURL=operations.js.map