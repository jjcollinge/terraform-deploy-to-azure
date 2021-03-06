/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
 */
/**
 * Defines values for DeploymentMode.
 * Possible values include: 'Incremental', 'Complete'
 * @readonly
 * @enum {string}
 */
export var DeploymentMode;
(function (DeploymentMode) {
    DeploymentMode["Incremental"] = "Incremental";
    DeploymentMode["Complete"] = "Complete";
})(DeploymentMode || (DeploymentMode = {}));
/**
 * Defines values for OnErrorDeploymentType.
 * Possible values include: 'LastSuccessful', 'SpecificDeployment'
 * @readonly
 * @enum {string}
 */
export var OnErrorDeploymentType;
(function (OnErrorDeploymentType) {
    OnErrorDeploymentType["LastSuccessful"] = "LastSuccessful";
    OnErrorDeploymentType["SpecificDeployment"] = "SpecificDeployment";
})(OnErrorDeploymentType || (OnErrorDeploymentType = {}));
/**
 * Defines values for ResourceIdentityType.
 * Possible values include: 'SystemAssigned', 'UserAssigned', 'SystemAssigned,
 * UserAssigned', 'None'
 * @readonly
 * @enum {string}
 */
export var ResourceIdentityType;
(function (ResourceIdentityType) {
    ResourceIdentityType["SystemAssigned"] = "SystemAssigned";
    ResourceIdentityType["UserAssigned"] = "UserAssigned";
    ResourceIdentityType["SystemAssignedUserAssigned"] = "SystemAssigned, UserAssigned";
    ResourceIdentityType["None"] = "None";
})(ResourceIdentityType || (ResourceIdentityType = {}));
//# sourceMappingURL=index.js.map