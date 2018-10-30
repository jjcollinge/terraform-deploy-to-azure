import React, { Component } from 'react';
import './spinner.css';
import logo from './logo.svg';

class Spinner extends Component {
    state = {
        text: "Preparing environment",
        numDots: 1
    };

    tick() {
        this.setState(prevState => ({
            numDots: (prevState.numDots + 1) % 3
        }));
    }

    componentDidMount() {
        this.interval = setInterval(() => this.tick(), 400);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <div className="spinner">
                <span className="spinner-text">
                    {this.state.text}
                </span>
                <span>
                    {".".repeat(this.state.numDots + 1)}
                </span>
                <img src={logo} className="spinner-logo" alt="logo" />
            </div>
        );
    }
}

export default Spinner