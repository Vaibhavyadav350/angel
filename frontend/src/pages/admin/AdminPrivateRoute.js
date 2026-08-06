import React, { useMemo } from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import { useAdminAuthStore } from '../../stores';

// Privilege required to view each admin path. Anything not listed only needs a
// logged-in admin. Keeping this as data (rather than a chain of if-statements on
// `rest.path`) means adding a guarded route is a one-line change.
const REQUIRED_PRIVILEGE = {
  '/admin/products': ['super', 'moderate'],
  '/admin/admins': ['super'],
};

const Spinner = () => (
  <div className='min-h-screen bg-champagne flex items-center justify-center font-body text-bronze'>
    <div className='w-8 h-8 border-2 border-bronze/10 border-t-gold rounded-full animate-spin' />
  </div>
);

/**
 * Guarded admin route.
 *
 * This MUST render a real <Route>. It previously returned `children` directly,
 * which meant no router match context was created — so `useParams()` returned an
 * empty object and every admin detail page (`/admin/products/:id`,
 * `/admin/orders/:id`, …) fetched with `id === undefined` and rendered its error
 * state. <Switch> still matched these elements because it reads the `path` prop
 * off any child, which is why the list pages worked and only detail pages broke.
 */
const AdminPrivateRoute = ({ children, ...rest }) => {
  const { currentAdmin, adminAuthLoading } = useAdminAuthStore();
  const location = useLocation();

  const loginRedirect = useMemo(
    () => ({ pathname: '/admin/login', state: { from: location.pathname } }),
    [location.pathname]
  );

  const guarded = () => {
    if (adminAuthLoading) return <Spinner />;

    // The login page itself: bounce away if already signed in.
    if (rest.path === '/admin/login') {
      return currentAdmin ? <Redirect to={location.state?.from || '/admin'} /> : children;
    }

    if (!currentAdmin) return <Redirect to={loginRedirect} />;

    const required = REQUIRED_PRIVILEGE[rest.path];
    if (required && !required.includes(currentAdmin.privilege)) {
      return <Redirect to={location.state?.from || '/admin'} />;
    }

    return children;
  };

  return <Route {...rest}>{guarded()}</Route>;
};

export default AdminPrivateRoute;
