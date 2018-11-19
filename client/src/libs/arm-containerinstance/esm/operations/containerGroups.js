/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
 */
import * as tslib_1 from "tslib";
import * as msRest from "ms-rest-js";
import * as Mappers from "../models/containerGroupsMappers";
import * as Parameters from "../models/parameters";
/** Class representing a ContainerGroups. */
var ContainerGroups = /** @class */ (function () {
    /**
     * Create a ContainerGroups.
     * @param {ContainerInstanceManagementClientContext} client Reference to the service client.
     */
    function ContainerGroups(client) {
        this.client = client;
    }
    ContainerGroups.prototype.list = function (options, callback) {
        return this.client.sendOperationRequest({
            options: options
        }, listOperationSpec, callback);
    };
    ContainerGroups.prototype.listByResourceGroup = function (resourceGroupName, options, callback) {
        return this.client.sendOperationRequest({
            resourceGroupName: resourceGroupName,
            options: options
        }, listByResourceGroupOperationSpec, callback);
    };
    ContainerGroups.prototype.get = function (resourceGroupName, containerGroupName, options, callback) {
        return this.client.sendOperationRequest({
            resourceGroupName: resourceGroupName,
            containerGroupName: containerGroupName,
            options: options
        }, getOperationSpec, callback);
    };
    /**
     * Create or update container groups with specified configurations.
     * @summary Create or update container groups.
     * @param resourceGroupName The name of the resource group.
     * @param containerGroupName The name of the container group.
     * @param containerGroup The properties of the container group to be created or updated.
     * @param [options] The optional parameters
     * @returns Promise<Models.ContainerGroupsCreateOrUpdateResponse>
     */
    ContainerGroups.prototype.createOrUpdate = function (resourceGroupName, containerGroupName, containerGroup, options) {
        return this.beginCreateOrUpdate(resourceGroupName, containerGroupName, containerGroup, options)
            .then(function (lroPoller) { return lroPoller.pollUntilFinished(); });
    };
    ContainerGroups.prototype.update = function (resourceGroupName, containerGroupName, resource, options, callback) {
        return this.client.sendOperationRequest({
            resourceGroupName: resourceGroupName,
            containerGroupName: containerGroupName,
            resource: resource,
            options: options
        }, updateOperationSpec, callback);
    };
    ContainerGroups.prototype.deleteMethod = function (resourceGroupName, containerGroupName, options, callback) {
        return this.client.sendOperationRequest({
            resourceGroupName: resourceGroupName,
            containerGroupName: containerGroupName,
            options: options
        }, deleteMethodOperationSpec, callback);
    };
    /**
     * Restarts all containers in a container group in place. If container image has updates, new image
     * will be downloaded.
     * @summary Restarts all containers in a container group.
     * @param resourceGroupName The name of the resource group.
     * @param containerGroupName The name of the container group.
     * @param [options] The optional parameters
     * @returns Promise<msRest.RestResponse>
     */
    ContainerGroups.prototype.restart = function (resourceGroupName, containerGroupName, options) {
        return this.beginRestart(resourceGroupName, containerGroupName, options)
            .then(function (lroPoller) { return lroPoller.pollUntilFinished(); });
    };
    ContainerGroups.prototype.stop = function (resourceGroupName, containerGroupName, options, callback) {
        return this.client.sendOperationRequest({
            resourceGroupName: resourceGroupName,
            containerGroupName: containerGroupName,
            options: options
        }, stopOperationSpec, callback);
    };
    /**
     * Create or update container groups with specified configurations.
     * @summary Create or update container groups.
     * @param resourceGroupName The name of the resource group.
     * @param containerGroupName The name of the container group.
     * @param containerGroup The properties of the container group to be created or updated.
     * @param [options] The optional parameters
     * @returns Promise<msRestAzure.LROPoller>
     */
    ContainerGroups.prototype.beginCreateOrUpdate = function (resourceGroupName, containerGroupName, containerGroup, options) {
        return this.client.sendLRORequest({
            resourceGroupName: resourceGroupName,
            containerGroupName: containerGroupName,
            containerGroup: containerGroup,
            options: options
        }, beginCreateOrUpdateOperationSpec, options);
    };
    /**
     * Restarts all containers in a container group in place. If container image has updates, new image
     * will be downloaded.
     * @summary Restarts all containers in a container group.
     * @param resourceGroupName The name of the resource group.
     * @param containerGroupName The name of the container group.
     * @param [options] The optional parameters
     * @returns Promise<msRestAzure.LROPoller>
     */
    ContainerGroups.prototype.beginRestart = function (resourceGroupName, containerGroupName, options) {
        return this.client.sendLRORequest({
            resourceGroupName: resourceGroupName,
            containerGroupName: containerGroupName,
            options: options
        }, beginRestartOperationSpec, options);
    };
    ContainerGroups.prototype.listNext = function (nextPageLink, options, callback) {
        return this.client.sendOperationRequest({
            nextPageLink: nextPageLink,
            options: options
        }, listNextOperationSpec, callback);
    };
    ContainerGroups.prototype.listByResourceGroupNext = function (nextPageLink, options, callback) {
        return this.client.sendOperationRequest({
            nextPageLink: nextPageLink,
            options: options
        }, listByResourceGroupNextOperationSpec, callback);
    };
    return ContainerGroups;
}());
export { ContainerGroups };
// Operation Specifications
var serializer = new msRest.Serializer(Mappers);
var listOperationSpec = {
    httpMethod: "GET",
    path: "subscriptions/{subscriptionId}/providers/Microsoft.ContainerInstance/containerGroups",
    urlParameters: [
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
            bodyMapper: Mappers.ContainerGroupListResult
        },
        default: {
            bodyMapper: Mappers.CloudError
        }
    },
    serializer: serializer
};
var listByResourceGroupOperationSpec = {
    httpMethod: "GET",
    path: "subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ContainerInstance/containerGroups",
    urlParameters: [
        Parameters.subscriptionId,
        Parameters.resourceGroupName
    ],
    queryParameters: [
        Parameters.apiVersion
    ],
    headerParameters: [
        Parameters.acceptLanguage
    ],
    responses: {
        200: {
            bodyMapper: Mappers.ContainerGroupListResult
        },
        default: {
            bodyMapper: Mappers.CloudError
        }
    },
    serializer: serializer
};
var getOperationSpec = {
    httpMethod: "GET",
    path: "subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ContainerInstance/containerGroups/{containerGroupName}",
    urlParameters: [
        Parameters.subscriptionId,
        Parameters.resourceGroupName,
        Parameters.containerGroupName
    ],
    queryParameters: [
        Parameters.apiVersion
    ],
    headerParameters: [
        Parameters.acceptLanguage
    ],
    responses: {
        200: {
            bodyMapper: Mappers.ContainerGroup
        },
        default: {
            bodyMapper: Mappers.CloudError
        }
    },
    serializer: serializer
};
var updateOperationSpec = {
    httpMethod: "PATCH",
    path: "subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ContainerInstance/containerGroups/{containerGroupName}",
    urlParameters: [
        Parameters.subscriptionId,
        Parameters.resourceGroupName,
        Parameters.containerGroupName
    ],
    queryParameters: [
        Parameters.apiVersion
    ],
    headerParameters: [
        Parameters.acceptLanguage
    ],
    requestBody: {
        parameterPath: "resource",
        mapper: tslib_1.__assign({}, Mappers.Resource, { required: true })
    },
    responses: {
        200: {
            bodyMapper: Mappers.ContainerGroup
        },
        default: {
            bodyMapper: Mappers.CloudError
        }
    },
    serializer: serializer
};
var deleteMethodOperationSpec = {
    httpMethod: "DELETE",
    path: "subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ContainerInstance/containerGroups/{containerGroupName}",
    urlParameters: [
        Parameters.subscriptionId,
        Parameters.resourceGroupName,
        Parameters.containerGroupName
    ],
    queryParameters: [
        Parameters.apiVersion
    ],
    headerParameters: [
        Parameters.acceptLanguage
    ],
    responses: {
        200: {
            bodyMapper: Mappers.ContainerGroup
        },
        204: {},
        default: {
            bodyMapper: Mappers.CloudError
        }
    },
    serializer: serializer
};
var stopOperationSpec = {
    httpMethod: "POST",
    path: "subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ContainerInstance/containerGroups/{containerGroupName}/stop",
    urlParameters: [
        Parameters.subscriptionId,
        Parameters.resourceGroupName,
        Parameters.containerGroupName
    ],
    queryParameters: [
        Parameters.apiVersion
    ],
    headerParameters: [
        Parameters.acceptLanguage
    ],
    responses: {
        204: {},
        default: {
            bodyMapper: Mappers.CloudError
        }
    },
    serializer: serializer
};
var beginCreateOrUpdateOperationSpec = {
    httpMethod: "PUT",
    path: "subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ContainerInstance/containerGroups/{containerGroupName}",
    urlParameters: [
        Parameters.subscriptionId,
        Parameters.resourceGroupName,
        Parameters.containerGroupName
    ],
    queryParameters: [
        Parameters.apiVersion
    ],
    headerParameters: [
        Parameters.acceptLanguage
    ],
    requestBody: {
        parameterPath: "containerGroup",
        mapper: tslib_1.__assign({}, Mappers.ContainerGroup, { required: true })
    },
    responses: {
        200: {
            bodyMapper: Mappers.ContainerGroup
        },
        201: {
            bodyMapper: Mappers.ContainerGroup
        },
        default: {
            bodyMapper: Mappers.CloudError
        }
    },
    serializer: serializer
};
var beginRestartOperationSpec = {
    httpMethod: "POST",
    path: "subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ContainerInstance/containerGroups/{containerGroupName}/restart",
    urlParameters: [
        Parameters.subscriptionId,
        Parameters.resourceGroupName,
        Parameters.containerGroupName
    ],
    queryParameters: [
        Parameters.apiVersion
    ],
    headerParameters: [
        Parameters.acceptLanguage
    ],
    responses: {
        204: {},
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
            bodyMapper: Mappers.ContainerGroupListResult
        },
        default: {
            bodyMapper: Mappers.CloudError
        }
    },
    serializer: serializer
};
var listByResourceGroupNextOperationSpec = {
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
            bodyMapper: Mappers.ContainerGroupListResult
        },
        default: {
            bodyMapper: Mappers.CloudError
        }
    },
    serializer: serializer
};
//# sourceMappingURL=containerGroups.js.map