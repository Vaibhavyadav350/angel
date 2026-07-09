import React, { useState, useEffect } from 'react';
import NavItem from './NavItem';
import { LinkItems } from '../../utils/constants';
import { useAdminContext } from '../../context/admin_context';
import logo from '../../assets/logo.png';

export default function SidebarContent({ onClose, className = '' }) {
  const {
    currentAdmin: currentUser,
  } = useAdminContext();
  const privilege = currentUser?.privilege;
  const [Links, setLinks] = useState([]);

  useEffect(() => {
    if (privilege === 'super') {
      setLinks(LinkItems);
    }
    if (privilege === 'moderate') {
      const tempLinks = LinkItems.filter((link) =>
        link.name !== 'Admins' && link.name !== 'Customers'
      );
      setLinks(tempLinks);
    }
    if (privilege === 'low') {
      const tempLinks = LinkItems.filter(
        (link) =>
          link.name !== 'Admins' &&
          link.name !== 'Products' &&
          link.name !== 'Newsletter' &&
          link.name !== 'Customers' &&
          link.name !== 'Banners' &&
          link.name !== 'Collections' &&
          link.name !== 'Categories' &&
          link.name !== 'Inventory' &&
          link.name !== 'Settings'
      );
      setLinks(tempLinks);
    }
    // eslint-disable-next-line
  }, [privilege]);

  return (
    <div
      className={`bg-white border-r border-bronze/10 w-60 fixed h-screen flex flex-col transition-all duration-300 ${className}`}
    >
      {/* Brand Header */}
      <div className="py-4 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center w-full justify-center">
          <img src={logo} alt="Angel Fashion Studio Logo" className="w-40 h-auto object-contain" />
        </div>
        <button
          className="md:hidden text-bronze/50 hover:text-bronze transition-colors p-1"
          onClick={onClose}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Divider */}
      <div className="mx-6 h-px bg-bronze/10 shrink-0" />

      {/* Admin Label */}
      <div className="px-7 pt-4 pb-2 shrink-0">
        <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-bronze/30">
          Management
        </span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 min-h-0 overflow-y-auto py-2 custom-scrollbar">
        {Links.map((link) => (
          <NavItem key={link.name} icon={link.icon} url={link.url}>
            {link.name}
          </NavItem>
        ))}
      </nav>

      {/* Bottom branding & Subdomain Link */}
      <div className="px-6 py-4 border-t border-bronze/10 flex flex-col gap-3 shrink-0">
        <a href="https://angelfashionstudio.org" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/50 hover:text-gold transition-colors">
          <span className="material-symbols-outlined text-sm">storefront</span>
          Back to Store
        </a>
        <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-bronze/20">
          Admin Console
        </p>
      </div>
    </div>
  );
}
