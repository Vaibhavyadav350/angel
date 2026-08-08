import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiSearch, FiShoppingBag, FiHeart, FiUser, FiMenu, FiX, FiChevronDown, FiPackage } from 'react-icons/fi';
import { useCartContext } from '../../context/cart_context';
import { useUserContext } from '../../context/user_context';
import { default_profile_image } from '../../utils/constants';
import taxonomy from '../../utils/taxonomy.json';
import logo from '../../assets/logo.png';

const megaMenuData = taxonomy.categories;

const NewNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownTimeout = useRef(null);
  const location = useLocation();
  const { total_items } = useCartContext();
  const { currentUser } = useUserContext();

  const isHomePage = location.pathname === '/';
  // The listing page carries its own tinted masthead. A solid champagne bar on
  // top of it reads as a second header, so the nav sits transparent over the
  // band and only takes a background once you scroll past it — the same
  // behaviour as the hero on the home page. Its type stays dark either way,
  // because the band is light.
  const overBand = location.pathname === '/products';
  const floating = (isHomePage || overBand) && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
    setSearchOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const handleMouseEnter = (cat) => {
    clearTimeout(dropdownTimeout.current);
    setActiveDropdown(cat);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 120);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const navBg = floating ? 'bg-transparent' : 'bg-champagne/95 backdrop-blur-md shadow-sm';

  // Only the home hero is dark enough to need light type.
  const onDarkHero = isHomePage && !scrolled;
  const textColor = onDarkHero ? 'text-white' : 'text-[#3D2B1F]';
  const iconColor = onDarkHero ? 'text-white hover:text-[#C5A059]' : 'text-[#3D2B1F] hover:text-[#C5A059]';

  const mainNavLinks = [
    { label: 'NEW ARRIVALS', key: null, url: '/products?collection=new%20arrivals' },
    { label: 'WOMEN', key: 'Women', url: '/products?category=Women' },
    { label: 'MEN', key: 'Men', url: '/products?category=Men' },
    { label: 'KIDS', key: 'Kids', url: '/products?category=Kids' },
    { label: 'JEWELRY', key: 'Jewelry', url: '/products?category=Jewelry' },
    { label: 'ABOUT', key: null, url: '/about' },
    { label: 'SALE', key: null, url: '/products?collection=sale', sale: true },
  ];

  return (
    <>
      {/* ── MAIN NAVBAR ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 h-16 md:h-20 ${navBg}`}
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-full flex items-center justify-between relative">

          {/* LEFT — Logo */}
          <Link to="/" className="flex items-center shrink-0 z-50">
            <img
              src={logo}
              alt="Angel Fashion Studio Logo"
              className={`h-12 md:h-16 scale-[2.1] md:scale-[2.8] origin-left -translate-y-2 object-contain transition-all duration-300 ${onDarkHero ? 'brightness-0 invert' : ''}`}
            />
          </Link>

          {/* CENTER — Desktop Nav Links */}
          <ul className="hidden lg:flex items-center gap-8">
            {mainNavLinks.map(({ label, key, url, sale }) => (
              <li
                key={label}
                className="relative"
                onMouseEnter={() => key && handleMouseEnter(key)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  to={url}
                  className={`flex items-center gap-1 text-[11px] font-semibold tracking-[0.25em] uppercase transition-colors duration-200
                    ${sale
                      ? 'text-red-500 hover:text-red-400'
                      : `${textColor} hover:text-[#C5A059]`
                    }`}
                >
                  {label}
                  {key && megaMenuData[key] && (
                    <FiChevronDown
                      className={`transition-transform duration-200 ${activeDropdown === key ? 'rotate-180' : ''}`}
                      size={12}
                    />
                  )}
                </Link>

                {/* Mega Dropdown */}
                {key && megaMenuData[key] && activeDropdown === key && (
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white shadow-2xl border border-[#E1C699] rounded-2xl overflow-hidden"
                    style={{ minWidth: '520px', zIndex: 100 }}
                    onMouseEnter={() => handleMouseEnter(key)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="p-6 grid gap-6"
                      style={{ gridTemplateColumns: `repeat(${Object.keys(megaMenuData[key]).length}, 1fr)` }}>
                      {Object.entries(megaMenuData[key]).map(([subCat, items]) => (
                        <div key={subCat}>
                          <Link
                            to={`/products?category=${key}&subCategory=${encodeURIComponent(subCat)}`}
                            className="block text-[10px] font-bold tracking-[0.2em] text-[#C5A059] uppercase mb-3 hover:text-[#3D2B1F] transition-colors"
                          >
                            {subCat}
                          </Link>
                          <ul className="space-y-2">
                            {items.map((item) => (
                              <li key={item}>
                                <Link
                                  to={`/products?category=${key}&subCategory=${encodeURIComponent(subCat)}&productType=${encodeURIComponent(item)}`}
                                  className="text-[12px] text-[#7A5C41] hover:text-[#3D2B1F] capitalize transition-colors leading-relaxed"
                                >
                                  {item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    {/* Bottom CTA */}
                    <div className="border-t border-[#F0E8DF] bg-[#FDFAF6] px-6 py-3">
                      <Link
                        to={`/products?category=${key}`}
                        className="text-[11px] font-semibold text-[#3D2B1F] tracking-widest uppercase hover:text-[#C5A059] transition-colors"
                      >
                        View All {key} →
                      </Link>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* RIGHT — Icons */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Search */}
            <button
              id="navbar-search-btn"
              onClick={() => setSearchOpen(s => !s)}
              className={`transition-colors ${iconColor}`}
              aria-label="Search"
            >
              <FiSearch size={20} />
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" id="navbar-wishlist-btn" className={`hidden sm:block transition-colors ${iconColor}`} aria-label="Wishlist">
              <FiHeart size={20} />
            </Link>

            {/* Orders — only meaningful once signed in, and previously reachable
                only by typing the URL. */}
            {currentUser && (
              <Link to="/orders" id="navbar-orders-btn" className={`hidden sm:block transition-colors ${iconColor}`} aria-label="My orders" title="My orders">
                <FiPackage size={20} />
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" id="navbar-cart-btn" className={`relative transition-colors ${iconColor}`} aria-label="Cart">
              <FiShoppingBag size={20} />
              {total_items > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#C5A059] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {total_items}
                </span>
              )}
            </Link>

            {/* Profile / Login */}
            {currentUser ? (
              <Link to="/profile" id="navbar-profile-btn" className="hidden sm:block" aria-label="Profile">
                <img
                  src={currentUser.photoURL || default_profile_image}
                  alt="profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-[#C5A059]"
                />
              </Link>
            ) : (
              <Link
                to="/login"
                id="navbar-login-btn"
                className={`hidden sm:flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase transition-colors ${iconColor}`}
              >
                <FiUser size={16} /> LOGIN
              </Link>
            )}

            {/* Hamburger */}
            <button
              id="navbar-menu-btn"
              onClick={() => setDrawerOpen(true)}
              className={`lg:hidden transition-colors ${iconColor}`}
              aria-label="Open menu"
            >
              <FiMenu size={24} />
            </button>
          </div>
        </div>

        {/* Search Bar — drops below nav when open */}
        {searchOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-[#E1C699] shadow-lg px-4 py-3 z-50">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-3">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search lehengas, sarees, sherwanis..."
                className="flex-1 px-4 py-2.5 border border-[#D4C5B5] rounded-full text-sm text-[#3D2B1F] placeholder-[#A89080] outline-none focus:border-[#C5A059] transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#3D2B1F] text-white text-sm font-semibold rounded-full hover:bg-[#C5A059] transition-colors"
              >
                Search
              </button>
              <button type="button" onClick={() => setSearchOpen(false)} className="text-[#7A5C41] hover:text-[#3D2B1F]">
                <FiX size={20} />
              </button>
            </form>
          </div>
        )}
      </nav>

      {/* ── MOBILE DRAWER ── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[200] flex lg:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative z-10 w-[85vw] max-w-sm h-full bg-white flex flex-col shadow-2xl overflow-y-auto">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0E8DF]">
              <Link to="/" onClick={() => setDrawerOpen(false)} className="flex items-center">
                <img src={logo} alt="Angel Fashion Studio Logo" className="h-[58px] object-contain" />
              </Link>
              <button onClick={() => setDrawerOpen(false)} className="text-[#7A5C41] hover:text-[#3D2B1F] p-1">
                <FiX size={22} />
              </button>
            </div>

            {/* Drawer Nav Links */}
            <nav className="flex-1 px-4 py-4 space-y-1">
              {mainNavLinks.map(({ label, key, url, sale }) => (
                <div key={label}>
                  {key && megaMenuData[key] ? (
                    /* Accordion item */
                    <div>
                      <button
                        onClick={() => setOpenAccordion(openAccordion === key ? null : key)}
                        className={`w-full flex items-center justify-between px-3 py-3.5 rounded-xl text-[13px] font-semibold tracking-widest uppercase transition-colors ${openAccordion === key ? 'bg-[#F5EFE4] text-[#3D2B1F]' : 'text-[#7A5C41] hover:bg-[#F7E7CE]'}`}
                      >
                        {label}
                        <FiChevronDown
                          className={`transition-transform duration-200 ${openAccordion === key ? 'rotate-180' : ''}`}
                          size={16}
                        />
                      </button>
                      {openAccordion === key && (
                        <div className="ml-3 mt-1 space-y-3 pb-2">
                          <Link
                            to={url}
                            className="block px-3 py-2 text-[11px] font-bold tracking-widest text-[#C5A059] uppercase"
                          >
                            All {label.charAt(0) + label.slice(1).toLowerCase()} →
                          </Link>
                          {Object.entries(megaMenuData[key]).map(([subCat, items]) => (
                            <div key={subCat}>
                              <div className="px-3 text-[10px] font-bold tracking-[0.2em] text-[#3D2B1F] uppercase mb-1">
                                {subCat}
                              </div>
                              <div className="flex flex-wrap gap-2 px-3">
                                {items.map((item) => (
                                  <Link
                                    key={item}
                                    to={`/products?category=${key}&subCategory=${encodeURIComponent(subCat)}&productType=${encodeURIComponent(item)}`}
                                    className="text-[11px] text-[#7A5C41] hover:text-[#3D2B1F] bg-[#F5EFE4] px-3 py-1 rounded-full capitalize"
                                  >
                                    {item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Simple link */
                    <Link
                      to={url}
                      className={`block px-3 py-3.5 rounded-xl text-[13px] font-semibold tracking-widest uppercase transition-colors ${sale ? 'text-red-500 hover:bg-red-50' : 'text-[#7A5C41] hover:bg-[#F7E7CE]'}`}
                    >
                      {label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Drawer Footer */}
            <div className="border-t border-[#F0E8DF] px-6 py-4 space-y-3">
              {currentUser ? (
                <>
                  <Link to="/profile" className="flex items-center gap-3 text-[#3D2B1F]">
                    <img
                      src={currentUser.photoURL || default_profile_image}
                      alt="profile"
                      className="w-9 h-9 rounded-full object-cover border-2 border-[#C5A059]"
                    />
                    <div>
                      <div className="text-[12px] font-semibold">My Profile</div>
                      <div className="text-[10px] text-[#7A5C41]">Account details</div>
                    </div>
                  </Link>
                  {/* Orders and Wishlist were only named in the profile subtitle,
                      never linked, so on a phone there was no way to reach them. */}
                  <div className="flex gap-2 pt-1">
                    <Link to="/orders" className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-[#F0E8DF] text-[#3D2B1F] text-[11px] font-semibold tracking-widest uppercase rounded-full">
                      <FiPackage size={14} /> Orders
                    </Link>
                    <Link to="/wishlist" className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-[#F0E8DF] text-[#3D2B1F] text-[11px] font-semibold tracking-widest uppercase rounded-full">
                      <FiHeart size={14} /> Saved
                    </Link>
                  </div>
                </>
              ) : (
                <div className="flex gap-3">
                  <Link to="/login" className="flex-1 text-center py-2.5 border border-[#3D2B1F] text-[#3D2B1F] text-[12px] font-semibold tracking-widest uppercase rounded-full hover:bg-[#3D2B1F] hover:text-white transition-colors">
                    Login
                  </Link>
                  <Link to="/register" className="flex-1 text-center py-2.5 bg-[#C5A059] text-white text-[12px] font-semibold tracking-widest uppercase rounded-full hover:bg-[#3D2B1F] transition-colors">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewNavbar;
