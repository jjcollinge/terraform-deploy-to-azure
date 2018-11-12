import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import { incrementStage } from '../actions/stageActions';
import { connect } from 'react-redux';
import { Terminal } from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';
import style from 'xterm/dist/xterm.css';
import './preview.css';
import * as WebfontLoader from 'xterm-webfont'
import chalk from 'chalk';
import * as msRest from 'ms-rest-js';
import {ContainerInstanceManagementClient} from '../libs/azure-containerinstance/esm/containerInstanceManagementClient'
import {token, subscriptionId} from './creds.private'

const terminalStyle = {
    margin: "3% 0"
}

let options = { enabled: true, level: 2 };
const forcedChalk = new chalk.constructor(options);

class Preview extends Component {
    state = {
        output: "Loading...",
        xterm: {},
    }

    async componentDidMount() {
        let termElem = document.getElementById('terminal')
        Terminal.applyAddon(fit);
        Terminal.applyAddon(WebfontLoader);

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
            console.log(variable)
            let value = variable.value ? variable.value : '""';
            xterm.writeln(`${variable.name} = ${value}`)
            
            tfvars.push({
                name: "TF_VAR_" + variable.name,
                value: value,
            });
        })
        xterm.writeln("- - - - - - - - - - - - - -")
        xterm.fit();

        this.setState({ xterm: xterm });

        try {
            let ipAddress = await this.createACIInstance(token, subscriptionId, "temp-deployazure", "container1", this.props.git.url, this.props.git.commit, tfvars);
            await this.connect(ipAddress);

        } catch (e) {
            xterm.writeln(e.toString());
        }

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

    createACIInstance = this.createACIInstance.bind(this);

    async createACIInstance(token, subscriptionId, resourceGroup, containerGroupName, repoUrl, repoCommitHash, tfvars) {
        let term = this.state.xterm;
        term.write("Starting ACI Container for deployment");

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
            location: "eastus",
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
                            command: ["cat", "/deployer/ready.txt"]
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
                            memoryInGB: 1,
                            cpu: 1,
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
                await sleep(5000)
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
    
    async connect(address) {
        let term = this.state.xterm;

        return new Promise(function (resolve, reject) {

            // Second connection suceeds
            let ws = new WebSocket("ws://" + address + ":3012");

            ws.onopen = function () {
                ws.send("start");
                resolve("connected");
            };

            ws.onmessage = function (evt) {
                term.writeln(evt.data);
            };
            ws.onclose = function () {
                console.log("connection lost");
                throw("Connection error");
            };
        });
    }

    // Todo: This won't work
    accept() {
        // ws.send("yes\n");
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

export default connect(mapStateToProps, mapDispatchToProps)(Preview);