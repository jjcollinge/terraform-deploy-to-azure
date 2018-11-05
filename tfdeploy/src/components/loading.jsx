import React, { Component } from 'react';
import { Grid } from '@material-ui/core'
import { connect } from 'react-redux';
import './loading.css';
import logo from './logo.svg';
import './../actions/stageActions';
import { incrementStage } from './../actions/stageActions';
import { addVariable, TEXT_FIELD } from '../actions/variablesActions';

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

class Loading extends Component {
    state = {
        text: "Loading",
        numDots: 1
    };

    tick = this.tick.bind(this);

    tick() {
        this.setState(prevState => ({
            numDots: (prevState.numDots + 1) % 3
        }));
    }

    componentDidMount() {
        this.interval = setInterval(() => this.tick(), 400);

        // Prepare environment
        sleep(3000).then(() => {
            loadVariables(this.props)

            this.props.incrementStage()
        })
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