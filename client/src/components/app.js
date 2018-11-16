import React from 'react';
import { connect } from 'react-redux';
import NavBar from './navBar'
import StatusBar from './statusBar'
import Loader from './loader'
import VariablesForm from './variablesForm'
import TerraformTerminal from './terraformTerminal'

const wrapperStyle = {
  height: "100%"
}

const loadingStage = -1;
const varFormStage = 0;
const previewStage = 1;
const deployStage = 2;

const App = (props) => {
  document.body.style = 'background: #3B3838;height: 100vh;margin: 0px;';
  document.getElementById("root").style.height = "100%"

  let content;

  // Pick which screen to render depending
  // on the current stage.
  if (props.git.url) {
    switch (props.stage) {
      case loadingStage:
        content = <Loader />;
        break;
      case varFormStage:
        content = <VariablesForm />;
        break;
      case previewStage || deployStage:
        content = <TerraformTerminal />;
        break;
    }
  }

  return (
    <div style={wrapperStyle}>
      <NavBar />
      <StatusBar />
      { content }
    </div>
  );
};

const mapStateToProps = state => ({
  stage: state.stage,
  git: state.git,
})

export default connect(mapStateToProps)(App);