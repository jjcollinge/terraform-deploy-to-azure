import React, { Component } from 'react';
import { Grid } from '@material-ui/core'
import './loading.css';
import logo from './logo.svg';

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
        new Promise(resolve => setTimeout(resolve, 3000));

        // Update stage, hide self and show next component
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

export default Loading