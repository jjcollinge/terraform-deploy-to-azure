import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import { incrementStage } from '../actions/stageActions';
import { connect } from 'react-redux';
import { Terminal } from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';
import * as attach from 'xterm/lib/addons/attach/attach';
import style from 'xterm/dist/xterm.css';
import './terraformTerminal.css';
import * as WebfontLoader from 'xterm-webfont'
import chalk from 'chalk';
import * as msRest from 'ms-rest-js';
import { ContainerInstanceManagementClient } from '../libs/arm-containerinstance/esm/containerInstanceManagementClient';
import { ResourceManagementClient } from '../libs/arm-resources/esm/resourceManagementClient';
import { ManagedServiceIdentityClient } from '../libs/arm-msi/esm/managedServiceIdentityClient'
import { AuthorizationManagementClient } from '../libs/arm-authorization/esm/authorizationManagementClient';
import * as request from 'requestretry';
import * as encryption from './encryption'

const terminalStyle = {
    margin: "3% 0"
}

const defaultLocation = "eastus";

let options = { enabled: true, level: 2 };
const colors = new chalk.constructor(options);

const newGUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

class TerraformTerminal extends Component {
    state = {
        output: "Loading...",
        xterm: {},
        webSocket: null,
        keys: {},
        subscriptionId: "",
        resourceGroupName: "",
        token: "",
    }

    componentWillMount() {
        let subId = this.props.variables.find(o => {
            return o.name === 'azure_subscription_id';
        });
        if (subId === undefined) {
            throw "azure_subscription_id is required!"
        }
        this.setState({ subscriptionId: subId.value });
    }

    header = this.header.bind(this);

    header(msg) {
        console.log(`header: ${msg}`);
        this.state.xterm.writeln(colors.greenBright.bold.underline(`\r\n ${msg}`));
    }

    info = this.info.bind(this);

    info(msg) {
        console.log(`info: ${msg}`);
        this.state.xterm.writeln(`\r\n ~ ${msg}`);
    }

    warn = this.warn.bind(this);

    warn(msg) {
        console.log(`warn: ${msg}`);
        this.state.xterm.writeln(colors.yellowBright(`\r\n ! ${msg}`));
    }

    err = this.err.bind(this);

    err(msg) {
        console.error(`error: ${msg}`);
        let skull = "☠️";
        this.state.xterm.writeln(colors.redBright(`\r\n ${skull} ${msg}`));
    }

    async componentDidMount() {
        // Generate some keys for encrypting coms between the client and the ACI container
        // let keys = await encryption.generateKeys();
        let keys = await encryption.generateKeys();

        this.setState({ keys: keys });

        let termElem = document.getElementById('terminal')
        Terminal.applyAddon(fit);
        Terminal.applyAddon(WebfontLoader);
        Terminal.applyAddon(attach);

        let xterm = new Terminal({
            useStyle: true,
            cursorBlink: true,
            fontFamily: 'Roboto Mono',
            fontSize: 18,
            fontWeight: 500,
            fontWeightBold: 1000,
        });
        await xterm.loadWebfontAndOpen(termElem);
        this.setState({ xterm: xterm }, () => {
            this.header("Deploy to Azure with Terraform");
        });
        xterm.fit();

        let aciContainerEnvironmentVars = [
            {
                name: "AES_KEY",
                secureValue: keys.aesKeyExport
            },
            {
                name: "HMAC_KEY",
                secureValue: keys.hmacKeyExport
            }
        ]
        // Add Terraform variables specified in the form
        this.props.variables.forEach(variable => {
            let value = variable.value ? variable.value : '""';     //TODO: Not all vars may be strings
            aciContainerEnvironmentVars.push({
                name: "TF_VAR_" + variable.name,
                value: value,
            });
        })

        let t = setInterval(function () {
            xterm.write(".");
        }, 300);

        try {
            this.info("Starting deployment process")

            //let token = this.props.user.token;
            let token = this.props.variables.find(o => o.name == 'azure_token').value;  //TODO: This will come from user once AAD is sorted
            this.setState({ token: token });

            aciContainerEnvironmentVars.push({
                name: "ARM_SUBSCRIPTION_ID",
                value: this.state.subscriptionId,
            });

            let guid = newGUID();
            let resourceGroupName = "tfdeploy-" + guid;
            let identityName = guid;
            await this.createResourceGroup(resourceGroupName);
            let msi = await this.createManagedIdentity(identityName);

            // Sleep long enough for AAD to become consistent
            this.warn("Waiting for AAD update to propogate")
            await sleep(60000);

            await this.grantIdentityPermission(msi);

            // Sleep long enough for AAD to become consistent
            this.warn("Waiting for AAD update to propogate")
            await sleep(10000);

            let identity = {
                type: 'UserAssigned',
                userAssignedIdentities: {
                    [msi.id]: {}
                },
            }

            let ipAddress = await this.createACIInstance(
                identity,
                guid,
                this.props.git.url,
                this.props.git.commit,
                aciContainerEnvironmentVars);

            this.info(`Deployment container started @ ${ipAddress}`);

            // Wait for the server to be alive
            await request({
                url: `http://${ipAddress}:3012/alive`,
                json: false,

                // The below parameters are specific to request-retry
                maxAttempts: 15,
                retryDelay: 4000,
                timeout: 1000,
                retryStrategy: retryStrategy // retry anything that isn't a 200
            });

            // Connect and provide a func to execute when connection lost
            await this.connect(ipAddress, async e => {
                let timeout = 12000;
                this.warn(`Connection closed, retrying in ${timeout / 1000} seconds`);
                await sleep(timeout);
                await this.connect(ipAddress, e => {
                    this.err(`Connection closed, giving up`);
                });

                xterm.attach(this.state.webSocket);

                clearInterval(t);
            });
            xterm.attach(this.state.webSocket);

            clearInterval(t);

            this.info("Connected to interactive Terraform terminal")
            xterm.writeln(colors.greenBright("\r\nuser@tfdeploy:") + colors.blueBright("/git") + "$ terraform apply \n\n");

        } catch (e) {
            console.log(e);
            this.err("An error occurred while connecting to the deployment container: " + e.toString())
        }
        clearInterval(t);
    }

