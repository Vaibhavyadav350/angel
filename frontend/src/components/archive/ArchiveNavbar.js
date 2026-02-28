import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCartContext } from '../../context/cart_context';
import { useUserContext } from '../../context/user_context';

const ArchiveNavbar = React.memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { total_items } = useCartContext();
  const { currentUser, logoutUser } = useUserContext();

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    logoutUser();
    setIsMenuOpen(false);
  }, [logoutUser]);

  return (
    <header className="absolute top-0 z-[100] w-full px-12 lg:px-24 py-10 flex items-center justify-between pointer-events-none transition-all duration-500">
      {/* Left Logo */}
      <div className="flex flex-col items-center pointer-events-auto">
        <Link to="/" className="text-left">
          <h1 className="text-2xl lg:text-3xl font-editorial font-black tracking-tighter leading-none text-left text-bronze uppercase">
            ANGEL
            <br />
            <span className="text-[8px] lg:text-[9px] tracking-[0.5em] lg:tracking-[0.8em] font-bold text-gold">FASHION STUDIO</span>
          </h1>
        </Link>
      </div>

      {/* Right Side - Navigation Links & Cart/Profile */}
      <div className="flex items-center gap-12 pointer-events-auto text-bronze/70">
        {/* Main Links - Hidden on mobile */}
        <div className="hidden lg:flex gap-12 items-center uppercase text-[10px] font-bold tracking-[0.4em]">
          <Link to="/products" className="hover:text-gold transition-colors">
            Collections
          </Link>
          <Link to="/about" className="hover:text-gold transition-colors">
            Heritage
          </Link>
          <Link to="/cart" className="hover:text-gold transition-colors relative">
            Cart
            {total_items > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-chocolate text-[8px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {total_items}
              </span>
            )}
          </Link>
          {currentUser && (
            <Link to="/wishlist" className="hover:text-gold transition-colors">
              Wishlist
            </Link>
          )}
          {currentUser && (
            <Link to="/orders" className="hover:text-gold transition-colors">
              Orders
            </Link>
          )}
          {currentUser ? (
            <Link to="/profile" className="hover:text-gold transition-colors">
              Profile
            </Link>
          ) : (
            <Link to="/login" className="hover:text-gold transition-colors">
              Login
            </Link>
          )}
        </div>
        {/* Hamburger Menu - Only visible on mobile */}
        <button
          onClick={toggleMenu}
          className="lg:hidden flex items-center justify-center p-2 min-w-[44px] min-h-[44px] hover:text-gold transition-colors"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          <span className="material-symbols-outlined text-2xl font-light" aria-hidden="true">
            {isMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 bg-champagne z-50 pt-32 px-8 lg:hidden pointer-events-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="flex flex-col gap-6 md:gap-8 text-xl md:text-2xl font-editorial font-bold uppercase text-bronze">
            <Link
              to="/products"
              onClick={closeMenu}
              className="hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 rounded px-2 py-1 min-h-[44px] flex items-center"
            >
              Collections
            </Link>
            <Link
              to="/about"
              onClick={closeMenu}
              className="hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 rounded px-2 py-1 min-h-[44px] flex items-center"
            >
              Heritage
            </Link>
            <Link
              to="/cart"
              onClick={closeMenu}
              className="hover:text-gold transition-colors relative focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 rounded px-2 py-1 min-h-[44px] flex items-center"
            >
              Cart
              {total_items > 0 && (
                <span className="ml-2 bg-gold text-chocolate text-xs rounded-full px-2 py-1 font-bold" aria-label={`${total_items} items in cart`}>
                  {total_items}
                </span>
              )}
            </Link>
            {currentUser ? (
              <>
                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 rounded px-2 py-1 min-h-[44px] flex items-center"
                >
                  Profile
                </Link>
                <Link
                  to="/wishlist"
                  onClick={closeMenu}
                  className="hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 rounded px-2 py-1 min-h-[44px] flex items-center"
                >
                  Wishlist
                </Link>
                <Link
                  to="/orders"
                  onClick={closeMenu}
                  className="hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 rounded px-2 py-1 min-h-[44px] flex items-center"
                >
                  Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="hover:text-gold transition-colors text-left focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 rounded px-2 py-1 min-h-[44px] flex items-center"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 rounded px-2 py-1 min-h-[44px] flex items-center"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
});

ArchiveNavbar.displayName = 'ArchiveNavbar';

export default ArchiveNavbar;

