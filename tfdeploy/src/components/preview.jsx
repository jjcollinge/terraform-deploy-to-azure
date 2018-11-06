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

const hide = {
    display: 'none'
}

const terminalStyle = {
    margin: "3% 0"
}

let options = {enabled: true, level: 2};
const forcedChalk = new chalk.constructor(options);

class Preview extends Component {
    state = {
        output: "Loading...",
        xterm: {},
    }

    async componentDidUpdate() {
        if (this.props.showPreview) {
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
            console.log(this.props.variables)
            this.props.variables.forEach(variable => {
                console.log(variable)
                xterm.writeln(`${variable.name} = ${variable.value ? variable.value : '""'}`)
            })
            xterm.writeln("- - - - - - - - - - - - - -")
            xterm.fit();

            this.state.xterm = xterm;
        }
    }

    render() {
        return (<Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            alignContent="stretch"
            className="preview"
            style={this.props.showPreview ? {} : hide}>
            <Grid
                item xs={12}
                style={terminalStyle}
                className="preview-terminal">
                <div id='terminal'></div>
            </Grid>
        </Grid>
        )
    }
}

const mapStateToProps = state => ({
    showPreview: state.stage === 1,
    variables: state.variables,
    user: state.user,
});

const mapDispatchToProps = dispatch => ({
    incrementStage: () => {
        dispatch(incrementStage());
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Preview);