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
import * as msRestAzure from "ms-rest-azure-js";
var packageName = "@azure/arm-msi";
var packageVersion = "1.0.0-preview";
var ManagedServiceIdentityClientContext = /** @class */ (function (_super) {
    tslib_1.__extends(ManagedServiceIdentityClientContext, _super);
    /**
     * Initializes a new instance of the ManagedServiceIdentityClient class.
     * @param credentials Credentials needed for the client to connect to Azure.
     * @param subscriptionId The Id of the Subscription to which the identity belongs.
     * @param [options] The parameter options
     */
    function ManagedServiceIdentityClientContext(credentials, subscriptionId, options) {
        var _this = this;
        if (credentials == undefined) {
            throw new Error('\'credentials\' cannot be null.');
        }
        if (subscriptionId == undefined) {
            throw new Error('\'subscriptionId\' cannot be null.');
        }
        if (!options) {
            options = {};
        }
        _this = _super.call(this, credentials, options) || this;
        _this.apiVersion = '2015-08-31-preview';
        _this.acceptLanguage = 'en-US';
        _this.longRunningOperationRetryTimeout = 30;
        _this.baseUri = options.baseUri || _this.baseUri || "https://management.azure.com";
        _this.requestContentType = "application/json; charset=utf-8";
        _this.credentials = credentials;
        _this.subscriptionId = subscriptionId;
        _this.addUserAgentInfo(packageName + "/" + packageVersion);
        if (options.acceptLanguage !== null && options.acceptLanguage !== undefined) {
            _this.acceptLanguage = options.acceptLanguage;
        }
        if (options.longRunningOperationRetryTimeout !== null && options.longRunningOperationRetryTimeout !== undefined) {
            _this.longRunningOperationRetryTimeout = options.longRunningOperationRetryTimeout;
        }
        return _this;
    }
    return ManagedServiceIdentityClientContext;
}(msRestAzure.AzureServiceClient));
export { ManagedServiceIdentityClientContext };
//# sourceMappingURL=managedServiceIdentityClientContext.js.map