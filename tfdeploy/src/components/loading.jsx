import React, { Component } from 'react';
import { Grid } from '@material-ui/core'
import { connect } from 'react-redux';
import './loading.css';
import logo from './logo.svg';
import './../actions/stageActions';
import { incrementStage } from './../actions/stageActions';
import { addVariable, TEXT_FIELD } from '../actions/variablesActions';
import hcltojson from 'hcl-to-json';

const re = /(?:\.([^.]+))?$/;

const hide = {
    display: 'none'
}

const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const bin2string = (array) => {
    var result = "";
    for (var i = 0; i < array.length; ++i) {
        result += (String.fromCharCode(array[i]));
    }
    return result;
}

const cloneRepo = async (w, dir) => {
    console.log("making dir")
    await w.pfs.mkdir(dir)

    console.log("starting clone")
    await w.git.clone({
        dir,
        corsProxy: 'https://cors.isomorphic-git.org',
        url: 'https://github.com/jjcollinge/tfexample',
        ref: 'master',
        singleBranch: true,
        depth: 1,
    });
    console.log("finished clone")
}

const extractHCLFiles = async (w, dir) => {
    let files = await w.pfs.readdir(dir);
    console.log(files)
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
    console.log(hclFiles)
    return hclFiles
}

const mergeHCLFiles = async (w, dir, hclFiles, outputFile) => {
    await w.pfs.writeFile(outputFile, '')
    console.log("created merge file")
    hclFiles.forEach(async file => {
        let filePath = dir + '/' + file // check if this is always work in BrowserFS
        console.log(`merging file ${filePath}`)
        let buf = await w.pfs.readFile(filePath)
        console.log(`read file ${filePath}`)
        await w.pfs.appendFile(outputFile, buf)
        console.log(`merged ${filePath} in ${outputFile}`)
    });
}

const convertHCLtoJSON = async (w, props, hclFile) => {
    console.log("reading merged file")
    var buf = await w.pfs.readFile(hclFile)
    let contents = bin2string(buf)
    console.log(contents)
    let jsonContent = hcltojson(contents)
    console.log(jsonContent)
    for (var prop in jsonContent.variable) {
        console.log(prop)
        props.addVariable({
            name: prop,
            type: TEXT_FIELD,
        });
    };
}

class Loading extends Component {
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

        // Sleep long enough for PFS to become created
        await sleep(100)

        try {
            await cloneRepo(w, dir)
            let hclFiles = await extractHCLFiles(w, dir)
            let mergedFile = 'merged.tf'
            await mergeHCLFiles(w, dir, hclFiles, mergedFile)
            await convertHCLtoJSON(w, this.props, mergedFile)

            // TODO: Fetch available values
        } catch (err) {
            console.error(err) // TODO: Handle errors
        }
        this.props.incrementStage();
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
                className="placeholder"
                style={this.props.showLoading ? {} : hide}>
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

const mapStateToProps = state => {
    return {
        showLoading: state.stage === -1,
    }
};

const mapDispatchToProps = dispatch => ({
    incrementStage: () => {
        dispatch(incrementStage())
    },
    addVariable: (v) => {
        dispatch(addVariable(v))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Loading);