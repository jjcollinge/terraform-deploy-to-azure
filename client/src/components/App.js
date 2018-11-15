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

const loadingStage = -1;
const variablesStage = 0;
const previewStage = 1;

const App = (props) => {
  document.body.style = 'background: #3B3838;height: 100vh;margin: 0px;';
  document.getElementById("root").style.height = "100%"

  let loading = <Loading />
  let variablesForm = <VariablesForm />
  let preview = <Preview />
  let content;

  if (props.git.url) {
    switch (props.stage) {
      case loadingStage:
        content = loading;
        break;
      case variablesStage:
        content = variablesForm;
        break;
      case previewStage:
        content = preview;
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