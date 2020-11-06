import React from 'react';
import './App.css';
import {
  Switch,
  Route,
  HashRouter
} from "react-router-dom";
import ChatMainApolloProvider from './components/ChatMainApolloProvider.react';
import RegisterApolloProvider from './components/RegisterApolloProvider.react';

function App() {
  return (
    <HashRouter basename='/'>
      <Switch>
        <Route path="/main">
          <ChatMainApolloProvider />
        </Route>
        <Route path="/">
          <RegisterApolloProvider />
        </Route>
      </Switch>
    </HashRouter>

  );
}

export default App;
