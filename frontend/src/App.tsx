import React from 'react';
import './App.css';
import Register from './components/register.react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { ApolloClient, InMemoryCache, createHttpLink, ApolloProvider } from '@apollo/client';
import ChatMain from './components/ChatMain.react';
import { setContext } from '@apollo/client/link/context';
import { split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

function App() {
  const token = localStorage.getItem('token');
  const httpLink = createHttpLink({
    uri: 'http://localhost:4000/graphql',
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
    uri: `ws://localhost:4000/graphql`,
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
    <Router>
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
    </Router>

  );
}

export default App;
