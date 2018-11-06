import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import { incrementStage } from '../actions/stageActions';
import { connect } from 'react-redux';
import { Terminal } from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';
import style from 'xterm/dist/xterm.css';
import './preview.css';

const hide = {
    display: 'none'
}

const terminalStyle = {
    margin: "3% 0"
}

class Preview extends Component {
    state = {
        output: "Loading...",
    }

    componentDidUpdate() {
        if (this.props.showPreview) {
            let termElem = document.getElementById('terminal')
            Terminal.applyAddon(fit);

            let xterm = new Terminal({
                useStyle: true,
                cursorBlink: true,
            });
            xterm.open(termElem);
            xterm.writeln("Ok, let's do this...");
            xterm.fit();
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