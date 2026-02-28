import React from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import { useUserContext } from '../../context/user_context';

const PrivateRoute = ({ children, ...rest }) => {
  const { currentUser, userLoading } = useUserContext();
  const location = useLocation();

  // While Firebase auth state is loading, render nothing to prevent flash
  if (userLoading) {
    return null;
  }

  if (
    rest.path === '/login' ||
    rest.path === '/register' ||
    rest.path === '/forgot-password' ||
    rest.path === '/reset-password'
  ) {
    return currentUser ? (
      <Redirect to={location.state?.from ?? '/'} />
    ) : (
      <Route {...rest}>{children}</Route>
    );
  }

  return currentUser ? (
    <Route {...rest}>{children}</Route>
  ) : (
    <Redirect
      to={{
        pathname: '/login',
        state: { from: location.pathname },
      }}
    />
  );
};
export default PrivateRoute;
