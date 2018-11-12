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
import * as Models from "./models";
import * as Mappers from "./models/mappers";
import * as operations from "./operations";
import { ContainerInstanceManagementClientContext } from "./containerInstanceManagementClientContext";
var ContainerInstanceManagementClient = /** @class */ (function (_super) {
    tslib_1.__extends(ContainerInstanceManagementClient, _super);
    /**
     * Initializes a new instance of the ContainerInstanceManagementClient class.
     * @param credentials Credentials needed for the client to connect to Azure.
     * @param subscriptionId Subscription credentials which uniquely identify Microsoft Azure
     * subscription. The subscription ID forms part of the URI for every service call.
     * @param [options] The parameter options
     */
    function ContainerInstanceManagementClient(credentials, subscriptionId, options) {
        var _this = _super.call(this, credentials, subscriptionId, options) || this;
        _this.containerGroups = new operations.ContainerGroups(_this);
        _this.operations = new operations.Operations(_this);
        _this.containerGroupUsage = new operations.ContainerGroupUsage(_this);
        _this.container = new operations.ContainerOperations(_this);
        _this.serviceAssociationLink = new operations.ServiceAssociationLink(_this);
        return _this;
    }
    return ContainerInstanceManagementClient;
}(ContainerInstanceManagementClientContext));
// Operation Specifications
export { ContainerInstanceManagementClient, ContainerInstanceManagementClientContext, Models as ContainerInstanceManagementModels, Mappers as ContainerInstanceManagementMappers };
export * from "./operations";
//# sourceMappingURL=containerInstanceManagementClient.js.map