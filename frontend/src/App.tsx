import React from 'react';
import './App.css';
import Register from './components/register.react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  HashRouter
} from "react-router-dom";
import { ApolloClient, InMemoryCache, createHttpLink, ApolloProvider } from '@apollo/client';
import ChatMain from './components/ChatMain.react';
import { setContext } from '@apollo/client/link/context';
import { split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

function App() {
  const PRODUCTION = window.location.href.includes("https://rithik.me/");
  const serverURL = PRODUCTION ? 'https://e2-chat.herokuapp.com' : 'http://localhost:4000';
  const wsURL = PRODUCTION ? 'wss://e2-chat.herokuapp.com' : 'ws://localhost:4000';
  const token = localStorage.getItem('token');
  const httpLink = createHttpLink({
    uri: `${serverURL}/graphql`,
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token ? `${token}` : "",
      }
    }
  });
  
  const wsLink = new WebSocketLink({
    uri: `${wsURL}/graphql`,
    options: {
      reconnect: true,
      connectionParams: {
        Authorization: token,
      },
    }
  });
  
  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    authLink.concat(httpLink),
  );

  const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache()
  });

  return (
    <HashRouter basename='/'>
      <Switch>
        <Route path="/main">
          <ApolloProvider client={client}>
            <div>
              <ChatMain></ChatMain>
            </div>
          </ApolloProvider>
        </Route>
        <Route path="/">
        <ApolloProvider client={client}>
          <div className="App">
            <header className="App-header">
              <Register />
            </header>
          </div>
         </ApolloProvider>
        </Route>
      </Switch>
    </HashRouter>

  );
}

export default App;
