import React from 'react';
import { formatPrice } from '../../utils/helpers';
import { Link } from 'react-router-dom';
import { useUserContext } from '../../context/user_context';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Product = ({ image, name, price, id, category }) => {
  const { wishlist, toggleWishlistItem, currentUser } = useUserContext();
  const isWishlisted = wishlist.some(item => (item._id || item) === id);

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) {
      toast.info('Please login to save favorites', { position: 'top-center' });
      return;
    }
    const res = await toggleWishlistItem(id);
    if (!res.success) {
      toast.error(res.message);
    }
  };

  return (
    <div className="group relative">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-white mb-8">
        <Link to={`/products/${id}`}>
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
          />
        </Link>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 pointer-events-none" />

        {/* Wishlist Heart */}
        <button
          onClick={handleWishlist}
          className="absolute top-4 right-4 z-10 p-3 bg-white/80 backdrop-blur-sm rounded-full text-bronze hover:bg-white hover:scale-110 transition-all duration-300 shadow-sm"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isWishlisted ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
        </button>

        {/* Hover CTA */}
        <Link
          to={`/products/${id}`}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 px-8 py-4 bg-white text-bronze text-[10px] font-bold uppercase tracking-widest opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 hover:bg-gold hover:text-white whitespace-nowrap"
        >
          Quick View
        </Link>
      </div>

      {/* Product Info */}
      <div className="flex justify-between items-start">
        <div className="space-y-1 flex-1 min-w-0 pr-4">
          <h3 className="text-2xl font-editorial font-bold text-bronze truncate">{name}</h3>
          {category && (
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-gold">
              {category} // Heritage
            </p>
          )}
        </div>
        <p className="text-xl font-editorial text-bronze whitespace-nowrap">{formatPrice(price)}</p>
      </div>
    </div>
  );
};

export default Product;
