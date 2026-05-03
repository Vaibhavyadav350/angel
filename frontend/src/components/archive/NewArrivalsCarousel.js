import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useProductsContext } from '../../context/products_context';
import { formatPrice } from '../../utils/helpers';
import { SectionContainer, OptimizedImage } from './shared';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const NewArrivalsCarousel = () => {
    const { products } = useProductsContext();
    const sectionRef = useRef(null);
    const scrollContainerRef = useRef(null);

    useScrollAnimation({
        ref: scrollContainerRef,
        from: { y: 60, opacity: 0 },
        to: { y: 0, opacity: 1 },
        duration: 1.2,
        ease: 'power3.out',
        contextRef: sectionRef
    });

    const fallbackProducts = [
        { id: 'fb1', name: 'Zardozi Banarasi Saree', category: 'Women', subCategory: 'Sarees', price: 85000, image: '/assets/landing/saree-1.jpg', shipping: true, description: "Heirloom luxury spun in gold threads." },
        { id: 'fb2', name: 'Royal Velvet Lehenga', category: 'Women', subCategory: 'Lehengas', price: 125000, image: '/assets/landing/lehenga-1.jpg', shipping: true, description: "A timeless masterpiece for the modern bride." },
        { id: 'fb3', name: 'Classic Silk Sherwani', category: 'Men', subCategory: 'Sherwanis', price: 75000, image: '/assets/landing/hero-men.jpg', shipping: true, description: "Structured elegance for the groomsmen." },
        { id: 'fb4', name: 'Organza Bridal Suite', category: 'Women', subCategory: 'Anarkali', price: 95000, image: '/assets/landing/lehenga-4.jpg', shipping: true, description: "Weightless glamour in pure organza." },
    ];

    const newArrivals = products && products.length > 0 ? products.slice(0, 4) : fallbackProducts;

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const amount = window.innerWidth * 0.8;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -amount : amount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <SectionContainer ref={sectionRef} bgColor="bg-champagne" className="py-24 lg:py-40 border-b border-bronze/10">
            <div className="container mx-auto px-4 lg:px-12 max-w-[1600px] mb-12">

                {/* Header Block matching the "Festive Archive" vibe */}
                <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-8">
                    <div className="relative">
                        <div className="flex items-center gap-6 mb-6">
                            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-bronze/60">Edition 2026</span>
                            <div className="h-[1px] w-24 bg-bronze/20"></div>
                        </div>
                        <h2 className="text-5xl md:text-7xl lg:text-[7rem] font-editorial font-black text-bronze uppercase leading-[0.85] tracking-tighter relative z-10">
                            NEW <span className="text-gold italic font-light drop-shadow-sm">ARRIVALS</span>
                        </h2>
                    </div>

                    {/* Navigation Controls */}
                    <div className="flex items-center gap-6">
                        <Link
                            to="/products?sort=newest"
                            className="group hidden md:flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.4em] text-bronze hover:text-gold transition-colors mr-10"
                        >
                            <span className="pb-1 border-b border-bronze/20 group-hover:border-gold">Explore All</span>
                        </Link>
                        <div className="flex gap-4">
                            <button onClick={() => scroll('left')} className="size-14 rounded-full border border-bronze/20 text-bronze flex items-center justify-center hover:bg-bronze hover:text-champagne transition-all shadow-sm" aria-label="Scroll left">
                                <span className="material-symbols-outlined text-xl">west</span>
                            </button>
                            <button onClick={() => scroll('right')} className="size-14 rounded-full border border-bronze/20 text-bronze flex items-center justify-center hover:bg-bronze hover:text-champagne transition-all shadow-sm" aria-label="Scroll right">
                                <span className="material-symbols-outlined text-xl">east</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Immersive Poster Scroll (Robust Native CSS) */}
            <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto snap-x snap-mandatory gap-6 lg:gap-12 px-4 lg:px-12 pb-12 scrollbar-hide w-full"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {newArrivals.map((product, idx) => (
                    <Link
                        key={product.id || idx}
                        to={!product.id || product.id.startsWith('fb') ? '/products?sort=newest' : `/products/${product.id}`}
                        className="group relative snap-center shrink-0 w-[90vw] sm:w-[80vw] lg:w-[65vw] h-[60vh] sm:h-[70vh] lg:h-[80vh] overflow-hidden rounded-[30px] lg:rounded-[50px] block bg-bronze cursor-pointer shadow-2xl border border-bronze/10"
                    >
                        <OptimizedImage
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover object-top transition-transform duration-[4000ms] group-hover:scale-[1.03]"
                            width={1600}
                            height={1200}
                        />

                        {/* Heavy Cinematic Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 opacity-70 group-hover:opacity-80 transition-opacity duration-700"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent w-1/2 opacity-50"></div>

                        {/* Large Editorial Watermark Number */}
                        <div className="absolute top-10 right-10 z-10 opacity-20 group-hover:opacity-40 transition-opacity duration-700 mix-blend-overlay">
                            <span className="text-[10rem] font-editorial font-black leading-none text-champagne">
                                0{idx + 1}
                            </span>
                        </div>

                        {/* Bottom Info Layout */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 lg:p-16 z-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">

                            {/* Main Title Block */}
                            <div className="max-w-xl transform group-hover:-translate-y-4 transition-transform duration-700 ease-out">
                                <span className="inline-block border border-gold/40 text-gold bg-black/30 backdrop-blur-md text-[10px] font-bold uppercase tracking-[0.4em] px-4 py-2 rounded-full mb-6">
                                    {product.subCategory || 'Vanguard Collection'}
                                </span>
                                <h3 className="text-4xl sm:text-5xl lg:text-7xl font-editorial font-black text-champagne uppercase leading-[0.9] drop-shadow-2xl">
                                    {product.name}
                                </h3>
                                <p className="text-sm font-medium text-champagne/70 mt-6 max-w-sm hidden sm:block border-l-2 border-gold/40 pl-4 h-0 group-hover:h-12 overflow-hidden transition-all duration-700 ease-in-out opacity-0 group-hover:opacity-100">
                                    {product.description || "Witness the pinnacle of contemporary archival design. Hand-stitched for the modern era."}
                                </p>
                            </div>

                            {/* Price / Action Block */}
                            <div className="flex flex-col items-start md:items-end gap-6 shrink-0 transform group-hover:-translate-y-4 transition-transform duration-700 ease-out delay-75">
                                <span className="text-3xl lg:text-5xl font-editorial text-gold drop-shadow-md">
                                    {formatPrice(product.price)}
                                </span>
                                <div className="flex items-center gap-4 bg-champagne text-bronze px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-xl group-hover:bg-gold transition-colors">
                                    Explore Piece
                                    <span className="material-symbols-outlined text-sm">north_east</span>
                                </div>
                            </div>

                        </div>
                    </Link>
                ))}
            </div>
        </SectionContainer>
    );
};

export default NewArrivalsCarousel;
