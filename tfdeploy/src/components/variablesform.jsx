import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Grid } from '@material-ui/core';
import { connect } from 'react-redux';
import './variablesform.css'
import { setVariable } from '../actions/variablesActions';
import { incrementStage } from '../actions/stageActions';

class VariablesForm extends Component {

    handlePlanSubmit = this.handlePlanSubmit.bind(this);

    async handlePlanSubmit(values) {
        for (var prop in values) {
            if (values.hasOwnProperty(prop)) {
                this.props.setVariable(prop, values[prop])
            }
        }
        this.props.incrementStage();
    }

    render() {
        return (
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                className="variablesform">
                <form
                    onSubmit={this.props.handleSubmit(this.handlePlanSubmit)}
                    className="variablesform-form">
                    <Grid
                        container
                        justify="center"
                        alignItems="center">
                        {this.props.variables.map((v, i) =>
                            <Grid
                                item xs={6}
                                key={`varField${i}`}>
                                <Grid container
                                    direction="column"
                                    className="variablesform-field">
                                    <label>{v.name}</label>
                                    <Field name={v.name} component="input" />
                                </Grid>
                            </Grid>
                        )}
                        <Grid
                            container
                            justify="flex-end"
                            direction="row">
                            <button className="variablesform-btn btn btn-primary"
                                disabled={this.props.submitting}
                                type="submit">Exceute Plan</button>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
        )
    }
}

const mapStateToProps = state => ({
    variables: state.variables,
});

const mapDispatchToProps = dispatch => ({
    setVariable: (name, value) => {
        dispatch(setVariable(name, value));
    },
    incrementStage: () => {
        dispatch(incrementStage());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({ form: 'variables' })(VariablesForm))