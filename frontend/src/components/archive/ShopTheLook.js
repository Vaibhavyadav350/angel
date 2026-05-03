import React, { useRef, useState, useMemo } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { useProductsContext } from '../../context/products_context';
import { formatPrice } from '../../utils/helpers';

/**
 * ShopTheLook - Interactive section with shoppable hotspots
 * Shows full-screen image with product hotspots and hover cards
 * Now uses real product data from the API via featured_products
 */
// Hotspot positions for up to 2 products
const hotspotPositions = [
  { position: { top: '40%', left: '35%' }, cardPosition: 'left' },
  { position: { top: '55%', left: '65%' }, cardPosition: 'right' },
];

const ShopTheLook = React.memo(() => {
  const sectionRef = useRef(null);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const { featured_products } = useProductsContext();

  // Use DRY scroll animation hook
  useScrollAnimation({
    ref: sectionRef,
    from: { opacity: 0.8, y: 20 },
    to: { opacity: 1, y: 0 },
    duration: 1,
    ease: 'power2.out',
  });

  // Use featured products from API, take up to 2
  const products = useMemo(() => {
    const source = featured_products && featured_products.length > 0
      ? featured_products.slice(0, 2)
      : [];
    return source.map((p, i) => ({
      id: p.id,
      name: p.name,
      category: p.category || 'Collection',
      price: p.price,
      ...hotspotPositions[i],
    }));
  }, [featured_products]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[110vh] w-full overflow-hidden bg-chocolate"
    >
      {/* Background Image - LESS OPACITY (0.90) and brightness-75 to match code.html */}
      <img
        alt="High-fashion couple in premium ethnic wear"
        className="w-full h-full object-cover brightness-75"
        style={{ opacity: 0.9 }}
        src="/assets/landing/shop-the-look.jpg"
        loading="lazy"
        width="1920"
        height="1200"
      />

      {/* Top Heading */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 text-center z-10">
        <h2 className="text-6xl lg:text-[7rem] font-editorial font-black text-champagne uppercase leading-[0.8]">
          SHOP THE LOOK
        </h2>
        <p className="text-gold text-[10px] font-bold uppercase tracking-[0.6em] mt-8">
          The Royal Archival Ensemble
        </p>
      </div>

      {/* Interactive Hotspots */}
      {products.map((product) => (
        <div
          key={product.id}
          className="absolute z-20 shop-hotspot"
          style={{ top: product.position.top, left: product.position.left }}
          onMouseEnter={() => setHoveredProduct(product.id)}
          onMouseLeave={() => setHoveredProduct(null)}
        >
          {/* Hotspot Button */}
          <button
            className="size-8 rounded-full bg-gold/80 backdrop-blur-sm border border-champagne/40 flex items-center justify-center text-champagne hover:scale-110 transition-transform min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
            aria-label={`View ${product.name} details`}
          >
            <span className="material-symbols-outlined text-sm font-bold" aria-hidden="true">
              add
            </span>
          </button>

          {/* Hover Card */}
          <div
            className={`hotspot-card absolute ${product.cardPosition === 'left' ? 'left-12' : 'right-12'
              } top-1/2 -translate-y-1/2 w-56 p-6 bg-white/10 backdrop-blur-2xl border border-white/20 transition-all duration-500 ${hoveredProduct === product.id
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 -translate-y-2 pointer-events-none'
              }`}
            role="tooltip"
            aria-hidden={hoveredProduct !== product.id}
          >
            <h4 className="text-champagne font-editorial font-bold text-lg mb-1">
              {product.name}
            </h4>
            <p className="text-gold text-[9px] font-bold uppercase tracking-widest mb-3">
              {product.category}
            </p>
            <p className="text-white text-xl font-editorial">
              {formatPrice(product.price)}
            </p>
          </div>
        </div>
      ))}

      {/* Bottom CTA Button */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
        <button className="px-16 py-8 bg-champagne text-chocolate font-bold text-[10px] uppercase tracking-[0.5em] hover:bg-gold transition-all duration-700 rounded-full min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-champagne focus:ring-offset-2">
          Add All To Concierge
        </button>
      </div>
    </section>
  );
});

ShopTheLook.displayName = 'ShopTheLook';

export default ShopTheLook;
