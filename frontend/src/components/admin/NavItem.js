import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function NavItem({ url, icon, children, ...rest }) {
  const location = useLocation();
  const isActive = location.pathname === url || (url !== '/admin' && location.pathname.startsWith(url));

  return (
    <Link to={url}>
      <div
        className={`flex items-center gap-3 px-4 py-3 mx-3 my-1 rounded-lg cursor-pointer text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-200
          ${isActive
            ? 'bg-bronze text-white'
            : 'text-bronze/70 hover:bg-bronze/10 hover:text-bronze'
          }`}
        {...rest}
      >
        {icon && (
          <span className={`text-base ${isActive ? 'text-gold' : 'text-bronze/50'}`}>
            {icon}
          </span>
        )}
        {children}
      </div>
    </Link>
  );
}
