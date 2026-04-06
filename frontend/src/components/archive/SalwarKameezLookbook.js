import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { SectionContainer, OptimizedImage } from './shared';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const SalwarKameezLookbook = ({ products = [] }) => {
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

    if (!products || products.length === 0) return null;

    // Use up to 4 products for this specific masonry layout
    const displayProducts = products.slice(0, 4);

    return (
        <SectionContainer ref={sectionRef} bgColor="bg-champagne" className="py-24 lg:py-32 border-b border-bronze/10">
            <div ref={gridRef} className="container mx-auto px-4 lg:px-12 max-w-[1400px]">

                {/* Lookbook Header */}
                <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16 lg:mb-24">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-bronze/60">Ready to Wear & Bespoke</span>
                            <div className="flex-1 h-[1px] bg-bronze/20"></div>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-[4.5rem] font-editorial font-black text-bronze uppercase leading-none tracking-tighter mb-6">
                            Salwar <span className="text-gold italic font-light">Kameez</span>
                        </h2>
                        <p className="text-sm font-medium text-bronze/70 leading-relaxed border-l-2 border-gold/40 pl-4">
                            A curation of intricately embroidered Anarkalis, Shararas, and straight-cut suits. Woven with heritage, tailored for the modern silhouette.
                        </p>
                    </div>
                    <Link
                        to="/products?category=Women&subCategory=Salwar+Kameez"
                        className="group flex flex-col items-center gap-3 shrink-0"
                    >
                        <div className="size-16 rounded-full border border-bronze text-bronze flex items-center justify-center group-hover:bg-bronze group-hover:text-champagne transition-all duration-500 overflow-hidden relative">
                            <span className="material-symbols-outlined absolute transform group-hover:-translate-y-8 transition-transform duration-500">east</span>
                            <span className="material-symbols-outlined absolute transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">east</span>
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-bronze group-hover:text-gold transition-colors">
                            View All
                        </span>
                    </Link>
                </div>

                {/* Editorial Masonry Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12 min-h-[800px]">

                    {/* Column 1: Vertically Centered */}
                    <div className="flex flex-col justify-center">
                        {displayProducts[0] && (
                            <Link to={displayProducts[0].id ? `/products/${displayProducts[0].id}` : '/products?category=Women&subCategory=Salwar+Kameez'} className="group relative block w-full aspect-[3/4] overflow-hidden rounded-[20px] shadow-xl">
                                <OptimizedImage src={displayProducts[0].image} alt={displayProducts[0].name} className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-105" width={600} height={800} />
                                <div className="absolute inset-0 bg-gradient-to-t from-chocolate/90 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute bottom-6 left-6 right-6">
                                    <h3 className="text-2xl font-editorial font-black text-champagne uppercase drop-shadow-md">{displayProducts[0].name}</h3>
                                    <p className="text-[10px] font-bold tracking-widest text-gold mt-2 uppercase">{displayProducts[0].price}</p>
                                </div>
                            </Link>
                        )}
                    </div>

                    {/* Column 2: Stacked (Top and Bottom) */}
                    <div className="flex flex-col gap-6 lg:gap-12">
                        {displayProducts[1] && (
                            <Link to={displayProducts[1].id ? `/products/${displayProducts[1].id}` : '/products?category=Women&subCategory=Salwar+Kameez'} className="group relative block w-full h-[350px] lg:h-[400px] overflow-hidden rounded-[20px] shadow-xl">
                                <OptimizedImage src={displayProducts[1].image} alt={displayProducts[1].name} className="w-full h-full object-cover object-top transition-transform duration-[3000ms] group-hover:scale-105" width={600} height={400} />
                                <div className="absolute inset-0 bg-gradient-to-t from-chocolate/90 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute bottom-6 left-6 right-6">
                                    <h3 className="text-xl font-editorial font-black text-champagne uppercase drop-shadow-md">{displayProducts[1].name}</h3>
                                    <p className="text-[10px] font-bold tracking-widest text-gold mt-2 uppercase">{displayProducts[1].price}</p>
                                </div>
                            </Link>
                        )}
                        {displayProducts[2] && (
                            <Link to={displayProducts[2].id ? `/products/${displayProducts[2].id}` : '/products?category=Women&subCategory=Salwar+Kameez'} className="group relative block w-full flex-grow overflow-hidden rounded-[20px] shadow-xl">
                                <OptimizedImage src={displayProducts[2].image} alt={displayProducts[2].name} className="w-full h-full object-cover object-center transition-transform duration-[3000ms] group-hover:scale-105" width={600} height={600} />
                                <div className="absolute inset-0 bg-gradient-to-t from-chocolate/90 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute bottom-6 left-6 right-6">
                                    <h3 className="text-xl font-editorial font-black text-champagne uppercase drop-shadow-md">{displayProducts[2].name}</h3>
                                    <p className="text-[10px] font-bold tracking-widest text-gold mt-2 uppercase">{displayProducts[2].price}</p>
                                </div>
                            </Link>
                        )}
                    </div>

                    {/* Column 3: Aligned to Bottom */}
                    <div className="flex flex-col justify-end">
                        {displayProducts[3] && (
                            <Link to={displayProducts[3].id ? `/products/${displayProducts[3].id}` : '/products?category=Women&subCategory=Salwar+Kameez'} className="group relative block w-full aspect-[4/5] overflow-hidden rounded-[20px] shadow-xl">
                                <OptimizedImage src={displayProducts[3].image} alt={displayProducts[3].name} className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-105" width={600} height={800} />
                                <div className="absolute inset-0 bg-gradient-to-t from-chocolate/90 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute bottom-6 left-6 right-6">
                                    <h3 className="text-2xl font-editorial font-black text-champagne uppercase drop-shadow-md">{displayProducts[3].name}</h3>
                                    <p className="text-[10px] font-bold tracking-widest text-gold mt-2 uppercase">{displayProducts[3].price}</p>
                                </div>
                            </Link>
                        )}
                    </div>

                </div>
            </div>
        </SectionContainer>
    );
};

export default SalwarKameezLookbook;
