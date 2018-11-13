import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import { incrementStage } from '../actions/stageActions';
import { connect } from 'react-redux';
import { Terminal } from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';
import * as attach from 'xterm/lib/addons/attach/attach';
import style from 'xterm/dist/xterm.css';
import './preview.css';
import * as WebfontLoader from 'xterm-webfont'
import chalk from 'chalk';
import * as msRest from 'ms-rest-js';
import { ContainerInstanceManagementClient } from '../libs/azure-containerinstance/esm/containerInstanceManagementClient';
import { ResourceManagementClient } from '../libs/arm-resources/esm/resourceManagementClient';
import { token, subscriptionId } from './creds.private';
import * as request from 'requestretry';
import * as encryption from './encryption'
import { ManagedServiceIdentityClient } from '../libs/arm-msi/esm/managedServiceIdentityClient'

const terminalStyle = {
    margin: "3% 0"
}

let options = { enabled: true, level: 2 };
const forcedChalk = new chalk.constructor(options);

const newGUID = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

class Preview extends Component {
    state = {
        output: "Loading...",
        xterm: {},
        webSocket: null,
        keys: {}
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
            fontWeightBold: 500,
        });
        await xterm.loadWebfontAndOpen(termElem);
        xterm.writeln(forcedChalk.greenBright("Terraform Deploy to Azure\n\n"));
        xterm.writeln("Variables:");
        xterm.writeln("- - - - - - - - - - - - - -")

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
        console.log(this.props.variables)
        this.props.variables.forEach(variable => {
            console.log(variable);
            let value = variable.value ? variable.value : '""';
            xterm.writeln(`${variable.name} = ${value}`);

            aciContainerEnvironmentVars.push({
                name: "TF_VAR_" + variable.name,
                value: value,
            });
        })
        xterm.writeln("- - - - - - - - - - - - - -");
        xterm.fit();

        this.setState({ xterm: xterm });

        let t = setInterval(function () {
            xterm.write(".");
        }, 300);

        try {
            let guid = newGUID();
            let resourceGroupName = "tfdeploy-" + guid;
            let identityName = guid;
            await this.createResourceGroup(token,
                subscriptionId,
                resourceGroupName);
            let res = await this.createManagedIdentity(token,
                subscriptionId,
                resourceGroupName,
                identityName);
            let identity = {
                principalId: res.principalId,
                tenantId: res.tenantId,
                type: "UserAssigned",
                userAssignedIdentities: {
                    [res.id]: "",
                },
            }
            console.log(identity)
            let ipAddress = await this.createACIInstance(token,
                subscriptionId,
                resourceGroupName,
                identity,
                guid,
                this.props.git.url,
                this.props.git.commit,
                aciContainerEnvironmentVars);

            xterm.writeln("\r\nContainer starting @ " + ipAddress);

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

            // let ipAddress = "localhost";

            // Connect and provide a func to execute when connection lost
            await this.connect(ipAddress, async e => {
                let skull = "☠️";
                xterm.writeln(forcedChalk.red(`\r\n\r\n Connection closed ${skull}, retrying in 8 seconds`));
                await sleep(12000);
                await this.connect(ipAddress, e => {
                    xterm.writeln(forcedChalk.red(`\r\n\r\n Connection closed ${skull}, giving up`));
                });

                xterm.attach(this.state.webSocket);

                clearInterval(t);
            });
            xterm.attach(this.state.webSocket);

            clearInterval(t);

            xterm.writeln(forcedChalk.greenBright("\r\nConnected interactive terminal to Terraform container \n\n"));
            xterm.writeln(forcedChalk.greenBright("\r\nuser@tfdeploy:") + forcedChalk.blueBright("/git") + "$ terraform apply \n\n");

        } catch (e) {
            console.log(e);
            xterm.writeln("An error occurred while connecting to the Terraform container: " + e.toString());
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

    async createManagedIdentity(token, subscriptionId, resourceGroupName, name) {
        this.state.xterm.writeln("\r\nCreating a new managed identity: '" + name + "'");
        const creds = new msRest.TokenCredentials(token);
        const client = new ManagedServiceIdentityClient(creds, subscriptionId);

        let identity = await client.userAssignedIdentities.createOrUpdate(resourceGroupName, name, {
            location: defaultLocation,
        });

        console.log(identity);
        return identity
    }

    createResourceGroup = this.createResourceGroup.bind(this);

    async createResourceGroup(token, subscriptionId, name) {
        console.log(this.props.user.token);
        this.state.xterm.writeln("\r\nCreating a resource group to contain Terraform ACI container: '" + name + "'");
        const creds = new msRest.TokenCredentials(token);
        const client = new ResourceManagementClient(creds, subscriptionId);

        let group = await client.resourceGroups.createOrUpdate(name, {
            location: defaultLocation,
        });

        console.log(group)
        return
    }

    deleteResourceGroup = this.deleteResourceGroup.bind(this);

    async deleteResourceGroup(token, subscriptionId, name) {
        console.log(this.props.user.token);
        this.state.xterm.writeln("\r\nDeleting the resource group used by the Terraform ACI container");
        const creds = new msRest.TokenCredentials(token);
        const client = new ResourceManagementClient(creds, subscriptionId);

        let group = await client.resourceGroups.delete(name);

        console.log(group)
        return
    }

    createACIInstance = this.createACIInstance.bind(this);

    async createACIInstance(token, subscriptionId, resourceGroup, identity, containerGroupName, repoUrl, repoCommitHash, tfvars) {
        let term = this.state.xterm;
        term.writeln("\r\nStarting ACI Container for deployment ");

        // let token = this.props.user.token;
        console.log(this.props.user.token);
        const creds = new msRest.TokenCredentials(token);
        const client = new ContainerInstanceManagementClient(creds, subscriptionId);

        let containerGroupCreated = await client.containerGroups.createOrUpdate(resourceGroup, containerGroupName, {
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
                    image: "lawrencegripper/tfdeployer:dev",
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
        })

        while (true) {
            let existing = await client.containerGroups.get(resourceGroup, containerGroupName);
            console.log(existing);
            if (existing.containers[0].instanceView.currentState.state !== "Running") {
                if (existing.containers[0].instanceView.currentState.detailStatus === "Completed" || existing.containers[0].instanceView.currentState.detailStatus === "Terminated") {
                    term.writeln("Container instance already exited :(");
                    throw "failed"
                }
                await sleep(3000);
                continue
            }
            if (existing.ipAddress != null) {
                if (existing.ipAddress.ip === undefined) {
                    term.writeln("IP Address is undefined, something has gone wrong");
                    throw "failed"
                }
                return existing.ipAddress.ip;
            }
            return "failed"
        }
    }

    connect = this.connect.bind(this);

    async connect(address, onClose) {
        let term = this.state.xterm;

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
                                    this.state.xterm.writeln("\r\n" + forcedChalk.blueBright("The Terraform process exited: cleaning up...."));
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
                    console.log("sending" + data);
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

    // Todo: This won't work
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

function retryStrategy(err, response, body){
    // retry the request if we had an error or if the response was a 'Bad Gateway'
    return err || response.statusCode !== 200;
}

const defaultLocation = "eastus";

export default connect(mapStateToProps, mapDispatchToProps)(Preview);