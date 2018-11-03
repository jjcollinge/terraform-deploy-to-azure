import React from 'react';
import Stages from './stages';
import './navbar.css';
import { Grid } from '@material-ui/core'

// Inlined for order precedence
const style = {
    padding: '6%'
}

const NavBar = (props) => {
    return (
        <Grid
            container
            justify="center"
            alignItems="center"
            alignContent="center"
            className="navbar" style={style}>
            <Grid item xs={12}>
                <h1 className="navbar-title">Deploy to Azure</h1>
            </Grid>
            <Grid item xs={12}>
                <Stages />
            </Grid>
        </Grid>
    );
}

export default NavBar