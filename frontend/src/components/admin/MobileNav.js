import React, { useEffect, useState } from 'react';
import { useAdminContext } from '../../context/admin_context';
import { useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiMenu, FiChevronRight, FiChevronDown, FiLogOut } from 'react-icons/fi';
import logo from '../../assets/logo.png';

export default function MobileNav({ onOpen, ...rest }) {
  const {
    currentAdmin: currentUser,
    logoutAdmin: logout,
  } = useAdminContext();
  const name = currentUser?.name;
  const location = useLocation();

  const [breadCrumbs, setBreadCrumbs] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    const { message } = await logout();
    toast.success(message || 'Logged out', { position: 'top-center' });
  };

  useEffect(() => {
    let path = location.pathname.substring(1).split('/');
    path = path.map((item, index) => {
      if (item === '') {
        return { name: 'home', path: '/' };
      }
      return {
        name: item,
        path: `${index === 1 ? `/${path[0]}/${item}` : `/${item}`}`,
      };
    });
    setBreadCrumbs(path);
  }, [location]);

  return (
    <div
      className="md:ml-60 px-4 md:px-6 h-16 flex items-center bg-white border-b border-bronze/10 justify-between sticky top-0 z-30"
      {...rest}
    >
      {/* Mobile menu button */}
      <button
        className="md:hidden text-bronze/60 hover:text-bronze transition-colors p-2 -ml-2"
        onClick={onOpen}
      >
        <FiMenu className="w-5 h-5" />
      </button>

      {/* Mobile brand */}
      <div className="md:hidden flex items-center">
        <img src={logo} alt="Angel Fashion Studio Logo" className="h-10 object-contain" />
      </div>

      {/* Desktop breadcrumbs */}
      <nav className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em]">
        <Link to="/" className="text-bronze/40 hover:text-gold transition-colors">
          Home
        </Link>
        {breadCrumbs[0]?.name !== 'home' &&
          breadCrumbs.map((item, index) => (
            <React.Fragment key={index}>
              <FiChevronRight className="text-bronze/20 w-3 h-3" />
              <Link
                to={item.path}
                className="text-bronze/60 hover:text-gold transition-colors capitalize"
              >
                {item.name}
              </Link>
            </React.Fragment>
          ))}
      </nav>

      {/* User menu */}
      <div className="relative">
        <button
          className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-bronze/5 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="w-8 h-8 rounded-full bg-bronze flex items-center justify-center">
            <span className="text-white text-xs font-bold uppercase">
              {name ? name.charAt(0) : 'A'}
            </span>
          </div>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-xs font-bold text-bronze">{name}</span>
            <span className="text-[9px] text-bronze/40 uppercase tracking-widest">Admin</span>
          </div>
          <FiChevronDown className="hidden md:block text-bronze/40 w-3 h-3" />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-bronze/10 rounded-lg shadow-lg z-50 py-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-bronze/70 hover:bg-bronze/5 hover:text-bronze transition-colors"
              >
                <FiLogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
