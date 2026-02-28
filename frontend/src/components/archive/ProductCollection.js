import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useProductsContext } from '../../context/products_context';
import { useUserContext } from '../../context/user_context';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { formatPrice } from '../../utils/helpers';
import { FilterButton } from './shared';
import { OptimizedImage } from './shared';
import { SectionContainer } from './shared';
import { FILTER_OPTIONS } from '../../constants/archiveConstants';
import { mediumHeadingClasses, containerPaddingClasses, sectionPaddingClasses } from '../../utils/responsiveText';

const WishlistHeart = ({ productId, className = '' }) => {
  const { wishlist, toggleWishlistItem, currentUser } = useUserContext();
  const isWishlisted = wishlist.some(item => (item._id || item) === productId);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) {
      toast.info('Please login to save favorites', { position: 'top-center' });
      return;
    }
    const res = await toggleWishlistItem(productId);
    if (!res.success) toast.error(res.message);
  };

  return (
    <button
      onClick={handleToggle}
      className={`size-12 rounded-full flex items-center justify-center transition-all duration-500 ${isWishlisted ? 'bg-champagne text-red-500 scale-110 shadow-lg' : 'bg-transparent text-champagne/40 hover:bg-champagne hover:text-bronze opacity-0 group-hover:opacity-100'} ${className}`}
    >
      {isWishlisted ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
    </button>
  );
};

const ProductCollection = React.memo(() => {
  const { products_loading: loading, products_error: error, products } = useProductsContext();
  const [activeFilter, setActiveFilter] = useState('all');
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  // Filter products by category - memoized
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    // We want to map standard categories
    const relevantProducts = activeFilter === 'all'
      ? products
      : products.filter(p => p.category === activeFilter);

    return relevantProducts.slice(0, 3);
  }, [activeFilter, products]);

  // Memoized filter handler
  const handleFilterChange = useCallback((filter) => {
    setActiveFilter(filter);
  }, []);

  // Use DRY scroll animation hook
  useScrollAnimation({
    ref: gridRef,
    from: { y: 40, opacity: 0.8 },
    to: { y: 0, opacity: 1 },
    duration: 0.8,
    ease: 'power2.out',
    stagger: 0.1,
    contextRef: sectionRef,
    dependencies: [filteredProducts],
  });

  if (loading) {
    return <div className="text-center py-20 text-bronze">Loading Heritage Collection...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">Error loading collection.</div>;
  }

  return (
    <SectionContainer
      ref={sectionRef}
      bgColor="bg-bronze"
      className={`text-champagne ${sectionPaddingClasses} rounded-t-[80px] sm:rounded-t-[100px] lg:rounded-t-[120px]`}
      padding={false}
      paddingX={false}
      maxWidth={false}
    >
      <div className={`container mx-auto ${containerPaddingClasses}`}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-end gap-12 sm:gap-16 mb-24 sm:mb-32">
          <div>
            <span className="text-gold text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.6em] mb-6 sm:mb-8 block">
              CURATED SELECTION 2024
            </span>
            <h2 className={`${mediumHeadingClasses} font-editorial font-black leading-[0.85] uppercase`}>
              THE HERITAGE<br />COLLECTION
            </h2>
          </div>

          {/* Filter Buttons - Using DRY component */}
          <div className="flex flex-wrap gap-5 items-center">
            {FILTER_OPTIONS.map((option) => (
              <FilterButton
                key={option.value}
                label={option.label}
                value={option.value}
                isActive={activeFilter === option.value}
                onClick={handleFilterChange}
                ariaLabel={`Filter by ${option.value === 'all' ? 'all work' : option.value}`}
              />
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-16 lg:gap-24">
          {filteredProducts.length > 0 ? filteredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="group block focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 rounded-lg cursor-pointer"
              aria-label={`View ${product.name} - ${product.description}`}
            >
              <div className="relative aspect-[3/4] rounded-[40px] sm:rounded-[50px] lg:rounded-[60px] overflow-hidden mb-8 sm:mb-12 border border-champagne/5 shadow-2xl">
                <OptimizedImage
                  src={product.image}
                  alt={product.company || product.name}
                  className={`w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-110`}
                  width={600}
                  height={800}
                />
                <div className="absolute inset-0 bg-bronze/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" aria-hidden="true"></div>

                {/* Wishlist Heart Overlay */}
                <WishlistHeart productId={product.id} className="absolute top-10 left-10 z-10" />

                <div className="absolute top-10 right-10 size-16 bg-champagne rounded-full flex items-center justify-center text-bronze opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-6 group-hover:translate-y-0" aria-hidden="true">
                  <span className="material-symbols-outlined text-2xl" aria-hidden="true">shopping_bag</span>
                </div>
              </div>
              <div className="flex justify-between items-start px-4">
                <div>
                  <h3 className="text-4xl font-editorial font-bold uppercase mb-3 text-white">
                    {product.name}
                  </h3>
                  <p className="text-[10px] font-bold tracking-[0.3em] opacity-40 uppercase">
                    {product.description || product.category}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-editorial text-gold">
                    {formatPrice(((product.price * (1 - (product.discountPercent || 0) / 100)) * (1 + (product.taxPercent || 0) / 100)))}
                  </p>
                  {(product.discountPercent > 0) && (
                    <span className="text-[9px] font-bold uppercase tracking-widest text-champagne/30 line-through">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          )) : (
            <div className="col-span-full text-center py-20">
              <p className="text-champagne/60 text-lg">No products found</p>
            </div>
          )}
        </div>

        {/* View All Button */}
        <div className="mt-40 flex justify-center">
          <Link
            to="/products"
            className="group flex items-center gap-10 px-20 py-10 border border-champagne/20 rounded-full hover:bg-gold hover:border-gold transition-all duration-700 shadow-2xl"
          >
            <span className="text-xs font-bold uppercase tracking-[0.5em]">
              Explore Full Archive
            </span>
            <span className="material-symbols-outlined text-xl group-hover:translate-x-4 transition-transform">
              east
            </span>
          </Link>
        </div>
      </div>
    </SectionContainer>
  );
});

ProductCollection.displayName = 'ProductCollection';

export default ProductCollection;
