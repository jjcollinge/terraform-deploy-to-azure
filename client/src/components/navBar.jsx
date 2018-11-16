import React, { Component } from 'react';
import Stages from './stages';
import './navBar.css';
import { Grid } from '@material-ui/core'
import { connect } from 'react-redux';
import { setUser, updateUserToken } from '../actions/userActions';
import { authContext } from '../adalConfig.js';

// Inlined for order precedence
const style = {
    padding: '1%'
}

class NavBar extends Component {

    componentWillMount() {
        // Set current user
        let user = authContext.getCachedUser();
        this.props.setUser(user);

        // Acquire token for Azure
        let token = authContext.getCachedToken();
        if (!token) {
            token = authContext.acquireToken("https://management.core.windows.net/", (err, token) => {
                if (err || !token) {
                    throw "ADAL error acquiring token: " + err;
                }
                this.props.addToken(token)
            });
            return
        }
        this.props.addToken(token)
    }

    render() {
        return (
            <Grid
                container
                justify="center"
                alignItems="center"
                alignContent="center"
                className="navbar" style={style}>
                <Grid
                    container
                    directory="row"
                    justify="flex-end"
                    alignItems="flex-end"
                    className="navbar-user">
                    <Grid item xs={3}>
                        <div>{this.props.user ? this.props.user.userName : ''}</div>
                </Grid>
                </Grid>
                <Grid item xs={12}>
                    <h1 className="navbar-title">Deploy to Azure</h1>
                </Grid>
                <Grid item xs={12}>
                    <Stages />
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user
});

const mapDispatchToProps = dispatch => ({
    setUser: user => {
        dispatch(setUser(user));
    },
    addToken: token => {
        dispatch(updateUserToken(token))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);