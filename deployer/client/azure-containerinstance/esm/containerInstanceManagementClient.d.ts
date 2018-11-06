import * as msRest from "ms-rest-js";
import * as Models from "./models";
import * as Mappers from "./models/mappers";
import * as operations from "./operations";
import { ContainerInstanceManagementClientContext } from "./containerInstanceManagementClientContext";
declare class ContainerInstanceManagementClient extends ContainerInstanceManagementClientContext {
    containerGroups: operations.ContainerGroups;
    operations: operations.Operations;
    containerGroupUsage: operations.ContainerGroupUsage;
    container: operations.ContainerOperations;
    serviceAssociationLink: operations.ServiceAssociationLink;
    /**
     * Initializes a new instance of the ContainerInstanceManagementClient class.
     * @param credentials Credentials needed for the client to connect to Azure.
     * @param subscriptionId Subscription credentials which uniquely identify Microsoft Azure
     * subscription. The subscription ID forms part of the URI for every service call.
     * @param [options] The parameter options
     */
    constructor(credentials: msRest.ServiceClientCredentials, subscriptionId: string, options?: Models.ContainerInstanceManagementClientOptions);
}
export { ContainerInstanceManagementClient, ContainerInstanceManagementClientContext, Models as ContainerInstanceManagementModels, Mappers as ContainerInstanceManagementMappers };
export * from "./operations";
//# sourceMappingURL=containerInstanceManagementClient.d.ts.map