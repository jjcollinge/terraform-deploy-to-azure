import React from 'react';
import { connect } from 'react-redux';
import NavBar from './navbar'
import StatusBar from './statusbar'
import Loading from './loading'
import VariablesForm from './variablesform'
import Preview from './preview'

const wrapperStyle = {
  height: "100%"
}

const App = (props) => {
  document.body.style = 'background: #3B3838;height: 100vh;margin: 0px;';
  document.getElementById("root").style.height = "100%"
  return (
    <div style={wrapperStyle}>
      <NavBar />
      <StatusBar />
      {props.stage === -1 ? <Loading /> : ''}
      {props.stage ===  0 ? <VariablesForm /> : ''}
      {props.stage ===  1 ? <Preview /> : ''}
    </div>
  );
};

const mapStateToProps = state => ({
  stage: state.stage,
})

export default connect(mapStateToProps)(App);