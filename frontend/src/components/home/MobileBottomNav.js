import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiSearch, FiHeart, FiShoppingBag, FiUser } from 'react-icons/fi';
import { useCartContext } from '../../context/cart_context';
import { useUserContext } from '../../context/user_context';

const MobileBottomNav = () => {
  const location = useLocation();
  const { total_items } = useCartContext();
  const { currentUser } = useUserContext();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#F0E8DF] px-6 py-3 z-[200] flex justify-between items-center shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
      
      {/* Home */}
      <Link 
        to="/" 
        className={`flex flex-col items-center gap-1 transition-colors ${isActive('/') ? 'text-[#C5A059]' : 'text-[#7A5C41]'}`}
      >
        <FiHome size={20} />
        <span className="text-[9px] font-bold tracking-widest uppercase">Home</span>
      </Link>
...
      {/* Search */}
      <Link 
        to="/products" 
        className={`flex flex-col items-center gap-1 transition-colors ${isActive('/products') ? 'text-[#C5A059]' : 'text-[#7A5C41]'}`}
      >
        <FiSearch size={20} />
        <span className="text-[9px] font-bold tracking-widest uppercase">Search</span>
      </Link>

      {/* Wishlist */}
      <Link 
        to="/wishlist" 
        className={`flex flex-col items-center gap-1 transition-colors ${isActive('/wishlist') ? 'text-[#C5A059]' : 'text-[#7A5C41]'}`}
      >
        <FiHeart size={20} />
        <span className="text-[9px] font-bold tracking-widest uppercase">Wishlist</span>
      </Link>

      {/* Cart */}
      <Link 
        to="/cart" 
        className={`flex flex-col items-center gap-1 relative transition-colors ${isActive('/cart') ? 'text-[#C5A059]' : 'text-[#7A5C41]'}`}
      >
        <FiShoppingBag size={20} />
        <span className="text-[9px] font-bold tracking-widest uppercase">Cart</span>
        {total_items > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#C5A059] text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {total_items}
          </span>
        )}
      </Link>
    </div>
  );
};

export default MobileBottomNav;
