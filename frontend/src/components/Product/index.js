import React from 'react';
import { formatPrice } from '../../utils/helpers';
import { Link } from 'react-router-dom';
import { useUserContext } from '../../context/user_context';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { productBadge, BADGE_TONE_CLASSES } from '../../utils/productBadge';

/**
 * Product card.
 *
 * The image carries exactly one mark — the collection badge. It previously held
 * three floating elements (badge, a discount chip, and the wishlist heart), with
 * the discount pinned to `right-14` purely to dodge the heart. On a fashion site
 * the garment is the product, so anything that can live below the photograph
 * does.
 *
 * The saving moved to the price row, which is where the shopper is already
 * looking when they weigh it up, and reads as money rather than as a sticker.
 */
const Product = ({ image, name, price, id, category, subCategory, collections, discountPercent, stock, activeCollection }) => {
  const { wishlist, toggleWishlistItem, currentUser } = useUserContext();
  const isWishlisted = wishlist.some((item) => (item._id || item) === id);

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

  // Derived from the Curated Collections the owner ticks, highest priority first.
  // No badge at all when the product is in no collection — better than inventing
  // an "ARCHIVE PIECE" label for everything, which is what used to happen.
  const badge = productBadge({ collections }, { activeCollection });

  const discount = Number(discountPercent) || 0;
  const sellingPrice = price * (1 - discount / 100);

  // 43% of the catalogue currently has no stock. Those cards used to look
  // identical to buyable ones, so the shopper only found out after clicking.
  const soldOut = !(Number(stock) > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="group relative"
    >
      {/* Image — one mark only, nothing else over the garment */}
      <div className="relative aspect-[3/4] overflow-hidden bg-white">
        <Link to={`/products/${id}`} aria-label={name}>
          <img
            src={image?.replace(/^http:\/\//i, 'https://')}
            alt={name}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-[1.06] ${
              soldOut ? 'opacity-55 saturate-[0.65]' : ''
            }`}
          />
          <div className="absolute inset-0 bg-chocolate/0 group-hover:bg-chocolate/5 transition-colors duration-500" />

          {soldOut && (
            <span className="absolute inset-x-0 bottom-0 bg-chocolate/80 text-champagne text-center py-1.5 sm:py-2 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.25em] sm:tracking-[0.35em]">
              Sold Out
            </span>
          )}
        </Link>

        {/* Sold out outranks the collection badge — availability is the more
            useful thing to know at a glance. */}
        {badge && (
          <span
            className={`absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-10 px-2 py-1 sm:px-3 sm:py-1.5 text-[7px] sm:text-[8px] font-black uppercase tracking-[0.15em] sm:tracking-[0.18em] ${BADGE_TONE_CLASSES[badge.tone]}`}
          >
            {badge.label}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="mt-3.5 sm:mt-5 flex flex-col gap-1.5 sm:gap-2">
        <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.3em] text-bronze/35">
          {category}
          {subCategory ? ` // ${subCategory}` : ''}
        </p>

        <Link to={`/products/${id}`}>
          {/* Two lines rather than `truncate`, which cut names mid-word
              ("Sunshine Yellow Prin…"). min-h keeps the grid rows aligned. */}
          <h3 className={`text-base md:text-xl font-editorial font-bold leading-snug line-clamp-2 min-h-[2.6rem] md:min-h-[3.2rem] transition-colors duration-300 ${
            soldOut ? 'text-bronze/45' : 'text-bronze group-hover:text-gold'
          }`}>
            {name}
          </h3>
        </Link>

        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 min-w-0">
            <span className={`text-base md:text-xl font-editorial font-bold whitespace-nowrap ${soldOut ? 'text-bronze/45' : 'text-bronze'}`}>
              {formatPrice(sellingPrice)}
            </span>
            {discount > 0 && (
              <>
                <span className="text-[11px] text-bronze/35 line-through whitespace-nowrap">{formatPrice(price)}</span>
                <span className="px-1.5 py-0.5 bg-gold/15 text-gold text-[9px] font-black tracking-wider whitespace-nowrap">
                  −{discount}%
                </span>
              </>
            )}
          </div>

          <button
            onClick={handleWishlist}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className="shrink-0 p-1 sm:p-1.5 -mr-1 sm:-mr-1.5 mt-0.5 text-bronze/30 hover:text-gold transition-colors duration-300"
          >
            {isWishlisted ? <FaHeart className="text-[15px] text-gold" /> : <FaRegHeart className="text-[15px]" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Product;
