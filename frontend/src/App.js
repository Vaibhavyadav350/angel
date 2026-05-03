import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Toast, ErrorBoundary } from './components';
import { ArchiveNavbar, ArchiveFooter, CheckoutNavbar, ScrollToTop } from './components/archive';
import { useProductsContext } from './context/products_context';
import { AdminProvider } from './context/admin_context';
import { OrderProvider as AdminOrderProvider } from './context/admin_order_context';
import { ProductProvider as AdminProductProvider } from './context/admin_product_context';
import { NewsletterProvider as AdminNewsletterProvider } from './context/newsletter_context';
import { AnalyticsProvider as AdminAnalyticsProvider } from './context/admin_analytics_context';
import { CouponProvider as AdminCouponProvider } from './context/admin_coupon_context';
import { AdminUserProvider } from './context/admin_user_context';
import { BannerProvider as AdminBannerProvider } from './context/admin_banner_context';
import { CollectionProvider as AdminCollectionProvider } from './context/admin_collection_context';
import { CategoryProvider as AdminCategoryProvider } from './context/admin_category_context';
import { InventoryProvider as AdminInventoryProvider } from './context/admin_inventory_context';
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
  BannersPage as AdminBanners,
  CollectionsPage as AdminCollections,
  CategoriesPage as AdminCategories,
  InventoryPage as AdminInventory,
} from './pages/admin';

// Wrapper that bundles all admin context providers — only mounts on admin routes
const AdminProviders = ({ children }) => (
  <AdminProvider>
    <AdminProductProvider>
      <AdminOrderProvider>
        <AdminNewsletterProvider>
          <AdminAnalyticsProvider>
            <AdminUserProvider>
              <AdminBannerProvider>
                <AdminCollectionProvider>
                  <AdminCategoryProvider>
                    <AdminInventoryProvider>
                      {children}
                    </AdminInventoryProvider>
                  </AdminCategoryProvider>
                </AdminCollectionProvider>
              </AdminBannerProvider>
            </AdminUserProvider>
          </AdminAnalyticsProvider>
        </AdminNewsletterProvider>
      </AdminOrderProvider>
    </AdminProductProvider>
  </AdminProvider>
);

// Admin routes wrapped with their providers
const AdminRoutes = () => (
  <AdminProviders>
    <Switch>
      <Route exact path='/'>
        <Redirect to="/admin" />
      </Route>
      <Route exact path='/admin/login'>
        <AdminLogin />
      </Route>
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
      <AdminPrivateRoute exact path='/admin/banners'>
        <AdminBanners />
      </AdminPrivateRoute>
      <AdminPrivateRoute exact path='/admin/collections'>
        <AdminCollections />
      </AdminPrivateRoute>
      <AdminPrivateRoute exact path='/admin/categories'>
        <AdminCategories />
      </AdminPrivateRoute>
      <AdminPrivateRoute exact path='/admin/inventory'>
        <AdminInventory />
      </AdminPrivateRoute>
      <Route exact path='*'>
        <Error />
      </Route>
    </Switch>
  </AdminProviders>
);

// Customer routes — no admin providers mounted
const CustomerRoutes = () => (
  <Switch>
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
        <CheckoutNavbar />
        <Checkout />
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
    <Route exact path='*'>
      <>
        <ArchiveNavbar />
        <Error />
        <ArchiveFooter />
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
      <AdminCouponProvider>
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
      </AdminCouponProvider>
    </div>
  );
}

export default App;

