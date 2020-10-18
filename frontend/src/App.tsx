import React from 'react';
import logo from './logo.svg';
import './App.css';
import Register from './components/register'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { ApolloClient, InMemoryCache, createHttpLink, ApolloProvider } from '@apollo/client';
import ChatMain from './components/ChatMain.react';
import { setContext } from '@apollo/client/link/context';

function App() {

  const httpLink = createHttpLink({
    uri: 'http://localhost:4000/graphql',
  });

  const authLink = setContext((_, { headers }) => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXI0IiwicHVibGljS2V5IjoicGs1IiwiaWF0IjoxNjAyOTA4MzcxfQ.0NE-nScEZStrxA4ZC78QAjBfKp7Jl5HegutjZgER9ww";
    return {
      headers: {
        ...headers,
        authorization: token ? `${token}` : "",
      }
    }
  });
  
  const client = new ApolloClient({
    link: authLink.concat(httpLink),
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
