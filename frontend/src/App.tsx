import React from 'react';
import logo from './logo.svg';
import './App.css';
import Register from './register'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/main">
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
            </header>
          </div>
        </Route>
        <Route path="/">
          <div className="App">
            <header className="App-header">
              <Register />
            </header>
          </div>
        </Route>
      </Switch>
    </Router>

  );
}

export default App;
