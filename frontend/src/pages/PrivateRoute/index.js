import React, { useMemo } from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import { useUserContext } from '../../context/user_context';

// Routes that should bounce an already-signed-in customer to their account.
const GUEST_ONLY = ['/login', '/register', '/forgot-password', '/reset-password'];

/**
 * Guarded customer route.
 *
 * This MUST render a real <Route>. It previously returned `children` directly,
 * which created no router match context — so `useParams()` returned an empty
 * object and `/orders/:id` ran with `id === undefined`. SingleOrderPage then
 * called `id.slice(-8)` and threw, the app-level ErrorBoundary caught it, and
 * because that boundary never reset, every later navigation looked broken until
 * a manual reload.
 *
 * <Switch> still selected these elements because it reads the `path` prop off
 * any child, which is why list pages worked and only detail pages broke.
 *
 * The old `/products` and `/admins` branches checked `currentUser.privilege` —
 * admin logic copy-pasted into the customer guard. Customers have no privilege
 * field, so those branches could only ever redirect. Removed.
 */
const PrivateRoute = ({ children, ...rest }) => {
  const { currentUser, userLoading } = useUserContext();
  const location = useLocation();

  const loginRedirect = useMemo(
    // Remember where they were actually going, not the route pattern, so the
    // post-login bounce lands on /orders/abc123 rather than "/orders/:id".
    () => ({ pathname: '/login', state: { from: location.pathname } }),
    [location.pathname]
  );

  const guarded = () => {
    // Firebase is still resolving the session — render nothing rather than
    // flashing the login page at someone who is in fact signed in.
    if (userLoading) return null;

    if (GUEST_ONLY.includes(rest.path)) {
      return currentUser ? <Redirect to={location.state?.from || '/'} /> : children;
    }

    return currentUser ? children : <Redirect to={loginRedirect} />;
  };

  return <Route {...rest}>{guarded()}</Route>;
};

export default PrivateRoute;
