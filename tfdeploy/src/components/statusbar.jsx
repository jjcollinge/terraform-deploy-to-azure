import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import './statusbar.css';
import GitModal from './gitmodal.jsx';
import { connect } from 'react-redux';
import { setGit } from '../actions/gitActions';
import { incrementStage } from '../actions/stageActions';

const defaultGitURL = "https://github.com/repo"
const defaultGitBranch = "master"

const extractBranchFromURL = (url) => {
    let branch = url.split("tree/").pop(); // Warning: will only work with standard GitHub urls
    if (branch === url) {
        branch = 'master'
    }
    return branch
}

class StatusBar extends Component {
    state = {
        promptGit: false,
    }

    onSetGit = this.onSetGit.bind(this);

    onSetGit(url) {
        let branch = extractBranchFromURL(url)
        this.props.setGit({
            url: url,
            branch: branch
        })
        this.setState({
            promptGit: false
        });
    }

    componentWillMount() {
        let referrer = localStorage.getItem('referrer')
        localStorage.removeItem('referrer')
        if (referrer === null || referrer === "") {
            return this.setState({ promptGit: true });
        }
        let branch = extractBranchFromURL(referrer)
        this.props.setGit({
            url: referrer,
            branch: branch
        })
    }

    render() {
        return (
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                className="statusbar">
                {this.state.promptGit ? <GitModal setGit={this.onSetGit} /> : ''}
                <Grid item xs={12} className="statusbar-gitinfo">
                    <a href={this.props.git.url} target="_blank" className="statusbar-giturl">{this.props.git.url}</a>
                    <span className="statusbar-gitbranch btn btn-sm">{this.props.git.branch}</span>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => ({
    git: state.git,
});

const mapDispatchToProps = dispatch => ({
    setGit: (git) => {
        dispatch(setGit(git));
    },
    incrementStage: () => {
        dispatch(incrementStage());
    }
})


export default connect(mapStateToProps, mapDispatchToProps)(StatusBar);