import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import './statusbar.css';

const defaultGitURL = "https://github.com/repo"
const defaultGitBranch = "master"

class StatusBar extends Component {
        state = {
            git: {
                url: defaultGitURL,
                branch: defaultGitBranch,
            }
        }

        componentWillMount() {
            let referrer = "https://github.com/jjcollinge/terraform-deploy-to-azure/tree/jjcollinge/client-app" // document.referrer
            let branch = referrer.split("tree/").pop(); // Warning: will only work with standard GitHub urls
            if (branch === referrer) {
                branch = 'master'
            }
            this.state.git.branch = branch
            this.state.git.url = referrer
        }

        render() {
            return (
                <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                    className="statusbar">
                    <Grid item xs={12} className="statusbar-gitinfo">
                        <a href={this.state.git.url} target="_blank" className="statusbar-giturl">{this.state.git.url}</a>
                        <span className="statusbar-gitbranch btn btn-sm">{this.state.git.branch}</span>
                    </Grid>
                </Grid>
            );
        }
}

export default StatusBar;