import React, { Component } from 'react';
import { Grid } from '@material-ui/core'
import { connect } from 'react-redux';
import { incrementStage } from './../actions/stageActions';
import { addVariable, TEXT_FIELD } from '../actions/variablesActions';
import './loading.css';
import logo from './logo.svg';
import './../actions/stageActions';
import hcltojson from 'hcl-to-json';

const re = /(?:\.([^.]+))?$/;

const bin2string = (array) => {
    var result = "";
    for (var i = 0; i < array.length; ++i) {
        result += (String.fromCharCode(array[i]));
    }
    return result;
}

const cloneRepo = async (w, url, dir) => {
    await w.pfs.mkdir(dir)
    await w.git.clone({
        dir,
        corsProxy: 'https://cors.isomorphic-git.org',
        url: url,
        ref: 'master',
        singleBranch: true,
        depth: 1,
    });
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
        props.addVariable({
            name: key,
            type: TEXT_FIELD,
        });
    };
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
    console.log("Subs")
    console.log(subs)
}

class Loading extends Component {
    state = {
        text: "Loading",
        numDots: 1,
        hasClonedGit: false,
        isCloningGit: false,
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

    async componentDidUpdate() {
        let dir = "repo"
        const w = window;
        if (!w.pfs) {
            console.log("PFS not ready")
            return
        }
        if (this.props.git.url === undefined) {
            console.log("git info is not set")
            return
        }
        if (this.state.isCloningGit) {
            console.log("already cloning git")
            return
        }
        if (this.state.hasClonedGit) {
            console.log("has cloned git")
            return
        }
        this.setState({ isCloningGit: true }, async () => {
            try {
                let mergedFile = 'merged.tf'
                let mergedFileExists = await w.pfs.exists(mergedFile)
                if (!mergedFileExists) {
                    console.log("cloning git repo")
                    await cloneRepo(w, this.props.git.url, dir)
                    console.log("extracting hcl")
                    let hclFiles = await extractHCLFiles(w, dir)
                    console.log("merging hcl")
                    await mergeHCLFiles(w, dir, hclFiles, mergedFile)
                    console.log("convert hcl to json")
                    let json = await convertHCLtoJSON(w, this.props, mergedFile)
                    //await addOptions(this.props)
                    console.log("setting variables")
                    await setVariables(this.props, json.variable)
                    var _this = this;
                    this.setState({ hasClonedGit: true }, () => {
                        console.log("incrementing stage")
                        _this.props.incrementStage();
                        _this.componentWillUnmount();
                    });
                }
            } catch (err) {
                clearInterval(this.interval);
                this.setState({
                    text: `Error: ${err.message}`,
                    numDots: 0,
                });
                console.error(err); // TODO: Handle errors
            }
        });
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
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Loading);