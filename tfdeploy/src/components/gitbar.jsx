import React, { Component } from 'react';
import './gitbar.css';

class GitBar extends Component {
    state = {
        gitURL: "https://repository.org/repo",
        branch: "master",
    };

    render() {
        return (
            <div className="gitbar" >
                <div className="gitbar-content">
                    <span className="gitbar-url">
                        <strong>Git:</strong> {this.state.gitURL}
                    </span>
                    <span className="gitbar-branch">
                        <div className="btn btn-sm">
                            {this.state.branch}
                        </div>
                    </span>
                </div>
            </div>
        );
    }
}

export default GitBar