import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import './preview.css';
import { incrementStage } from '../actions/stageActions';
import { connect } from 'react-redux';

const hide = {
    display: 'none'
}

const terminalStyle = {
    margin: "3% 0"
}

class Preview extends Component {
    state = {
        output: "Loading..."
    }

    render() {
        console.log(this.props)

        let vars = []
        let i = 0
        this.props.variables.forEach(element => {
            vars.push(<div key={`var${i}`}>{element.name}={element.value}</div>);
            i++;
        });

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
                <div className="preview-terminal-text">
                    {vars}
                </div>
            </Grid>
        </Grid>
        )
    }
}

const mapStateToProps = state => ({
    showPreview: state.stage === 1,
    variables: state.variables
});

const mapDispatchToProps = dispatch => ({
    incrementStage: () => {
        dispatch(incrementStage());
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Preview);