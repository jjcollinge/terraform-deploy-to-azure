import React, { Component } from 'react';
import './stages.css';

class Stages extends Component {
    state = {
        currentStage: 0,
        stages: ["Setup", "Preview", "Deploy"]
    };

    render() {
        var stages = this.state.stages.map((name, index) => {
            var stageClass = index == this.state.currentStage ? "stage-box stage-active" : "stage-box stage-inactive"
            return (
                <li key={index}>
                    <div class={stageClass}>
                        <div>{index+1}</div>
                    </div>
                    <div class="stage-title">
                        <h5>{name}</h5>
                    </div>
                </li>);
        });
        return <ul id="stages" className="stage-list">{stages}</ul>
    }
}

export default Stages