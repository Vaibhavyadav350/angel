import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Toast, ErrorBoundary } from './components';
import { ArchiveNavbar, ArchiveFooter } from './components/archive';
import { useProductsContext } from './context/products_context';
import { AdminProvider } from './context/admin_context';
import { OrderProvider as AdminOrderProvider } from './context/admin_order_context';
import { ProductProvider as AdminProductProvider } from './context/admin_product_context';
import { NewsletterProvider as AdminNewsletterProvider } from './context/newsletter_context';
import { AnalyticsProvider as AdminAnalyticsProvider } from './context/admin_analytics_context';
import { CouponProvider as AdminCouponProvider } from './context/admin_coupon_context';
import { AdminUserProvider } from './context/admin_user_context';
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
} from './pages/admin';

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
      <AdminProvider>
        <AdminProductProvider>
          <AdminOrderProvider>
            <AdminNewsletterProvider>
              <AdminAnalyticsProvider>
                <AdminCouponProvider>
                  <AdminUserProvider>
                    <Router>
                      <Toast />
                      <ErrorBoundary>
                        <Switch>
                          {/* Customer Routes */}
                          <Route exact path='/'>
                            <>
                              <ArchiveNavbar />
                              <Home />
                              <ArchiveFooter />
                            </>
                          </Route>
                          <Route exact path='/about'>
                            <>
                              <ArchiveNavbar />
                              <About />
                              <ArchiveFooter />
                            </>
                          </Route>
                          <Route exact path='/products'>
                            <>
                              <ArchiveNavbar />
                              <Products />
                              <ArchiveFooter />
                            </>
                          </Route>
                          <Route exact path='/cart'>
                            <>
                              <ArchiveNavbar />
                              <Cart />
                              <ArchiveFooter />
                            </>
                          </Route>
                          <PrivateRoute exact path='/login'>
                            <>
                              <ArchiveNavbar />
                              <Login />
                              <ArchiveFooter />
                            </>
                          </PrivateRoute>
                          <PrivateRoute exact path='/register'>
                            <>
                              <ArchiveNavbar />
                              <Register />
                              <ArchiveFooter />
                            </>
                          </PrivateRoute>
                          <PrivateRoute exact path='/forgot-password'>
                            <>
                              <ArchiveNavbar />
                              <Forgot />
                              <ArchiveFooter />
                            </>
                          </PrivateRoute>
                          <PrivateRoute exact path='/reset-password'>
                            <>
                              <ArchiveNavbar />
                              <Reset />
                              <ArchiveFooter />
                            </>
                          </PrivateRoute>
                          <Route exact path='/products/:id'>
                            <>
                              <ArchiveNavbar />
                              <SingleProduct />
                              <ArchiveFooter />
                            </>
                          </Route>
                          <PrivateRoute exact path='/checkout'>
                            <>
                              <ArchiveNavbar />
                              <Checkout />
                              <ArchiveFooter />
                            </>
                          </PrivateRoute>
                          <PrivateRoute exact path='/orders'>
                            <>
                              <ArchiveNavbar />
                              <OrdersPage />
                              <ArchiveFooter />
                            </>
                          </PrivateRoute>
                          <PrivateRoute exact path='/orders/:id'>
                            <>
                              <ArchiveNavbar />
                              <SingleOrder />
                              <ArchiveFooter />
                            </>
                          </PrivateRoute>
                          <PrivateRoute exact path='/profile'>
                            <>
                              <ArchiveNavbar />
                              <ProfilePage />
                              <ArchiveFooter />
                            </>
                          </PrivateRoute>
                          <PrivateRoute exact path='/wishlist'>
                            <>
                              <ArchiveNavbar />
                              <WishlistPage />
                              <ArchiveFooter />
                            </>
                          </PrivateRoute>

                          {/* Static Content Pages */}
                          <Route exact path='/contact'>
                            <>
                              <ArchiveNavbar />
                              <ContactPage />
                              <ArchiveFooter />
                            </>
                          </Route>
                          <Route exact path='/shipping'>
                            <>
                              <ArchiveNavbar />
                              <ShippingPage />
                              <ArchiveFooter />
                            </>
                          </Route>
                          <Route exact path='/privacy-policy'>
                            <>
                              <ArchiveNavbar />
                              <PrivacyPolicyPage />
                              <ArchiveFooter />
                            </>
                          </Route>
                          <Route exact path='/refund-policy'>
                            <>
                              <ArchiveNavbar />
                              <RefundPolicyPage />
                              <ArchiveFooter />
                            </>
                          </Route>
                          <Route exact path='/terms'>
                            <>
                              <ArchiveNavbar />
                              <TermsPage />
                              <ArchiveFooter />
                            </>
                          </Route>

                          {/* Admin Routes - No Navbar/Sidebar/Footer */}
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

                          {/* 404 Route */}
                          <Route exact path='*'>
                            <>
                              <ArchiveNavbar />
                              <Error />
                              <ArchiveFooter />
                            </>
                          </Route>
                        </Switch>
                      </ErrorBoundary>
                    </Router>
                  </AdminUserProvider>
                </AdminCouponProvider>
              </AdminAnalyticsProvider>
            </AdminNewsletterProvider>
          </AdminOrderProvider>
        </AdminProductProvider>
      </AdminProvider>
    </div>
  );
}

export default App;
