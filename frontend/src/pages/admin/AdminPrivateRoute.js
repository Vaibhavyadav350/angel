import React, { useMemo } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { useAdminAuthStore } from '../../stores';

const AdminPrivateRoute = ({ children, ...rest }) => {
  const { currentAdmin, adminAuthLoading } = useAdminAuthStore();
  const location = useLocation();

  const loginRedirect = useMemo(
    () => ({ pathname: '/admin/login', state: { from: location.pathname } }),
    [location.pathname]
  );

  if (adminAuthLoading) {
    return (
      <div className='min-h-screen bg-champagne flex items-center justify-center font-body text-bronze'>
        <div className='w-8 h-8 border-2 border-bronze/10 border-t-gold rounded-full animate-spin' />
      </div>
    );
  }

  // Admin login page - redirect if already logged in
  if (rest.path === '/admin/login') {
    return currentAdmin ? (
      <Redirect to={location.state?.from || '/admin'} />
    ) : (
      children
    );
  }

  // Products page - only super and moderate
  if (rest.path === '/admin/products') {
    return currentAdmin &&
      ['super', 'moderate'].includes(currentAdmin.privilege) ? (
      children
    ) : (
      <Redirect to={location.state?.from || '/admin'} />
    );
  }

  // Admins page - only super
  if (rest.path === '/admin/admins') {
    return currentAdmin && currentAdmin.privilege === 'super' ? (
      children
    ) : (
      <Redirect to={location.state?.from || '/admin'} />
    );
  }

  // Other admin routes - require any admin
  return currentAdmin ? children : <Redirect to={loginRedirect} />;
};

export default AdminPrivateRoute;
