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

const loadVariables = (props) => {
    props.addVariable({
        name: "Subscription",
        type: TEXT_FIELD,
    })

    props.addVariable({
        name: "Resource Group",
        type: TEXT_FIELD,
    })
}

const bin2string = (array) => {
    var result = "";
    for (var i = 0; i < array.length; ++i) {
        result += (String.fromCharCode(array[i]));
    }
    return result;
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
        sleep(100).then(async () => {
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

            let files = await w.pfs.readdir(dir);
            console.log(files)
            let terraformFiles = [];
            files.forEach(file => {
                let ext = re.exec(file);
                if (ext === undefined) {
                    return;
                }
                if (ext[1] === "tf") {
                    terraformFiles.push(file);
                }
            });
            if (terraformFiles.length < 1) {
                console.error("No Terraform files provided in repo root!")
            }
            console.log(terraformFiles)

            let mergedFile = 'merged.tf'
            await w.pfs.writeFile(mergedFile, '', (err) => {
                if (err) {
                    console.error(err)
                }
                console.log("created merge file")
                terraformFiles.forEach(file => {
                    let filePath = dir + '/' + file // check if this is always work in BrowserFS
                    console.log(`merging file ${filePath}`)
                    w.pfs.readFile(filePath, (err, buf) => {
                        if (err) throw err;
                        console.log(`read file ${filePath}`)
                        w.pfs.appendFile(mergedFile, buf, (err) => {
                            if (err) {
                                throw err;
                            }
                            console.log(`merged ${filePath} in ${mergedFile}`)
                        });
                    });
                });

                console.log("reading merged file")
                w.pfs.readFile(mergedFile, (err, buf) => {
                    if (err) throw err;
                    let contents = bin2string(buf)
                    console.log(contents)
                    let jsonContent = hcltojson(contents)
                    console.log(jsonContent)
                    for (var prop in jsonContent.variable) {
                        console.log(prop)
                        this.props.addVariable({
                            name: prop,
                            type: TEXT_FIELD,
                        });
                    };
                    this.props.incrementStage();
                });
            });
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