    render() {
        return (<Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            alignContent="stretch"
            className="preview">
            <Grid
                item xs={12}
                style={terminalStyle}
                className="preview-terminal">
                <div id='terminal'></div>
            </Grid>
        </Grid>
        )
    }

    createManagedIdentity = this.createManagedIdentity.bind(this);

    async createManagedIdentity(name) {
        let { subscriptionId, token, resourceGroupName } = this.state;
        this.info(`Creating deployment identity '${name}'`);

        const creds = new msRest.TokenCredentials(token);
        const client = new ManagedServiceIdentityClient(creds, subscriptionId);

        let identity = await client.userAssignedIdentities.createOrUpdate(resourceGroupName, name, {
            location: defaultLocation,
        });

        return identity;
    }

    grantIdentityPermission = this.grantIdentityPermission.bind(this);

    async grantIdentityPermission(msi) {
        let { subscriptionId, token } = this.state;
        this.info(`Granting identity permission to ARM`);

        const creds = new msRest.TokenCredentials(token);
        const client = new AuthorizationManagementClient(creds, subscriptionId);

        let roleDefinitionId = "b24988ac-6180-42a0-ab88-20f7382dd24c";  // Contributor
        let roleAssignmentName = newGUID();
        await client.roleAssignments.create(`subscriptions/${subscriptionId}`, roleAssignmentName, {
            principalId: msi.principalId,
            roleDefinitionId: `/subscriptions/${subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/${roleDefinitionId}`,
        })
    }

    createResourceGroup = this.createResourceGroup.bind(this);

    async createResourceGroup(name) {
        let { subscriptionId, token } = this.state;

        this.info(`Creating deployment resource group '${name}'`)
        const creds = new msRest.TokenCredentials(token);
        const client = new ResourceManagementClient(creds, subscriptionId);

        let group = await client.resourceGroups.createOrUpdate(name, {
            location: defaultLocation,
        });

        this.setState({ resourceGroupName: name })

        return
    }

    deleteResourceGroup = this.deleteResourceGroup.bind(this);

    async deleteResourceGroup() {
        let { subscriptionId, token, resourceGroupName } = this.state;
        if (resourceGroupName === "") {
            // resource group not created yet
            return
        }

        this.info(`Deleting deployment resource group '${resourceGroupName}'\n\n`)
        const creds = new msRest.TokenCredentials(token);
        const client = new ResourceManagementClient(creds, subscriptionId);

        let group = await client.resourceGroups.delete(resourceGroupName);

        return
    }

    createACIInstance = this.createACIInstance.bind(this);

