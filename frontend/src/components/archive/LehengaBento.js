import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { SectionContainer, OptimizedImage } from './shared';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const LehengaBento = ({ products = [] }) => {
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

    // We specifically need 4 products for this Bento grid
    const displayProducts = products.slice(0, 4);

    return (
        <SectionContainer ref={sectionRef} bgColor="bg-white" className="py-24 lg:py-32">
            <div className="container mx-auto px-4 lg:px-12 max-w-[1500px]">

                {/* Bento Header */}
                <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12 lg:mb-20">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="size-2 bg-gold rounded-full"></div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-bronze">Wedding & Party</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-[5.5rem] font-editorial font-black text-bronze uppercase leading-[0.85] tracking-tighter">
                            Lehenga <span className="text-gold italic font-light">Choli</span>
                        </h2>
                    </div>
                    <Link
                        to="/products?category=Women&subCategory=Lehengas"
                        className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] text-bronze hover:text-gold transition-colors pb-2 border-b border-bronze/20 hover:border-gold"
                    >
                        View Collection
                        <span className="material-symbols-outlined text-sm">east</span>
                    </Link>
                </div>

                {/* Asymmetric Bento Box Grid */}
                {/* Mobile: regular stack. Tablet/Desktop: 4 columns, 2 rows. */}
                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 sm:gap-6 h-auto md:h-[600px] lg:h-[800px]">

                    {/* Item 0: Hero Square (2x2) */}
                    {displayProducts[0] && (
                        <Link
                            to={displayProducts[0].id ? `/products/${displayProducts[0].id}` : '/products?category=Women&subCategory=Lehengas'}
                            className="group relative md:col-span-2 md:row-span-2 h-[400px] md:h-full overflow-hidden rounded-[24px] sm:rounded-[32px] block bg-champagne"
                        >
                            <OptimizedImage
                                src={displayProducts[0].image}
                                alt={displayProducts[0].name}
                                className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-105"
                                width={800} height={800}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-chocolate/90 via-chocolate/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500"></div>

                            <div className="absolute top-6 left-6 z-10">
                                <span className="bg-white/90 backdrop-blur-md text-bronze text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                                    {displayProducts[0].isBespoke ? 'BESPOKE' : 'SIGNATURE'}
                                </span>
                            </div>

                            <div className="absolute bottom-8 left-8 right-8 z-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <h3 className="text-4xl lg:text-5xl font-editorial font-black text-champagne uppercase leading-none drop-shadow-xl mb-3">
                                    {displayProducts[0].name}
                                </h3>
                                <p className="text-xl font-editorial text-gold drop-shadow-md">
                                    {displayProducts[0].price}
                                </p>
                            </div>
                        </Link>
                    )}

                    {/* Item 1: Tall Rectangle (1x2) */}
                    {displayProducts[1] && (
                        <Link
                            to={displayProducts[1].id ? `/products/${displayProducts[1].id}` : '/products?category=Women&subCategory=Lehengas'}
                            className="group relative md:col-span-1 md:row-span-2 h-[400px] md:h-full overflow-hidden rounded-[24px] sm:rounded-[32px] block bg-champagne"
                        >
                            <OptimizedImage
                                src={displayProducts[1].image}
                                alt={displayProducts[1].name}
                                className="w-full h-full object-cover object-top transition-transform duration-[3000ms] group-hover:scale-105"
                                width={500} height={800}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-chocolate/90 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500"></div>

                            <div className="absolute bottom-6 left-6 right-6 z-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <h3 className="text-2xl font-editorial font-bold text-champagne uppercase leading-tight drop-shadow-xl mb-2">
                                    {displayProducts[1].name}
                                </h3>
                                <p className="text-lg font-editorial text-gold drop-shadow-md">
                                    {displayProducts[1].price}
                                </p>
                            </div>
                        </Link>
                    )}

                    {/* Item 2: Small Square Top (1x1) */}
                    {displayProducts[2] && (
                        <Link
                            to={displayProducts[2].id ? `/products/${displayProducts[2].id}` : '/products?category=Women&subCategory=Lehengas'}
                            className="group relative md:col-span-1 md:row-span-1 h-[300px] md:h-full overflow-hidden rounded-[24px] sm:rounded-[32px] block bg-champagne"
                        >
                            <OptimizedImage
                                src={displayProducts[2].image}
                                alt={displayProducts[2].name}
                                className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-105"
                                width={400} height={400}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-chocolate/90 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500"></div>

                            <div className="absolute bottom-6 left-6 right-6 z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                <h3 className="text-xl font-editorial font-bold text-champagne uppercase leading-tight drop-shadow-xl mb-1">
                                    {displayProducts[2].name}
                                </h3>
                                <p className="text-sm font-editorial text-gold drop-shadow-md">
                                    {displayProducts[2].price}
                                </p>
                            </div>
                        </Link>
                    )}

                    {/* Item 3: Small Square Bottom (1x1) */}
                    {displayProducts[3] && (
                        <Link
                            to={displayProducts[3].id ? `/products/${displayProducts[3].id}` : '/products?category=Women&subCategory=Lehengas'}
                            className="group relative md:col-span-1 md:row-span-1 h-[300px] md:h-full overflow-hidden rounded-[24px] sm:rounded-[32px] block bg-champagne"
                        >
                            <OptimizedImage
                                src={displayProducts[3].image}
                                alt={displayProducts[3].name}
                                className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-105"
                                width={400} height={400}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-chocolate/90 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500"></div>

                            <div className="absolute bottom-6 left-6 right-6 z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                <h3 className="text-xl font-editorial font-bold text-champagne uppercase leading-tight drop-shadow-xl mb-1">
                                    {displayProducts[3].name}
                                </h3>
                                <p className="text-sm font-editorial text-gold drop-shadow-md">
                                    {displayProducts[3].price}
                                </p>
                            </div>
                        </Link>
                    )}

                </div>
            </div>
        </SectionContainer>
    );
};

export default LehengaBento;
