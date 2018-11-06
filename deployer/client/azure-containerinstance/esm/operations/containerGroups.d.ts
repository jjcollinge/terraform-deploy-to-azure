import * as msRest from "ms-rest-js";
import * as msRestAzure from "ms-rest-azure-js";
import * as Models from "../models";
import { ContainerInstanceManagementClientContext } from "../containerInstanceManagementClientContext";
/** Class representing a ContainerGroups. */
export declare class ContainerGroups {
    private readonly client;
    /**
     * Create a ContainerGroups.
     * @param {ContainerInstanceManagementClientContext} client Reference to the service client.
     */
    constructor(client: ContainerInstanceManagementClientContext);
    /**
     * Get a list of container groups in the specified subscription. This operation returns properties
     * of each container group including containers, image registry credentials, restart policy, IP
     * address type, OS type, state, and volumes.
     * @summary Get a list of container groups in the specified subscription.
     * @param [options] The optional parameters
     * @returns Promise<Models.ContainerGroupsListResponse>
     */
    list(options?: msRest.RequestOptionsBase): Promise<Models.ContainerGroupsListResponse>;
    /**
     * @param callback The callback
     */
    list(callback: msRest.ServiceCallback<Models.ContainerGroupListResult>): void;
    /**
     * @param options The optional parameters
     * @param callback The callback
     */
    list(options: msRest.RequestOptionsBase, callback: msRest.ServiceCallback<Models.ContainerGroupListResult>): void;
    /**
     * Get a list of container groups in a specified subscription and resource group. This operation
     * returns properties of each container group including containers, image registry credentials,
     * restart policy, IP address type, OS type, state, and volumes.
     * @summary Get a list of container groups in the specified subscription and resource group.
     * @param resourceGroupName The name of the resource group.
     * @param [options] The optional parameters
     * @returns Promise<Models.ContainerGroupsListByResourceGroupResponse>
     */
    listByResourceGroup(resourceGroupName: string, options?: msRest.RequestOptionsBase): Promise<Models.ContainerGroupsListByResourceGroupResponse>;
    /**
     * @param resourceGroupName The name of the resource group.
     * @param callback The callback
     */
    listByResourceGroup(resourceGroupName: string, callback: msRest.ServiceCallback<Models.ContainerGroupListResult>): void;
    /**
     * @param resourceGroupName The name of the resource group.
     * @param options The optional parameters
     * @param callback The callback
     */
    listByResourceGroup(resourceGroupName: string, options: msRest.RequestOptionsBase, callback: msRest.ServiceCallback<Models.ContainerGroupListResult>): void;
    /**
     * Gets the properties of the specified container group in the specified subscription and resource
     * group. The operation returns the properties of each container group including containers, image
     * registry credentials, restart policy, IP address type, OS type, state, and volumes.
     * @summary Get the properties of the specified container group.
     * @param resourceGroupName The name of the resource group.
     * @param containerGroupName The name of the container group.
     * @param [options] The optional parameters
     * @returns Promise<Models.ContainerGroupsGetResponse>
     */
    get(resourceGroupName: string, containerGroupName: string, options?: msRest.RequestOptionsBase): Promise<Models.ContainerGroupsGetResponse>;
    /**
     * @param resourceGroupName The name of the resource group.
     * @param containerGroupName The name of the container group.
     * @param callback The callback
     */
    get(resourceGroupName: string, containerGroupName: string, callback: msRest.ServiceCallback<Models.ContainerGroup>): void;
    /**
     * @param resourceGroupName The name of the resource group.
     * @param containerGroupName The name of the container group.
     * @param options The optional parameters
     * @param callback The callback
     */
    get(resourceGroupName: string, containerGroupName: string, options: msRest.RequestOptionsBase, callback: msRest.ServiceCallback<Models.ContainerGroup>): void;
    /**
     * Create or update container groups with specified configurations.
     * @summary Create or update container groups.
     * @param resourceGroupName The name of the resource group.
     * @param containerGroupName The name of the container group.
     * @param containerGroup The properties of the container group to be created or updated.
     * @param [options] The optional parameters
     * @returns Promise<Models.ContainerGroupsCreateOrUpdateResponse>
     */
    createOrUpdate(resourceGroupName: string, containerGroupName: string, containerGroup: Models.ContainerGroup, options?: msRest.RequestOptionsBase): Promise<Models.ContainerGroupsCreateOrUpdateResponse>;
    /**
     * Updates container group tags with specified values.
     * @summary Update container groups.
     * @param resourceGroupName The name of the resource group.
     * @param containerGroupName The name of the container group.
     * @param resource The container group resource with just the tags to be updated.
     * @param [options] The optional parameters
     * @returns Promise<Models.ContainerGroupsUpdateResponse>
     */
    update(resourceGroupName: string, containerGroupName: string, resource: Models.Resource, options?: msRest.RequestOptionsBase): Promise<Models.ContainerGroupsUpdateResponse>;
    /**
     * @param resourceGroupName The name of the resource group.
     * @param containerGroupName The name of the container group.
     * @param resource The container group resource with just the tags to be updated.
     * @param callback The callback
     */
    update(resourceGroupName: string, containerGroupName: string, resource: Models.Resource, callback: msRest.ServiceCallback<Models.ContainerGroup>): void;
    /**
     * @param resourceGroupName The name of the resource group.
     * @param containerGroupName The name of the container group.
     * @param resource The container group resource with just the tags to be updated.
     * @param options The optional parameters
     * @param callback The callback
     */
    update(resourceGroupName: string, containerGroupName: string, resource: Models.Resource, options: msRest.RequestOptionsBase, callback: msRest.ServiceCallback<Models.ContainerGroup>): void;
    /**
     * Delete the specified container group in the specified subscription and resource group. The
     * operation does not delete other resources provided by the user, such as volumes.
     * @summary Delete the specified container group.
     * @param resourceGroupName The name of the resource group.
     * @param containerGroupName The name of the container group.
     * @param [options] The optional parameters
     * @returns Promise<Models.ContainerGroupsDeleteMethodResponse>
     */
    deleteMethod(resourceGroupName: string, containerGroupName: string, options?: msRest.RequestOptionsBase): Promise<Models.ContainerGroupsDeleteMethodResponse>;
    /**
     * @param resourceGroupName The name of the resource group.
     * @param containerGroupName The name of the container group.
     * @param callback The callback
     */
    deleteMethod(resourceGroupName: string, containerGroupName: string, callback: msRest.ServiceCallback<Models.ContainerGroup>): void;
    /**
     * @param resourceGroupName The name of the resource group.
     * @param containerGroupName The name of the container group.
     * @param options The optional parameters
     * @param callback The callback
     */
    deleteMethod(resourceGroupName: string, containerGroupName: string, options: msRest.RequestOptionsBase, callback: msRest.ServiceCallback<Models.ContainerGroup>): void;
    /**
     * Restarts all containers in a container group in place. If container image has updates, new image
     * will be downloaded.
     * @summary Restarts all containers in a container group.
     * @param resourceGroupName The name of the resource group.
     * @param containerGroupName The name of the container group.
     * @param [options] The optional parameters
     * @returns Promise<msRest.RestResponse>
     */
    restart(resourceGroupName: string, containerGroupName: string, options?: msRest.RequestOptionsBase): Promise<msRest.RestResponse>;
    /**
     * Stops all containers in a container group. Compute resources will be deallocated and billing
     * will stop.
     * @summary Stops all containers in a container group.
     * @param resourceGroupName The name of the resource group.
     * @param containerGroupName The name of the container group.
     * @param [options] The optional parameters
     * @returns Promise<msRest.RestResponse>
     */
    stop(resourceGroupName: string, containerGroupName: string, options?: msRest.RequestOptionsBase): Promise<msRest.RestResponse>;
    /**
     * @param resourceGroupName The name of the resource group.
     * @param containerGroupName The name of the container group.
     * @param callback The callback
     */
    stop(resourceGroupName: string, containerGroupName: string, callback: msRest.ServiceCallback<void>): void;
    /**
     * @param resourceGroupName The name of the resource group.
     * @param containerGroupName The name of the container group.
     * @param options The optional parameters
     * @param callback The callback
     */
    stop(resourceGroupName: string, containerGroupName: string, options: msRest.RequestOptionsBase, callback: msRest.ServiceCallback<void>): void;
    /**
     * Create or update container groups with specified configurations.
     * @summary Create or update container groups.
     * @param resourceGroupName The name of the resource group.
     * @param containerGroupName The name of the container group.
     * @param containerGroup The properties of the container group to be created or updated.
     * @param [options] The optional parameters
     * @returns Promise<msRestAzure.LROPoller>
     */
    beginCreateOrUpdate(resourceGroupName: string, containerGroupName: string, containerGroup: Models.ContainerGroup, options?: msRest.RequestOptionsBase): Promise<msRestAzure.LROPoller>;
    /**
     * Restarts all containers in a container group in place. If container image has updates, new image
     * will be downloaded.
     * @summary Restarts all containers in a container group.
     * @param resourceGroupName The name of the resource group.
     * @param containerGroupName The name of the container group.
     * @param [options] The optional parameters
     * @returns Promise<msRestAzure.LROPoller>
     */
    beginRestart(resourceGroupName: string, containerGroupName: string, options?: msRest.RequestOptionsBase): Promise<msRestAzure.LROPoller>;
    /**
     * Get a list of container groups in the specified subscription. This operation returns properties
     * of each container group including containers, image registry credentials, restart policy, IP
     * address type, OS type, state, and volumes.
     * @summary Get a list of container groups in the specified subscription.
     * @param nextPageLink The NextLink from the previous successful call to List operation.
     * @param [options] The optional parameters
     * @returns Promise<Models.ContainerGroupsListNextResponse>
     */
    listNext(nextPageLink: string, options?: msRest.RequestOptionsBase): Promise<Models.ContainerGroupsListNextResponse>;
    /**
     * @param nextPageLink The NextLink from the previous successful call to List operation.
     * @param callback The callback
     */
    listNext(nextPageLink: string, callback: msRest.ServiceCallback<Models.ContainerGroupListResult>): void;
    /**
     * @param nextPageLink The NextLink from the previous successful call to List operation.
     * @param options The optional parameters
     * @param callback The callback
     */
    listNext(nextPageLink: string, options: msRest.RequestOptionsBase, callback: msRest.ServiceCallback<Models.ContainerGroupListResult>): void;
    /**
     * Get a list of container groups in a specified subscription and resource group. This operation
     * returns properties of each container group including containers, image registry credentials,
     * restart policy, IP address type, OS type, state, and volumes.
     * @summary Get a list of container groups in the specified subscription and resource group.
     * @param nextPageLink The NextLink from the previous successful call to List operation.
     * @param [options] The optional parameters
     * @returns Promise<Models.ContainerGroupsListByResourceGroupNextResponse>
     */
    listByResourceGroupNext(nextPageLink: string, options?: msRest.RequestOptionsBase): Promise<Models.ContainerGroupsListByResourceGroupNextResponse>;
    /**
     * @param nextPageLink The NextLink from the previous successful call to List operation.
     * @param callback The callback
     */
    listByResourceGroupNext(nextPageLink: string, callback: msRest.ServiceCallback<Models.ContainerGroupListResult>): void;
    /**
     * @param nextPageLink The NextLink from the previous successful call to List operation.
     * @param options The optional parameters
     * @param callback The callback
     */
    listByResourceGroupNext(nextPageLink: string, options: msRest.RequestOptionsBase, callback: msRest.ServiceCallback<Models.ContainerGroupListResult>): void;
}
//# sourceMappingURL=containerGroups.d.ts.map