import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useProductsContext } from '../../context/products_context';
import { formatPrice } from '../../utils/helpers';
import { SectionContainer, OptimizedImage } from './shared';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const TrendingDresses = () => {
    const { products } = useProductsContext();
    const sectionRef = useRef(null);
    const gridRef = useRef(null);

    useScrollAnimation({
        ref: gridRef,
        from: { y: 60, opacity: 0 },
        to: { y: 0, opacity: 1 },
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.1,
        contextRef: sectionRef
    });

    const fallbackProducts = [
        { id: 't1', name: 'Emerald Velvet Anarkali', category: 'Women', subCategory: 'Anarkali', price: 65000, image: '/assets/landing/lehenga-1.jpg', badge: 'TRENDING' },
        { id: 't2', name: 'Pastel Floral Lehenga', category: 'Women', subCategory: 'Lehengas', price: 110000, image: '/assets/landing/lehenga-2.jpg', badge: 'BEST SELLER' },
        { id: 't3', name: 'Midnight Blue Saree', category: 'Women', subCategory: 'Sarees', price: 45000, image: '/assets/landing/saree-1.jpg', badge: 'NEW' },
        { id: 't4', name: 'Crimson Bridal Suite', category: 'Women', subCategory: 'Bridal', price: 180000, image: '/assets/landing/lehenga-3.jpg', badge: 'LIMITED' }
    ];

    const trending = products && products.length > 4 ? products.slice(4, 8) : fallbackProducts;

    // Helper to render a product card to avoid repetition
    const renderProductCard = (product, idx, customClasses) => (
        <Link
            to={!product.id || product.id.startsWith('t') ? '/products?sort=trending' : `/products/${product.id}`}
            key={product.id || idx}
            className={`group relative overflow-hidden block bg-bronze border border-bronze/10 hover:border-gold/40 transition-all duration-700 shadow-xl ${customClasses}`}
        >
            <OptimizedImage
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-105"
                width={800}
                height={1000}
            />

            {/* Inner gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-chocolate/95 via-chocolate/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-700"></div>

            {/* Badge */}
            {(product.badge || (idx === 0 ? 'SIGNATURE' : '')) && (
                <div className="absolute top-6 left-6 z-10">
                    <span className="bg-gold text-bronze text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                        {product.badge || (idx === 0 ? 'SIGNATURE' : '')}
                    </span>
                </div>
            )}

            {/* Details Overlay */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end z-10 translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold mb-3 drop-shadow-md">
                    {product.category} {product.subCategory ? `// ${product.subCategory}` : ''}
                </p>
                <h3 className="text-2xl lg:text-3xl font-editorial font-black text-champagne uppercase leading-none mb-4 group-hover:text-gold transition-colors drop-shadow-xl">
                    {product.name}
                </h3>
                <span className="text-xl font-editorial text-champagne/90 drop-shadow-md mb-6">
                    {formatPrice(product.price)}
                </span>

                {/* Reveal line and link */}
                <div className="w-full h-[1px] bg-gold/30 mb-6 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>

                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                    <span>View Details</span>
                    <span className="material-symbols-outlined text-sm">east</span>
                </div>
            </div>
        </Link>
    );

    if (trending.length < 4) return null; // Safety check

    return (
        <SectionContainer ref={sectionRef} bgColor="bg-[#fbf9f6]" className="py-24 lg:py-40 border-b border-bronze/10">
            <div className="container mx-auto px-4 lg:px-12 max-w-7xl">

                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 lg:mb-24">
                    <div>
                        <div className="flex items-center gap-6 mb-6">
                            <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-gold">Most Coveted</span>
                            <div className="h-[1px] w-12 bg-gold/40"></div>
                        </div>
                        <h2 className="text-5xl md:text-6xl lg:text-[5rem] font-editorial font-black text-bronze uppercase leading-[0.85] tracking-tighter">
                            TRENDING <br /><span className="text-gold italic font-light">ATELIER</span>
                        </h2>
                    </div>
                    <Link
                        to="/products?sort=trending"
                        className="group flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.4em] text-gold hover:text-champagne transition-colors"
                    >
                        <span>Explore Curated Edit</span>
                        <div className="size-10 rounded-full border border-gold/40 flex items-center justify-center group-hover:bg-champagne transition-colors">
                            <span className="material-symbols-outlined text-sm text-gold group-hover:text-champagne">arrow_forward</span>
                        </div>
                    </Link>
                </div>

                {/* Asymmetrical Editorial Grid */}
                <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

                    {/* Item 1 - Left Massive Feature (spans 7 cols, 2 rows logically if right side is split) */}
                    <div className="lg:col-span-7 h-[600px] sm:h-[800px] lg:h-auto">
                        {renderProductCard(trending[0], 0, "w-full h-full rounded-[40px] lg:rounded-[60px]")}
                    </div>

                    {/* Right Column Stack */}
                    <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-8">

                        {/* Item 2 - Top Right */}
                        <div className="h-[500px] lg:h-[500px]">
                            {renderProductCard(trending[1], 1, "w-full h-full rounded-[40px]")}
                        </div>

                        {/* Items 3 & 4 - Bottom Right Split */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 h-auto sm:h-[400px] lg:h-[350px]">
                            <div className="h-[400px] sm:h-full">
                                {renderProductCard(trending[2], 2, "w-full h-full rounded-[30px]")}
                            </div>
                            <div className="h-[400px] sm:h-full">
                                {renderProductCard(trending[3], 3, "w-full h-full rounded-[30px]")}
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </SectionContainer>
    );
};

export default TrendingDresses;
