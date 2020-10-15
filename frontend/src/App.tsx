import React from 'react';
import logo from './logo.svg';
import './App.css';
import Register from './register'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Register />
      </header>
    </div>
  );
}

export default App;
