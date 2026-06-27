import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Toast, ErrorBoundary } from './components';
import { CheckoutNavbar, ScrollToTop } from './components/archive';
import NewNavbar from './components/home/NewNavbar';
import NewFooter from './components/home/NewFooter';
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
  SettingsPage as AdminSettings,
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
      <AdminPrivateRoute exact path='/admin/settings'>
        <AdminSettings />
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
    <Route exact path='/orders'>
      <>
        <NewNavbar />
        <OrdersPage />
        <NewFooter />
      </>
    </Route>
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

