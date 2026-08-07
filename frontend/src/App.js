import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Toast, ErrorBoundary } from './components';
import { CheckoutNavbar, ScrollToTop } from './components/archive';
import NewNavbar from './components/home/NewNavbar';
import NewFooter from './components/home/NewFooter';
import { useProductsContext } from './context/products_context';
import { useAdminAuthStore } from './stores';
import 'react-toastify/dist/ReactToastify.css';
import {
  Home,
  About,
  Products,
  Cart,
  SingleProduct,
  Checkout,
  Error,
  Login,
  Register,
  Forgot,
  Reset,
  OrdersPage,
  SingleOrder,
  PrivateRoute,
  ProfilePage,
  ContactPage,
  ShippingPage,
  PrivacyPolicyPage,
  RefundPolicyPage,
  TermsPage,
  WishlistPage,
} from './pages';
import {
  Dashboard as AdminDashboard,
  LoginPage as AdminLogin,
  AdminPrivateRoute,
  OrdersPage as AdminOrders,
  ProductsPage as AdminProducts,
  AdminsPage as AdminUsers,
  SingleOrderPage as AdminSingleOrderPage,
  SingleProductPage as AdminSingleProductPage,
  NewsletterPage as AdminNewsletter,
  CouponsPage as AdminCoupons,
  CustomersPage as AdminCustomers,
  ReturnsPage as AdminReturns,
  InventoryPage as AdminInventory,
  SettingsPage as AdminSettings,
} from './pages/admin';

// Admin routes — no context providers needed with Zustand
const AdminRoutes = () => {
  const checkAdminAuth = useAdminAuthStore((state) => state.checkAdminAuth);

  useEffect(() => {
    checkAdminAuth();
  }, [checkAdminAuth]);

  return (
    <Switch>
      <Route exact path='/'>
        <Redirect to="/admin" />
      </Route>
      <AdminPrivateRoute exact path='/admin/login'>
        <AdminLogin />
      </AdminPrivateRoute>
      <AdminPrivateRoute exact path='/admin'>
        <AdminDashboard />
      </AdminPrivateRoute>
      <AdminPrivateRoute exact path='/admin/products'>
        <AdminProducts />
      </AdminPrivateRoute>
      <AdminPrivateRoute exact path='/admin/products/:id'>
        <AdminSingleProductPage />
      </AdminPrivateRoute>
      <AdminPrivateRoute exact path='/admin/orders'>
        <AdminOrders />
      </AdminPrivateRoute>
      <AdminPrivateRoute exact path='/admin/orders/:id'>
        <AdminSingleOrderPage />
      </AdminPrivateRoute>
      <AdminPrivateRoute exact path='/admin/admins'>
        <AdminUsers />
      </AdminPrivateRoute>
      <AdminPrivateRoute exact path='/admin/newsletter'>
        <AdminNewsletter />
      </AdminPrivateRoute>
      <AdminPrivateRoute exact path='/admin/coupons'>
        <AdminCoupons />
      </AdminPrivateRoute>
      <AdminPrivateRoute exact path='/admin/returns'>
        <AdminReturns />
      </AdminPrivateRoute>
      <AdminPrivateRoute exact path='/admin/customers'>
        <AdminCustomers />
      </AdminPrivateRoute>
      <AdminPrivateRoute exact path='/admin/inventory'>
        <AdminInventory />
      </AdminPrivateRoute>
      <AdminPrivateRoute exact path='/admin/settings'>
        <AdminSettings />
      </AdminPrivateRoute>
      <Route exact path='*'>
        <Error />
      </Route>
    </Switch>
  );
};

// Customer routes — no admin providers mounted
const CustomerRoutes = () => (
  <Switch>
    <Route exact path='/'>
      <>
        <NewNavbar />
        <Home />
        <NewFooter />
      </>
    </Route>
    <Route exact path='/about'>
      <>
        <NewNavbar />
        <About />
        <NewFooter />
      </>
    </Route>
    <Route exact path='/products'>
      <>
        <NewNavbar />
        <Products />
        <NewFooter />
      </>
    </Route>
    <Route exact path='/cart'>
      <>
        <NewNavbar />
        <Cart />
        <NewFooter />
      </>
    </Route>
    <PrivateRoute exact path='/login'>
      <>
        <NewNavbar />
        <Login />
        <NewFooter />
      </>
    </PrivateRoute>
    <PrivateRoute exact path='/register'>
      <>
        <NewNavbar />
        <Register />
        <NewFooter />
      </>
    </PrivateRoute>
    <PrivateRoute exact path='/forgot-password'>
      <>
        <NewNavbar />
        <Forgot />
        <NewFooter />
      </>
    </PrivateRoute>
    <PrivateRoute exact path='/reset-password'>
      <>
        <NewNavbar />
        <Reset />
        <NewFooter />
      </>
    </PrivateRoute>
    <Route exact path='/products/:id'>
      <>
        <NewNavbar />
        <SingleProduct />
        <NewFooter />
      </>
    </Route>
    <Route exact path='/checkout'>
      <>
        <CheckoutNavbar />
        <Checkout />
      </>
    </Route>
    <PrivateRoute exact path='/orders'>
      <>
        <NewNavbar />
        <OrdersPage />
        <NewFooter />
      </>
    </PrivateRoute>
    <PrivateRoute exact path='/orders/:id'>
      <>
        <NewNavbar />
        <SingleOrder />
        <NewFooter />
      </>
    </PrivateRoute>
    <PrivateRoute exact path='/profile'>
      <>
        <NewNavbar />
        <ProfilePage />
        <NewFooter />
      </>
    </PrivateRoute>
    <PrivateRoute exact path='/wishlist'>
      <>
        <NewNavbar />
        <WishlistPage />
        <NewFooter />
      </>
    </PrivateRoute>
    <Route exact path='/contact'>
      <>
        <NewNavbar />
        <ContactPage />
        <NewFooter />
      </>
    </Route>
    <Route exact path='/shipping'>
      <>
        <NewNavbar />
        <ShippingPage />
        <NewFooter />
      </>
    </Route>
    <Route exact path='/privacy-policy'>
      <>
        <NewNavbar />
        <PrivacyPolicyPage />
        <NewFooter />
      </>
    </Route>
    <Route exact path='/refund-policy'>
      <>
        <NewNavbar />
        <RefundPolicyPage />
        <NewFooter />
      </>
    </Route>
    <Route exact path='/terms'>
      <>
        <NewNavbar />
        <TermsPage />
        <NewFooter />
      </>
    </Route>
    <Route exact path='*'>
      <>
        <NewNavbar />
        <Error />
        <NewFooter />
      </>
    </Route>
  </Switch>
);

function App() {
  const { isSidebarOpen } = useProductsContext();

  // Only hide body scroll when sidebar is open, don't create wrapper scrollbar
  React.useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  return (
    <div>
      <Router>
        <ScrollToTop />
        <Toast />
        <ErrorBoundary>
          {(window.location.hostname.startsWith('admin.') || window.location.pathname.startsWith('/admin')) ? (
            <AdminRoutes />
          ) : (
            <CustomerRoutes />
          )}
        </ErrorBoundary>
      </Router>
    </div>
  );
}

export default App;

