import React from 'react';
import './stages.css';
import { connect } from 'react-redux';

const allStages = ["Setup", "Preview", "Deploy"];

const Stages = (props) => {
    var stages = allStages.map((name, index) => {
        var stageClass = index == props.stage ? "stage-box stage-active" : "stage-box stage-inactive"
        return (
            <li key={index}>
                <div className={stageClass}>
                    <div className="stage-index">{index + 1}</div>
                </div>
                <h5 className="stage-title">{name}</h5>
            </li>);
    });
    return <ul className="stage-list">{stages}</ul>
}

const mapStateToProps = state => ({
    stage: state.stage,
});

export default connect(mapStateToProps)(Stages)