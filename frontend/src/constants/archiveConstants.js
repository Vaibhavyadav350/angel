/**
 * Shared constants for archive design system
 * Follows DRY principles by centralizing repeated values
 */

export const ANIMATION_CONFIG = {
  default: {
    start: 'top 80%',
    duration: 1,
    ease: 'power3.out',
    once: true,
  },
  fast: {
    start: 'top 80%',
    duration: 0.8,
    ease: 'power2.out',
    once: true,
  },
  slow: {
    start: 'top 80%',
    duration: 1.5,
    ease: 'power3.out',
    once: true,
  },
};

export const FILTER_OPTIONS = [
  { value: 'all', label: 'All Work' },
  { value: 'Women', label: 'Women' },
  { value: 'Men', label: 'Men' },
  { value: 'Jewelry', label: 'Jewelry' },
];

export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com',
  email: 'mailto:info@angelfashionstudio.au',
  phone: 'tel:0466853704',
};

export const COMPANY_INFO = {
  name: 'ANGEL FASHION STUDIO',
  fullName: 'Angel Fashion Studio',
  address: {
    line1: 'Archival House, 12 Heritage Lane, Mehrauli',
    city: 'New Delhi',
    country: 'India',
  },
  contact: '0466853704',
  email: 'info@angelfashionstudio.au',
};

export const FOOTER_LINKS = {
  studio: [
    { label: 'About Us', href: '/about' },
    { label: 'Craftsmanship', href: '/about#craftsmanship' },
    { label: 'The Archive', href: '/' },
  ],
  shop: [
    { label: "Women's Collection", href: '/products?category=Women' },
    { label: "Men's Collection", href: '/products?category=Men' },
    { label: "Jewelry Collection", href: '/products?category=Jewelry' },
  ],
  clientCare: [
    { label: 'Concierge', href: '/contact' },
    { label: 'Shipping', href: '/shipping' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Refund Policy', href: '/refund-policy' },
    { label: 'Terms & Condition', href: '/terms' },
    { label: 'Admin Portal', href: 'https://admin.angelfashionstudio.org', external: true },
  ],
};

