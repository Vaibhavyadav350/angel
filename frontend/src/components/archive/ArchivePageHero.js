import React from 'react';
import { Link } from 'react-router-dom';

const ArchivePageHero = ({ title, product }) => {
  return (
    <section className="bg-champagne border-b border-bronze/10 pt-40 pb-20">
      <div className="container mx-auto px-8 lg:px-24">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.4em] text-bronze/50 mb-8">
          <Link to="/" className="hover:text-gold transition-colors">
            Home
          </Link>
          {product && (
            <>
              <span className="text-bronze/20">—</span>
              <Link to="/products" className="hover:text-gold transition-colors">
                Collections
              </Link>
            </>
          )}
          <span className="text-bronze/20">—</span>
          <span className="text-gold">{title}</span>
        </div>

        {/* Page Title */}
        <div className="space-y-4">
          <h2 className="text-6xl lg:text-9xl font-editorial font-black text-bronze uppercase tracking-tighter leading-none">
            {title}
          </h2>
          <div className="h-px w-16 bg-gold" />
        </div>
      </div>
    </section>
  );
};

export default ArchivePageHero;
