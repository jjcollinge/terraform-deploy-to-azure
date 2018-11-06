import * as msRest from "ms-rest-js";
import { ContainerInstanceManagementClientContext } from "../containerInstanceManagementClientContext";
/** Class representing a ServiceAssociationLink. */
export declare class ServiceAssociationLink {
    private readonly client;
    /**
     * Create a ServiceAssociationLink.
     * @param {ContainerInstanceManagementClientContext} client Reference to the service client.
     */
    constructor(client: ContainerInstanceManagementClientContext);
    /**
     * Delete the container instance service association link for the subnet. This operation unblocks
     * user from deleting subnet.
     * @summary Delete the container instance service association link for the subnet.
     * @param resourceGroupName The name of the resource group.
     * @param virtualNetworkName The name of the virtual network.
     * @param subnetName The name of the subnet.
     * @param [options] The optional parameters
     * @returns Promise<msRest.RestResponse>
     */
    deleteMethod(resourceGroupName: string, virtualNetworkName: string, subnetName: string, options?: msRest.RequestOptionsBase): Promise<msRest.RestResponse>;
    /**
     * @param resourceGroupName The name of the resource group.
     * @param virtualNetworkName The name of the virtual network.
     * @param subnetName The name of the subnet.
     * @param callback The callback
     */
    deleteMethod(resourceGroupName: string, virtualNetworkName: string, subnetName: string, callback: msRest.ServiceCallback<void>): void;
    /**
     * @param resourceGroupName The name of the resource group.
     * @param virtualNetworkName The name of the virtual network.
     * @param subnetName The name of the subnet.
     * @param options The optional parameters
     * @param callback The callback
     */
    deleteMethod(resourceGroupName: string, virtualNetworkName: string, subnetName: string, options: msRest.RequestOptionsBase, callback: msRest.ServiceCallback<void>): void;
}
//# sourceMappingURL=serviceAssociationLink.d.ts.map