    async createACIInstance(identity, containerGroupName, repoUrl, repoCommitHash, tfvars) {
        let { subscriptionId, token, resourceGroupName } = this.state;
        this.info("Starting deployment container")

        const creds = new msRest.TokenCredentials(token);
        const client = new ContainerInstanceManagementClient(creds, subscriptionId, {
            apiVersion: "2018-10-01"
        });

        let containerGroupCreated = await client.containerGroups.createOrUpdate(resourceGroupName, containerGroupName, {
            location: defaultLocation,
            osType: "linux",
            identity: identity,
            restartPolicy: "Never",
            ipAddress: {
                type: "Public",
                ports: [
                    {
                        protocol: "TCP",
                        port: 3012
                    }
                ]
            },
            volumes: [
                {
                    name: "gitrepo",
                    gitRepo: {
                        repository: repoUrl,
                        revision: repoCommitHash,
                        directory: ".",
                    }
                }
            ],
            containers: [
                {
                    name: "terraform-deployer",
                    image: "dotjson/tfdeployer:dev",
                    livenessProbe: {
                        exec: {
                            command: ["echo", "1"]
                        }
                    },
                    readinessProbe: {
                        exec: {
                            command: ["cat", "/app/ready.txt"]
                        }
                    },
                    ports: [
                        {
                            protocol: "TCP",
                            port: 3012,
                        },
                    ],
                    environmentVariables: tfvars,
                    volumeMounts: [
                        {
                            name: "gitrepo",
                            mountPath: "/git"
                        }
                    ],
                    resources: {
                        requests: {
                            memoryInGB: 0.5,
                            cpu: 0.5,
                        }
                    }
                }],
        }, {
                apiVersion: "2018-10-01"
            })

        while (true) {
            let existing = await client.containerGroups.get(resourceGroupName, containerGroupName);
            console.log(existing);
            if (existing.containers[0].instanceView.currentState.state !== "Running") {
                if (existing.containers[0].instanceView.currentState.detailStatus === "Completed" || existing.containers[0].instanceView.currentState.detailStatus === "Terminated") {
                    this.err("Container instance already exited :(")
                    throw "failed"
                }
                await sleep(3000);
                continue
            }
            if (existing.ipAddress != null) {
                if (existing.ipAddress.ip === undefined) {
                    this.err("IP Address is undefined, something has gone wrong")
                    throw "failed"
                }
                return existing.ipAddress.ip;
            }
            return "failed"
        }
    }

    connect = this.connect.bind(this);

    async connect(address, onClose) {
        let buff = [];

        return new Promise((resolve, reject) => {
            // Second connection suceeds
            let ws = new WebSocket("ws://" + address + ":3012/terminal");

            // Wrapper for socket to handle encryption.
            let wsWrapper = {
                original: ws,
                addEventListener: (type, handler) => {
                    if (type === "message") {
                        return ws.addEventListener(type, async (evt) => {
                            console.log("received:" + evt.data);
                            try {
                                let msg = JSON.parse(evt.data);

                                // Validate and decript the message
                                let result = await encryption.validateAndDecrypt(msg, this.state.keys);
                                if (!result.isValid) {
                                    console.log(result.error);
                                    throw "Invalid message received";
                                }
                                console.log(result);

                                // Handle the server exiting, cleanup the resource group
                                if (result.message === "command exited") {
                                    this.state.xterm.writeln("\r\n" + colors.blueBright("The Terraform process exited: cleaning up...."));
                                    await this.deleteResourceGroup();
                                    return;
                                }
                                // evt.data = result.message;
                                return handler({
                                    data: result.message
                                });
                            } catch (e) {
                                console.log("Error in Websocket wrapper");
                                console.log(e);
                                console.log(evt);
                            }

                        });
                    }
                    return ws.addEventListener(type, handler);
                },
                // Encrypt before sending
                send: async (data) => {
                    // TODO: Optimize this
                    console.log("Buffer " + buff)
                    if (buff.length === 3) {
                        buff.shift();
                    }
                    buff.push(data);
                    if (buff.join("") === "yes") {
                        this.props.incrementStage();
                    }
                    console.log("sending " + data);
                    let result = await encryption.encryptAndSign(data, this.state.keys);
                    return ws.send(JSON.stringify(result));
                },
                readyState: 1,
            }
            this.setState({ webSocket: wsWrapper });

            ws.onopen = function () {
                resolve("connected");
            };

            ws.onclose = onClose;
        });
    }

    send = this.send.bind(this);

    send(message) {
        console.log("sent triggered")
        let ws = this.state.webSocket
        if (ws === null) {
            throw "Connection not available, cannot send message"
        }
        ws.send(message);
    }
}

const mapStateToProps = state => ({
    variables: state.variables,
    user: state.user,
    git: state.git,
});

const mapDispatchToProps = dispatch => ({
    incrementStage: () => {
        dispatch(incrementStage());
    }
})

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function retryStrategy(err, response, body) {
    // retry the request if we had an error or if the response was a 'Bad Gateway'
    return err || response.statusCode !== 200;
}

export default connect(mapStateToProps, mapDispatchToProps)(TerraformTerminal);