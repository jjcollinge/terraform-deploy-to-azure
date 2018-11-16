import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Grid } from '@material-ui/core';
import { connect } from 'react-redux';
import './variablesForm.css'
import { setVariable, TEXT_FIELD } from '../actions/variablesActions';
import { incrementStage } from '../actions/stageActions';

const required = value => value ? undefined : 'Required';

const renderField = ({ input, label, type, meta: { touched, error, warning } }) => (
    <div>
        <label>{label}</label>
        {touched && ((error && <span className="variablesform-field err">{error}</span>) ||
            (warning && <span className="variablesform-field warn">{warning}</span>))}
        <div>
            <input {...input} placeholder={label} type={type} />
        </div>
    </div>
);

class VariablesForm extends Component {

    handlePlanSubmit = this.handlePlanSubmit.bind(this);

    async handlePlanSubmit(values) {
        for (var prop in values) {
            if (values.hasOwnProperty(prop)) {
                this.props.setVariable(prop, values[prop]);
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
                                    <Field name={v.name} component={renderField} type="text" label={v.name} validate={[required]} />
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

const mapStateToProps = (state) => {
    let initialValues = {}
    state.variables.map((v, i) => {
        initialValues[v.name] = v.value
    });
    return {
        variables: state.variables,
        initialValues: initialValues,
    };
}

const mapDispatchToProps = dispatch => ({
    setVariable: (name, value) => {
        dispatch(setVariable(name, value));
    },
    incrementStage: () => {
        dispatch(incrementStage());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(
    reduxForm({
        form: 'variables',
        enableReinitialize: true,
    })(VariablesForm))