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
import { ContainerInstanceManagementClient } from '../libs/azure-containerinstance/esm/containerInstanceManagementClient'
import { ResourceManagementClient } from '../libs/arm-resources/esm/resourceManagementClient'
import { token, subscriptionId } from './creds.private'

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
    }

    async componentDidMount() {
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
        let tfvars = []
        console.log(this.props.variables)
        this.props.variables.forEach(variable => {
            console.log(variable);
            let value = variable.value ? variable.value : '""';
            xterm.writeln(`${variable.name} = ${value}`);

            tfvars.push({
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
            await this.createResourceGroup(token, subscriptionId, resourceGroupName)
            let ipAddress = await this.createACIInstance(token, subscriptionId, resourceGroupName, guid, this.props.git.url, this.props.git.commit, tfvars);

            xterm.writeln("\r\nContainer started @ " + ipAddress);

            // Connect and provide a func to execute when connection lost
            await this.connect(ipAddress, async e => {
                let skull = "☠️";
                xterm.writeln(forcedChalk.red(`\r\n\r\n Connection closed ${skull}, retrying in 8 seconds`));
                await sleep(8000);
                await this.connect(ipAddress, e => {
                    xterm.writeln(forcedChalk.red(`\r\n\r\n Connection closed ${skull}, giving up`));
                });

                xterm.attach(this.state.webSocket);

                clearInterval(t);
            });
            xterm.attach(this.state.webSocket);

            clearInterval(t);

            xterm.writeln(forcedChalk.greenBright("\r\nConnected interactive terminal to Terraform container \n\n"));


        } catch (e) {
            xterm.writeln("An error occurred: " + e.toString());
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

    async createACIInstance(token, subscriptionId, resourceGroup, containerGroupName, repoUrl, repoCommitHash, tfvars) {
        let term = this.state.xterm;
        term.writeln("\r\nStarting ACI Container for deployment ");

        // let token = this.props.user.token;
        console.log(this.props.user.token);
        const creds = new msRest.TokenCredentials(token);
        const client = new ContainerInstanceManagementClient(creds, subscriptionId);

        let envs = [
            {
                name: "AES_KEY",
                secureValue: ""
            },
            {
                name: "HMAC_KEY",
                secureValue: ""
            }
        ];
        // Add additional vars
        tfvars.forEach(function (x) {
            envs.push(x)
        });

        let containerGroupCreated = await client.containerGroups.createOrUpdate(resourceGroup, containerGroupName, {
            location: defaultLocation,
            osType: "linux",
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
                    image: "lawrencegripper/tfdeployer",
                    livenessProbe: {
                        exec: {
                            command: ["echo", "1"]
                        }
                    },
                    readinessProbe: {
                        exec: {
                            command: ["cat", "/server/ready.txt"]
                        }
                    },
                    ports: [
                        {
                            protocol: "TCP",
                            port: 3012,
                        },
                    ],
                    environmentVariables: envs,
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
                await sleep(5000);
                continue
            }
            if (existing.ipAddress != null) {
                if (existing.ipAddress.ip === undefined) {
                    term.writeln("IP Address is undefined, something has gone wrong");
                    throw "failed"
                }
                await sleep(25000);
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
            this.setState({ webSocket: ws });

            ws.onopen = function () {
                ws.send("start");
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

const defaultLocation = "eastus";

export default connect(mapStateToProps, mapDispatchToProps)(Preview);