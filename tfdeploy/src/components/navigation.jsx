import React, { Component } from 'react';
import Stages from './stages';
import './navigation.css';

class Navigation extends Component {
    render() {
        return (
            <div className="navigation" >
                <div className="navigation-content">
                    <h1>Deploy to Azure</h1>
                    <Stages />
                </div>
            </div>
        );
    }
}

export default Navigation