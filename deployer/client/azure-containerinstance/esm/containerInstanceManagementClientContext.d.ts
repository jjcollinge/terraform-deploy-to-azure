import * as Models from "./models";
import * as msRest from "ms-rest-js";
import * as msRestAzure from "ms-rest-azure-js";
export declare class ContainerInstanceManagementClientContext extends msRestAzure.AzureServiceClient {
    credentials: msRest.ServiceClientCredentials;
    subscriptionId: string;
    apiVersion: string;
    acceptLanguage: string;
    longRunningOperationRetryTimeout: number;
    /**
     * Initializes a new instance of the ContainerInstanceManagementClient class.
     * @param credentials Credentials needed for the client to connect to Azure.
     * @param subscriptionId Subscription credentials which uniquely identify Microsoft Azure
     * subscription. The subscription ID forms part of the URI for every service call.
     * @param [options] The parameter options
     */
    constructor(credentials: msRest.ServiceClientCredentials, subscriptionId: string, options?: Models.ContainerInstanceManagementClientOptions);
}
//# sourceMappingURL=containerInstanceManagementClientContext.d.ts.map