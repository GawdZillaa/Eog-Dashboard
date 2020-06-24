import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from './Utilities/ApolloSetup';

ReactDOM.render(
    <ApolloProvider client={ApolloClient}>
        <App />
    </ApolloProvider>, 
    document.getElementById('root')
);
