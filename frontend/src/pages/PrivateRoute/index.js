import React, { useMemo } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { useUserContext } from '../../context/user_context';

const PrivateRoute = ({ children, ...rest }) => {
  const { currentUser, userLoading } = useUserContext();
  const location = useLocation();

  const loginRedirect = useMemo(
    () => ({ pathname: '/login', state: { from: rest.path } }),
    [rest.path]
  );

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
      children
    );
  }

  if (rest.path === '/products') {
    return currentUser &&
      ['super', 'moderate'].includes(currentUser.privilege) ? (
      children
    ) : (
      <Redirect to={location.state?.from ?? '/'} />
    );
  }

  if (rest.path === '/admins') {
    return currentUser && currentUser.privilege === 'super' ? (
      children
    ) : (
      <Redirect to={location.state?.from ?? '/'} />
    );
  }

  return currentUser ? children : <Redirect to={loginRedirect} />;
};
export default PrivateRoute;
