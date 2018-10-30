import React, { Component } from 'react';
import Stages from './stages';
import './navigation.css';

class Navigation extends Component {
    state = {
        currentStage: 1
    };

    render() {
        return (
            <div className="navigation" >
                <div className="navigation-content">
                    <h1>Deploy to Azure</h1>
                    <div className="navigation-stages">
                        <Stages />
                    </div>
                </div>
            </div>
        );
    }
}

export default Navigation