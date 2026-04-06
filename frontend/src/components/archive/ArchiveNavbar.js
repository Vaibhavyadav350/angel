import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCartContext } from '../../context/cart_context';
import { useUserContext } from '../../context/user_context';

const megaMenuData = {
  'BY OCCASION': [
    { label: 'The Bridal Edit', url: '/products?collection=Bridal' },
    { label: 'Wedding Guest', url: '/products?collection=Wedding+Guest' },
    { label: 'Evening & Celebration', url: '/products' },
    { label: 'Resort & Vacation', url: '/products' },
    { label: 'Festival Wear', url: '/products' },
    { label: 'Archival Trousseau', url: '/products?collection=New+Arrivals' },
  ],
  'BY STYLE': [
    { label: 'Anarkali Suits', url: '/products?category=Women&subCategory=Salwar+Kameez' },
    { label: 'Designer Sarees', url: '/products?category=Women&subCategory=Sarees' },
    { label: 'Lehenga Choli', url: '/products?category=Women&subCategory=Lehengas' },
    { label: 'Sherwanis', url: '/products?category=Men&subCategory=Sherwanis' },
    { label: 'Kurtas & Jackets', url: '/products?category=Men&subCategory=Kurtas' },
    { label: 'Bridal Jewellery', url: '/products?category=Jewelry&subCategory=Bridal' },
  ],
  'BY FABRIC': [
    { label: 'Pure Banarasi Silk', url: '/products?category=Women' },
    { label: 'Hand-Spun Velvet', url: '/products?category=Women' },
    { label: 'Organza & Net', url: '/products?category=Women' },
    { label: 'Georgette', url: '/products?category=Women' },
    { label: 'Raw Silk', url: '/products?category=Women' },
    { label: 'Jacquard', url: '/products?category=Women' },
  ],
};

