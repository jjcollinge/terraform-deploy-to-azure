import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Navigation from './components/navigation'
import GitBar from './components/gitbar'
import Spinner from './components/spinner'

class App extends Component {
  render() {
    document.body.style = 'background: #3B3838;';
    return (
      <div className="app">
        <div className="app-flex-container">
          <Navigation />
          <GitBar />
          <Spinner />
        </div>
      </div>
    );
  }
}

export default App;
