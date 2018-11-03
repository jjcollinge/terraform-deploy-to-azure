import React from 'react';
import NavBar from './navbar'
import StatusBar from './statusbar'
import Loading from './loading'

const App = (props) => {
  document.body.style = 'background: #3B3838;';
  return (
    <div>
      <NavBar />
      <StatusBar />
      <Loading />
    </div>
  );
};

export default App