import React from 'react';
import { useSelector } from 'react-redux';
import Login from './components/pages/Login';

const ProtectedRoute = ({ element }) => {
    const isAuthenticated = useSelector(state => state.auth.token);
    if (isAuthenticated) {
        return element
    }
    return (
        <Login />
    )
}
export default ProtectedRoute;
