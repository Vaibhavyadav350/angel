import React from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import { useAdminAuthStore } from '../../stores';

const AdminPrivateRoute = ({ children, ...rest }) => {
  const { currentAdmin, adminAuthLoading } = useAdminAuthStore();
  const location = useLocation();

  if (adminAuthLoading) {
    return <div>Loading...</div>; // Or your loading component
  }

  // Admin login page - redirect if already logged in
  if (rest.path === '/admin/login') {
    return currentAdmin ? (
      <Redirect to={location.state?.from || '/admin'} />
    ) : (
      <Route {...rest}>{children}</Route>
    );
  }

  // Products page - only super and moderate
  if (rest.path === '/admin/products') {
    return currentAdmin &&
      ['super', 'moderate'].includes(currentAdmin.privilege) ? (
      <Route {...rest}>{children}</Route>
    ) : (
      <Redirect to={location.state?.from || '/admin'} />
    );
  }

  // Admins page - only super
  if (rest.path === '/admin/admins') {
    return currentAdmin && currentAdmin.privilege === 'super' ? (
      <Route {...rest}>{children}</Route>
    ) : (
      <Redirect to={location.state?.from || '/admin'} />
    );
  }

  // Other admin routes - require any admin
  return currentAdmin ? (
    <Route {...rest}>{children}</Route>
  ) : (
    <Redirect
      to={{
        pathname: '/admin/login',
        state: { from: location.pathname },
      }}
    />
  );
};

export default AdminPrivateRoute;

