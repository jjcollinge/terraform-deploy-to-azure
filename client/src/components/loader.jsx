import React, { Component } from 'react';
import { Grid } from '@material-ui/core'
import { connect } from 'react-redux';
import { incrementStage } from '../actions/stageActions';
import { addVariable, TEXT_FIELD } from '../actions/variablesActions';
import './loader.css';
import logo from './logo.svg';
import '../actions/stageActions';
import { setGitCommit } from '../actions/gitActions';
import hcltojson from 'hcl-to-json';

const re = /(?:\.([^.]+))?$/;

const bin2string = (array) => {
    var result = "";
    for (var i = 0; i < array.length; ++i) {
        result += (String.fromCharCode(array[i]));
    }
    return result;
}

const cloneRepo = async (w, url, branch, dir) => {
    await w.pfs.mkdir(dir)
    await w.git.clone({
        dir,
        corsProxy: 'https://cors.isomorphic-git.org',
        url: url,
        ref: branch,
        singleBranch: true,
        depth: 1,
    });
    let commit = await w.git.log({ dir: dir, depth: 1, ref: branch })
    return commit[0].oid;
}

const extractHCLFiles = async (w, dir) => {
    let files = await w.pfs.readdir(dir);
    let hclFiles = [];
    files.forEach(file => {
        let ext = re.exec(file);
        if (ext === undefined) {
            return;
        }
        if (ext[1] === "tf") {
            hclFiles.push(file);
        }
    });
    if (hclFiles.length < 1) {
        console.error("No Terraform HCL files provided in repo root!")
    }
    return hclFiles
}

const mergeHCLFiles = async (w, dir, hclFiles, outputFile) => {
    await w.pfs.writeFile(outputFile, '')
    hclFiles.forEach(async file => {
        let filePath = dir + '/' + file // check if this is always work in BrowserFS
        let buf = await w.pfs.readFile(filePath)
        await w.pfs.appendFile(outputFile, buf)
    });
}

const convertHCLtoJSON = async (w, props, hclFile) => {
    var buf = await w.pfs.readFile(hclFile)
    let contents = bin2string(buf)
    let jsonContent = hcltojson(contents)
    return jsonContent
}

const setVariables = async (props, variables) => {
    const keys = Object.keys(variables)
    for (const key of keys) {
        let defaultValue = variables[key].default ? variables[key].default : null;
        props.addVariable({
            name: key,
            value: defaultValue,
            type: TEXT_FIELD,
            secret: false,
        });
    };
    props.addVariable({
        name: "azure_subscription_id",
        type: TEXT_FIELD,
        secret: true,
    });
    // TODO: Remove - bypassing AAD block
    props.addVariable({
        name: "azure_token",
        type: TEXT_FIELD,
        secret: true,
    });
}

const addOptions = async (props) => {
    console.log("Fetching with token")
    console.log(props.user.token)
    let subs = await fetch("https://management.azure.com/subscriptions", {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + props.user.token,
            'x-ms-version': '2013-08-01',
            'Origin': 'localhost'
        })
    })
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class Loader extends Component {
    state = {
        text: "Loading",
        numDots: 1,
    };

    tick = this.tick.bind(this);

    tick() {
        this.setState(prevState => ({
            numDots: (prevState.numDots + 1) % 3
        }));
    }

    componentWillMount() {
        this.interval = setInterval(() => this.tick(), 400);
    }

    async componentDidMount() {
        let dir = "repo"
        const w = window;

        let attempts = 0;
        while (attempts < 3 && !w.pfs) {
            console.log("Waiting for PFS to initialize")
            await sleep(1000);
        }
        if (attempts >= 3) {
            throw "PFS did not initialize within sufficent time threshold";
        }

        try {
            let mergedFile = 'merged.tf'
            let mergedFileExists = await w.pfs.exists(mergedFile)
            if (!mergedFileExists) {
                console.log(`cloning git repo ${this.props.git.base} @ branch ${this.props.git.branch}`)
                let commit = await cloneRepo(w, this.props.git.base, this.props.git.branch, dir)
                this.props.setGitCommit(commit);

                console.log("extracting hcl")
                let hclFiles = await extractHCLFiles(w, dir)

                console.log("merging hcl")
                await mergeHCLFiles(w, dir, hclFiles, mergedFile)

                console.log("convert hcl to json")
                let json = await convertHCLtoJSON(w, this.props, mergedFile)

                //await addOptions(this.props)

                console.log("setting variables")
                await setVariables(this.props, json.variable)

                console.log("incrementing stage")
                this.props.incrementStage();
                this.componentWillUnmount();
            }
        } catch (err) {
            clearInterval(this.interval);
            this.setState({
                text: `Error: ${err.message}`,
                numDots: 0,
            });
            console.error(err); // TODO: Handle errors
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
                className="placeholder">
                <Grid item xs={4} className="placeholder-text">
                    {this.state.text + ".".repeat(this.state.numDots + 1)}
                </Grid>
                <Grid item xs={4}>
                    <img src={logo} className="placeholder-logo" alt="logo" />
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user,
    git: state.git,
});

const mapDispatchToProps = dispatch => ({
    incrementStage: () => {
        dispatch(incrementStage())
    },
    addVariable: (v) => {
        dispatch(addVariable(v))
    },
    setGitCommit: (commit) => {
        dispatch(setGitCommit(commit))
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Loader);