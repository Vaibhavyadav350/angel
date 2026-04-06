import React from 'react';
import { GiCompass, GiDiamondHard, GiStabbedNote } from 'react-icons/gi';
import {
  AiFillLinkedin,
  AiFillTwitterCircle,
} from 'react-icons/ai';
import {
  FaHome,
  FaProductHunt,
  FaShoppingCart,
  FaUserTie,
  FaTicketAlt,
  FaUndo,
  FaImages,
  FaLayerGroup,
  FaTags,
  FaBoxes,
} from 'react-icons/fa';

export const links = [
  {
    id: 1,
    text: 'home',
    url: '/',
  },
  {
    id: 2,
    text: 'Women',
    url: '/products?category=Women',
  },
  {
    id: 3,
    text: 'Men',
    url: '/products?category=Men',
  },
  {
    id: 4,
    text: 'Kids',
    url: '/products?category=Kids',
  },
  {
    id: 5,
    text: 'Jewelry',
    url: '/products?category=Jewelry',
  },
  {
    id: 6,
    text: 'About',
    url: '/about',
  },
];

// Sub-category mapping for navigation dropdown menus
export const navCategories = {
  Women: ['Salwar Kameez', 'Sarees', 'Lehengas'],
  Men: ['Sherwanis', 'Jacket', 'Kurtas'],
  Kids: ['Girls', 'Boys'],
  Jewelry: ['Bridal', 'Casual'],
};

export const socialLinks = [
  {
    id: 1,
    icon: (
      <AiFillLinkedin className='linkedin' color='var(--clr-primary-5)' fontSize='2.5rem' />
    ),
    text: 'LinkedIn',
    url: 'https://www.linkedin.com/company/angel-fashion-studio',
  },
  {
    id: 2,
    icon: (
      <AiFillTwitterCircle
        className='twitter'
        color='var(--clr-primary-5)'
        fontSize='2.5rem'
      />
    ),
    text: 'Twitter',
    url: 'https://twitter.com/angelfashionstudio',
  },
];

export const footerLinks = [
  {
    id: 1,
    text: 'Home',
    url: '/',
  },
  {
    id: 2,
    text: 'About',
    url: '/about',
  },
  {
    id: 3,
    text: 'Products',
    url: '/products',
  },
  {
    id: 4,
    text: 'Contact',
    url: '/contact',
  },
  {
    id: 5,
    text: 'Orders',
    url: '/orders',
  },
];

export const services = [
  {
    id: 1,
    icon: <GiCompass />,
    title: 'mission',
    text: 'Our mission is to provide our customers the best in class fashion products and services at a very reasonable price.',
  },
  {
    id: 2,
    icon: <GiDiamondHard />,
    title: 'vision',
    text: 'Our vision is to take Angel Fashion Studio to greater heights, by providing our customers best in class service.',
  },
  {
    id: 3,
    icon: <GiStabbedNote />,
    title: 'history',
    text: `Angel Fashion Studio was started with an initial aim to provide the best in class fashion services to our customers in India.`,
  },
];

// Production Configuration
// When deployed on Vercel, we will set REACT_APP_BACKEND_HOST to the Koyeb URL
export const domain = process.env.REACT_APP_BACKEND_HOST || 'http://localhost:5000';
export const products_url = `${domain}/api/products`;
export const single_product_url = `${domain}/api/products/`;
// Order creation URL removed — orders are created exclusively by the eWAY callback (webhookController.js)
export const get_order_url = `${domain}/api/orders`;
// payment_url removed — checkout uses /api/payment/create-checkout-session directly
export const upload_url = `${domain}/api/upload/`;
export const newsletter_url = `${domain}/api/newsletter/subscribe`;
export const user_profile_url = `${domain}/api/users/profile`;
export const wishlist_toggle_url = `${domain}/api/users/wishlist/toggle`;
export const default_profile_image =
  'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg';

// Admin constants (FaHome, FaProductHunt, FaShoppingCart, FaUserTie already imported above)

export const LinkItems = [
  { name: 'Home', url: '/admin', icon: <FaHome /> },
  { name: 'Products', url: '/admin/products', icon: <FaProductHunt /> },
  { name: 'Inventory', url: '/admin/inventory', icon: <FaBoxes /> },
  { name: 'Orders', url: '/admin/orders', icon: <FaShoppingCart /> },
  { name: 'Banners', url: '/admin/banners', icon: <FaImages /> },
  { name: 'Collections', url: '/admin/collections', icon: <FaLayerGroup /> },
  { name: 'Categories', url: '/admin/categories', icon: <FaTags /> },
  { name: 'Newsletter', url: '/admin/newsletter', icon: <GiStabbedNote /> },
  { name: 'Promotions', url: '/admin/coupons', icon: <FaTicketAlt /> },
  { name: 'Customers', url: '/admin/customers', icon: <FaUserTie /> },
  { name: 'Admins', url: '/admin/admins', icon: <FaUserTie /> },
  { name: 'Returns', url: '/admin/returns', icon: <FaUndo /> },
];

export const orderStatusList = [
  { name: 'Reject', value: 'rejected' },
  { name: 'Processing', value: 'processing' },
  { name: 'Confirmed', value: 'confirmed' },
  { name: 'Shipped', value: 'shipped' },
  { name: 'Delivered', value: 'delivered' },
  { name: 'Cancelled', value: 'cancelled' },
];

// Admin API URLs
export const admin_auth_url = `${domain}/api/admin/auth`;
export const admin_login_url = `${domain}/api/admin/login`;
export const admin_logout_url = `${domain}/api/admin/logout`;
export const admin_register_url = `${domain}/api/admin/register`;
export const admin_users_url = `${domain}/api/admin/users/`;
export const admin_all_profiles_url = `${domain}/api/users/admin/all`;
export const admin_products_url = `${domain}/api/admin/product/`;
export const admin_products_export_url = `${domain}/api/admin/product/export/excel`;
export const admin_create_product_url = `${domain}/api/admin/product/new`;
export const admin_orders_url = `${domain}/api/admin/orders`;
export const admin_orders_export_url = `${domain}/api/admin/orders/export/excel`;
export const admin_orders_bulk_url = `${domain}/api/admin/orders/bulk-update`;
export const admin_order_url = `${domain}/api/admin/order/`;
export const admin_single_order_url = `${domain}/api/admin/order/`; // For fetching single order
export const admin_delete_review_url = `${domain}/api/admin/product/review/`;
export const admin_newsletter_url = `${domain}/api/newsletter`;
export const admin_banners_url = `${domain}/api/banners`;
export const admin_collections_url = `${domain}/api/featured-collections`;
export const admin_categories_url = `${domain}/api/admin/categories`;
export const admin_inventory_url = `${domain}/api/admin/inventory`;

// Analytics URLs
export const admin_analytics_sales_url = `${domain}/api/analytics/sales`;
export const admin_analytics_categories_url = `${domain}/api/analytics/categories`;
export const admin_analytics_kpis_url = `${domain}/api/analytics/kpis`;
