import React from 'react';
import { formatPrice } from '../../utils/helpers';
import { Link } from 'react-router-dom';
import { useUserContext } from '../../context/user_context';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const badgeOptions = [
  { label: 'BESPOKE STITCHING', condition: (p) => p.shipping },
  { label: 'NEW ARRIVAL', condition: (p) => p.featured },
  { label: 'ARCHIVE PIECE', condition: () => true },
];

const Product = ({ image, name, price, id, category, subCategory, shipping, featured, discountPercent, badgeText }) => {
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
    if (!res.success) toast.error(res.message);
  };

  // Pick badge
  let badgeLabel = badgeText;
  if (!badgeLabel) {
    const badge = badgeOptions.find(b => b.condition({ shipping, featured })) || badgeOptions[2];
    badgeLabel = badge.label;
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="group relative"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-white mb-8">
        <Link to={`/products/${id}`}>
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
          />
        </Link>

        {/* Subtle hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 pointer-events-none" />

        {/* Badge — top left */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1.5 bg-gold text-chocolate text-[8px] font-black uppercase tracking-widest shadow-sm">
            {badgeLabel}
          </span>
        </div>

        {/* Discount badge — top right (only when discount exists) */}
        {discountPercent > 0 && (
          <div className="absolute top-4 right-14 z-10">
            <span className="px-2 py-1 bg-chocolate text-champagne text-[8px] font-black uppercase tracking-widest">
              -{discountPercent}%
            </span>
          </div>
        )}

        {/* Wishlist Heart — top right */}
        <button
          onClick={handleWishlist}
          className="absolute top-4 right-4 z-10 p-3 bg-white/80 backdrop-blur-sm rounded-full text-bronze hover:bg-white hover:scale-110 transition-all duration-300 shadow-sm"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {isWishlisted ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
        </button>

        {/* Slide-up Hover Action Bar */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-10">
          <div className="bg-chocolate/90 backdrop-blur-sm px-6 py-4 flex items-center justify-between gap-3">
            <Link
              to={`/products/${id}`}
              className="flex-1 text-center text-[9px] font-black uppercase tracking-[0.3em] text-champagne hover:text-gold transition-colors"
            >
              Quick View
            </Link>
            <div className="w-px h-4 bg-champagne/20" />
            <Link
              to={`/products/${id}`}
              className="flex-1 text-center text-[9px] font-black uppercase tracking-[0.3em] text-gold hover:text-champagne transition-colors"
            >
              Customize Size
            </Link>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex justify-between items-start">
        <div className="space-y-1.5 flex-1 min-w-0 pr-4">
          <h3 className="text-2xl font-editorial font-bold text-bronze truncate group-hover:text-gold transition-colors duration-300">
            {name}
          </h3>
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-bronze/40">
            {category} {subCategory ? `// ${subCategory}` : ''}
          </p>
          {/* Free Shipping Pill */}
          {shipping && (
            <span className="inline-block text-[8px] font-bold uppercase tracking-widest text-gold border border-gold/30 px-2 py-0.5">
              Free Shipping
            </span>
          )}
        </div>
        <div className="text-right">
          <p className="text-xl font-editorial text-bronze whitespace-nowrap">{formatPrice(price)}</p>
          {discountPercent > 0 && (
            <p className="text-[10px] text-bronze/40 line-through">{formatPrice(price / (1 - discountPercent / 100))}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Product;
