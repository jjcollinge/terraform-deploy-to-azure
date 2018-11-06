import * as msRest from "ms-rest-js";
import * as Models from "../models";
import { ContainerInstanceManagementClientContext } from "../containerInstanceManagementClientContext";
/** Class representing a ContainerOperations. */
export declare class ContainerOperations {
    private readonly client;
    /**
     * Create a ContainerOperations.
     * @param {ContainerInstanceManagementClientContext} client Reference to the service client.
     */
    constructor(client: ContainerInstanceManagementClientContext);
    /**
     * Get the logs for a specified container instance in a specified resource group and container
     * group.
     * @summary Get the logs for a specified container instance.
     * @param resourceGroupName The name of the resource group.
     * @param containerGroupName The name of the container group.
     * @param containerName The name of the container instance.
     * @param [options] The optional parameters
     * @returns Promise<Models.ContainerListLogsResponse>
     */
    listLogs(resourceGroupName: string, containerGroupName: string, containerName: string, options?: Models.ContainerListLogsOptionalParams): Promise<Models.ContainerListLogsResponse>;
    /**
     * @param resourceGroupName The name of the resource group.
     * @param containerGroupName The name of the container group.
     * @param containerName The name of the container instance.
     * @param callback The callback
     */
    listLogs(resourceGroupName: string, containerGroupName: string, containerName: string, callback: msRest.ServiceCallback<Models.Logs>): void;
    /**
     * @param resourceGroupName The name of the resource group.
     * @param containerGroupName The name of the container group.
     * @param containerName The name of the container instance.
     * @param options The optional parameters
     * @param callback The callback
     */
    listLogs(resourceGroupName: string, containerGroupName: string, containerName: string, options: Models.ContainerListLogsOptionalParams, callback: msRest.ServiceCallback<Models.Logs>): void;
    /**
     * Executes a command for a specific container instance in a specified resource group and container
     * group.
     * @summary Executes a command in a specific container instance.
     * @param resourceGroupName The name of the resource group.
     * @param containerGroupName The name of the container group.
     * @param containerName The name of the container instance.
     * @param containerExecRequest The request for the exec command.
     * @param [options] The optional parameters
     * @returns Promise<Models.ContainerExecuteCommandResponse>
     */
    executeCommand(resourceGroupName: string, containerGroupName: string, containerName: string, containerExecRequest: Models.ContainerExecRequest, options?: msRest.RequestOptionsBase): Promise<Models.ContainerExecuteCommandResponse>;
    /**
     * @param resourceGroupName The name of the resource group.
     * @param containerGroupName The name of the container group.
     * @param containerName The name of the container instance.
     * @param containerExecRequest The request for the exec command.
     * @param callback The callback
     */
    executeCommand(resourceGroupName: string, containerGroupName: string, containerName: string, containerExecRequest: Models.ContainerExecRequest, callback: msRest.ServiceCallback<Models.ContainerExecResponse>): void;
    /**
     * @param resourceGroupName The name of the resource group.
     * @param containerGroupName The name of the container group.
     * @param containerName The name of the container instance.
     * @param containerExecRequest The request for the exec command.
     * @param options The optional parameters
     * @param callback The callback
     */
    executeCommand(resourceGroupName: string, containerGroupName: string, containerName: string, containerExecRequest: Models.ContainerExecRequest, options: msRest.RequestOptionsBase, callback: msRest.ServiceCallback<Models.ContainerExecResponse>): void;
}
//# sourceMappingURL=containerOperations.d.ts.map