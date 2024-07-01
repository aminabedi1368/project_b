import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import EmployeeForm from './components/EmployeeForm';
import EmployeeList from './components/EmployeeList';
import './App.css';

const App = () => {
    return (
        <ApolloProvider client={client}>
            <div className="app">
                <h1>Employee Management</h1>
                <EmployeeForm />
                <EmployeeList />
            </div>
        </ApolloProvider>
    );
};

export default App;
