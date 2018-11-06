import * as msRest from "ms-rest-js";
import * as Models from "../models";
import { ContainerInstanceManagementClientContext } from "../containerInstanceManagementClientContext";
/** Class representing a ContainerGroupUsage. */
export declare class ContainerGroupUsage {
    private readonly client;
    /**
     * Create a ContainerGroupUsage.
     * @param {ContainerInstanceManagementClientContext} client Reference to the service client.
     */
    constructor(client: ContainerInstanceManagementClientContext);
    /**
     * Get the usage for a subscription
     * @param location The identifier for the physical azure location.
     * @param [options] The optional parameters
     * @returns Promise<Models.ContainerGroupUsageListResponse>
     */
    list(location: string, options?: msRest.RequestOptionsBase): Promise<Models.ContainerGroupUsageListResponse>;
    /**
     * @param location The identifier for the physical azure location.
     * @param callback The callback
     */
    list(location: string, callback: msRest.ServiceCallback<Models.UsageListResult>): void;
    /**
     * @param location The identifier for the physical azure location.
     * @param options The optional parameters
     * @param callback The callback
     */
    list(location: string, options: msRest.RequestOptionsBase, callback: msRest.ServiceCallback<Models.UsageListResult>): void;
}
//# sourceMappingURL=containerGroupUsage.d.ts.map