const ArchiveNavbar = React.memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const { total_items } = useCartContext();
  const { currentUser, logoutUser } = useUserContext();
  const megaMenuRef = useRef(null);
  const collectionsRef = useRef(null);
  const leaveTimerRef = useRef(null);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setIsMegaMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  const handleLogout = useCallback(() => {
    logoutUser();
    setIsMenuOpen(false);
  }, [logoutUser]);

  const openMegaMenu = () => {
    clearTimeout(leaveTimerRef.current);
    setIsMegaMenuOpen(true);
  };

  const closeMegaMenuDelayed = () => {
    leaveTimerRef.current = setTimeout(() => setIsMegaMenuOpen(false), 150);
  };

  return (
    <>
      {/* The Veil Backdrop - Philosophy 1 */}
      <div
        className={`fixed inset-0 bg-champagne/70 backdrop-blur-xl z-[80] transition-opacity duration-500 pointer-events-none ${isMegaMenuOpen ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden="true"
      />

      {/* Spacer for announcement bar height */}
      <header className="fixed top-0 left-0 right-0 z-[100] px-12 lg:px-24 py-5 flex items-center justify-between bg-champagne/90 backdrop-blur-md border-b border-bronze/10 transition-all duration-500">
        {/* Left Logo */}
        <Link to="/" className="text-left" onClick={closeMenu}>
          <h1 className="text-2xl lg:text-3xl font-editorial font-black tracking-tighter leading-none text-left text-bronze uppercase">
            ANGEL
            <br />
            <span className="text-[8px] lg:text-[9px] tracking-[0.5em] lg:tracking-[0.8em] font-bold text-gold">
              FASHION STUDIO
            </span>
          </h1>
        </Link>

        {/* Right Side Navigation */}
        <div className="flex items-center gap-12 text-bronze/70">
          {/* Desktop Nav */}
          <div className="hidden lg:flex gap-10 items-center uppercase text-[11px] font-bold tracking-[0.3em]">

            {/* Collections with Mega Menu */}
            <div
              ref={collectionsRef}
              className="relative"
              onMouseEnter={openMegaMenu}
              onMouseLeave={closeMegaMenuDelayed}
            >
              <Link
                to="/products"
                className={`hover:text-gold transition-colors flex items-center gap-1.5 ${isMegaMenuOpen ? 'text-gold' : ''}`}
              >
                Collections
                <span className="material-symbols-outlined text-sm leading-none"
                  style={{ fontSize: '14px', fontVariationSettings: '"FILL" 0, "wght" 300' }}>
                  expand_more
                </span>
              </Link>

              {/* MEGA MENU PANEL */}
              {isMegaMenuOpen && (
                <div
                  ref={megaMenuRef}
                  className="fixed left-0 right-0 top-full bg-champagne border-t border-gold/20 shadow-2xl z-50 py-16 px-24"
                  onMouseEnter={openMegaMenu}
                  onMouseLeave={closeMegaMenuDelayed}
                >
                  <div className="container mx-auto max-w-7xl grid grid-cols-4 gap-16">
                    {/* Columns 1–3: Menu Categories */}
                    {Object.entries(megaMenuData).map(([title, items]) => (
                      <div key={title}>
                        <h4 className="text-[9px] font-black uppercase tracking-[0.5em] text-gold mb-8 pb-4 border-b border-gold/20">
                          {title}
                        </h4>
                        <ul className="space-y-4">
                          {items.map((item) => (
                            <li key={item.label}>
                              <Link
                                to={item.url}
                                onClick={() => setIsMegaMenuOpen(false)}
                                className="text-[11px] font-bold uppercase tracking-[0.2em] text-bronze/70 hover:text-gold transition-colors duration-300 flex items-center gap-2 group"
                              >
                                <span className="w-0 group-hover:w-3 h-px bg-gold transition-all duration-300 overflow-hidden" />
                                {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    {/* Column 4: Featured */}
                    <div className="flex flex-col gap-6">
                      <h4 className="text-[9px] font-black uppercase tracking-[0.5em] text-gold mb-0 pb-4 border-b border-gold/20">
                        FEATURED
                      </h4>
                      <div
                        className="relative overflow-hidden flex-1"
                        style={{ borderRadius: '160px 160px 20px 20px' }}
                      >
                        <img
                          src="/assets/landing/hero-saree.jpg"
                          alt="Featured Collection"
                          className="w-full h-full object-cover opacity-80"
                          style={{ maxHeight: '220px' }}
                        />
                        <div className="absolute inset-0 bg-chocolate/30" />
                        <div className="absolute bottom-4 inset-x-0 text-center">
                          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-champagne">
                            S/S 2025 ARCHIVE
                          </span>
                        </div>
                      </div>
                      <Link
                        to="/products"
                        onClick={() => setIsMegaMenuOpen(false)}
                        className="inline-flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.3em] text-bronze/60 hover:text-gold transition-colors"
                      >
                        See All Collections
                        <span className="material-symbols-outlined text-sm">east</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link to="/about" className="hover:text-gold transition-colors">Heritage</Link>

            <Link to="/cart" className="hover:text-gold transition-colors relative">
              Cart
              {total_items > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-chocolate text-[8px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {total_items}
                </span>
              )}
            </Link>

            {currentUser && (
              <Link to="/wishlist" className="hover:text-gold transition-colors">Wishlist</Link>
            )}
            {currentUser && (
              <Link to="/orders" className="hover:text-gold transition-colors">Orders</Link>
            )}
            {currentUser ? (
              <Link to="/profile" className="hover:text-gold transition-colors">Profile</Link>
            ) : (
              <Link to="/login" className="hover:text-gold transition-colors">Login</Link>
            )}
          </div>

          {/* Hamburger */}
          <button
            onClick={toggleMenu}
            className="lg:hidden flex items-center justify-center p-2 min-w-[44px] min-h-[44px] hover:text-gold transition-colors"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className="material-symbols-outlined text-2xl font-light">
              {isMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-champagne z-50 pt-28 px-8 lg:hidden overflow-y-auto">
            <div className="flex flex-col gap-6 text-xl font-editorial font-bold uppercase text-bronze">
              {/* Mobile Category List */}
              <p className="text-[9px] font-black text-gold tracking-[0.4em] uppercase mt-4">Collections</p>
              {Object.values(megaMenuData).flat().slice(0, 6).map((item) => (
                <Link key={item.label} to={item.url} onClick={closeMenu}
                  className="text-base hover:text-gold transition-colors pl-4 border-l-2 border-bronze/10 hover:border-gold">
                  {item.label}
                </Link>
              ))}
              <div className="h-px w-full bg-bronze/10 my-2" />
              <Link to="/about" onClick={closeMenu} className="hover:text-gold transition-colors">Heritage</Link>
              <Link to="/cart" onClick={closeMenu} className="hover:text-gold transition-colors">
                Cart {total_items > 0 && <span className="ml-2 bg-gold text-chocolate text-xs rounded-full px-2 py-0.5">{total_items}</span>}
              </Link>
              {currentUser ? (
                <>
                  <Link to="/profile" onClick={closeMenu} className="hover:text-gold transition-colors">Profile</Link>
                  <Link to="/wishlist" onClick={closeMenu} className="hover:text-gold transition-colors">Wishlist</Link>
                  <Link to="/orders" onClick={closeMenu} className="hover:text-gold transition-colors">Orders</Link>
                  <button onClick={handleLogout} className="text-left hover:text-gold transition-colors">Logout</button>
                </>
              ) : (
                <Link to="/login" onClick={closeMenu} className="hover:text-gold transition-colors">Login</Link>
              )}
            </div>
          </div>
        )}
      </header>
      {/* Sub-Navbar for clear visual hierarchy */}
      <div className="fixed top-[84px] left-0 right-0 z-[90] bg-champagne/95 backdrop-blur-md border-b border-bronze/10 text-center py-3 overflow-x-auto">
        <div className="flex items-center justify-center gap-6 min-w-max px-8 text-[9px] font-bold uppercase tracking-[0.3em] text-bronze/70">
          <Link to="/products?category=Women&subCategory=Salwar+Kameez" className="hover:text-gold transition-colors">Salwar Kameez</Link>
          <span className="text-bronze/30">•</span>
          <Link to="/products?category=Women&subCategory=Sarees" className="hover:text-gold transition-colors">Saree</Link>
          <span className="text-bronze/30">•</span>
          <Link to="/products?category=Women&subCategory=Lehengas" className="hover:text-gold transition-colors">Lehenga</Link>
          <span className="text-bronze/30">•</span>
          <Link to="/products?category=Women&subCategory=Salwar+Kameez" className="hover:text-gold transition-colors">Anarkali</Link>
          <span className="text-bronze/30">•</span>
          <Link to="/products?category=Men" className="hover:text-gold transition-colors">Mens Heritage</Link>
          <span className="text-bronze/30">•</span>
          <Link to="/products?category=Jewelry" className="hover:text-gold transition-colors">Jewellery</Link>
          <span className="text-bronze/30">•</span>
          <Link to="/products?collection=Sale" className="text-red-800 hover:text-red-500 transition-colors tracking-widest font-black">Sale</Link>
        </div>
      </div>

      {/* Offset spacer since header is now fixed and taller */}
      <div className="h-[124px]" />
    </>
  );
});

ArchiveNavbar.displayName = 'ArchiveNavbar';
export default ArchiveNavbar;
