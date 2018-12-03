import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import './statusBar.css';
import GitModal from './gitModal.jsx';
import { connect } from 'react-redux';
import { setGit } from '../actions/gitActions';
import { incrementStage } from '../actions/stageActions';

const defaultGitBranch = "master"

const parseBranch = (url) => {
    // Warning: will only work with standard GitHub urls
    let branch = url.split("tree/").pop();
    if (branch === url) {
        branch = defaultGitBranch;
    }
    return branch;
}

const parseBaseRepo = (url) => {
    // Warning: will only work with standard GitHub urls
    let branch = url.indexOf("/tree")
    if (branch !== -1) {
        return url.substring(0, branch)
    }
    return url
}

class StatusBar extends Component {
    state = {
        promptGit: false,
    }

    onSetGit = this.onSetGit.bind(this);

    onSetGit(url) {
        let branch = parseBranch(url);
        let base = parseBaseRepo(url);
        this.props.setGit({
            url: url,
            branch: branch,
            base: base,
        });
        this.setState({
            promptGit: false
        });
    }

    componentWillMount() {
        let referrer = localStorage.getItem('referrer')

        // Referrer not set, prompt user
        if (!referrer) {
            return this.setState({ promptGit: true });
        }

        // Referrer set, use it.
        localStorage.removeItem('referrer')
        this.onSetGit(referrer);
    }

    render() {
        let prompt = this.state.promptGit ? <GitModal setGit={this.onSetGit} /> : '';

        return (
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                className="statusbar">
                { prompt }
                <Grid item xs={12} className="statusbar-gitinfo">
                    <a href={this.props.git.url} target="_blank" className="statusbar-giturl">{this.props.git.base}</a>
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
});


export default connect(mapStateToProps, mapDispatchToProps)(StatusBar);