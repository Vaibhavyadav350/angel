import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { SectionContainer, OptimizedImage } from './shared';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import taxonomy from '../../utils/taxonomy.json';

const SareeArchival = ({ products = [] }) => {
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

    if (!products || products.length === 0) return null;

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const amount = window.innerWidth * 0.5; // Scroll by half screen
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -amount : amount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <SectionContainer ref={sectionRef} bgColor="bg-bronze" className="py-24 lg:py-32 overflow-hidden border-t border-champagne/10">
            <div className="container mx-auto px-4 lg:px-12 max-w-[1600px] mb-12 lg:mb-20">
                <div className="flex flex-col md:flex-row items-end justify-between gap-8">
                    <div>
                        <div className="flex items-center gap-6 mb-6">
                            <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-gold">Archival Weaves</span>
                            <div className="h-[1px] w-12 bg-gold/40"></div>
                        </div>
                        <h2 className="text-5xl md:text-6xl lg:text-[6rem] font-editorial font-black text-champagne uppercase leading-none tracking-tighter">
                            The Saree <span className="text-gold italic font-light overflow-visible">Edit</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link
                            to={`/products${taxonomy.landing_page_mappings.saree_archival}`}
                            className="mr-8 inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] text-gold hover:text-champagne transition-colors pb-2 border-b border-gold/30 hover:border-champagne"
                        >
                            View Archives
                        </Link>
                        <div className="flex gap-4">
                            <button onClick={() => scroll('left')} className="size-12 rounded-full border border-gold/30 text-gold flex items-center justify-center hover:bg-gold hover:text-bronze transition-all" aria-label="Scroll left">
                                <span className="material-symbols-outlined text-sm">west</span>
                            </button>
                            <button onClick={() => scroll('right')} className="size-12 rounded-full border border-gold/30 text-gold flex items-center justify-center hover:bg-gold hover:text-bronze transition-all" aria-label="Scroll right">
                                <span className="material-symbols-outlined text-sm">east</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cinematic Horizontal Track */}
            <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto snap-x snap-mandatory gap-6 lg:gap-8 px-4 lg:px-12 pb-12 scrollbar-hide w-full"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {products.map((product, idx) => (
                    <Link
                        key={product.id || idx}
                        to={product.id ? `/products/${product.id}` : `/products${taxonomy.landing_page_mappings.saree_archival}`}
                        className="group relative snap-center shrink-0 w-[85vw] sm:w-[50vw] lg:w-[35vw] xl:w-[28vw] aspect-[3/4] overflow-hidden rounded-[30px] sm:rounded-[40px] block bg-chocolate cursor-pointer shadow-2xl border border-champagne/10 hover:border-gold/30 transition-colors duration-700"
                    >
                        <OptimizedImage
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-[4000ms] group-hover:scale-105"
                            width={800}
                            height={1200}
                        />

                        {/* Intricate Archival Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-chocolate/95 via-chocolate/40 to-black/20 opacity-80 group-hover:opacity-95 transition-opacity duration-700"></div>

                        {/* Top Metadata */}
                        <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
                            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-champagne/70 border border-champagne/20 px-3 py-1 rounded-full bg-black/20 backdrop-blur-md">
                                Vol. 0{idx + 1}
                            </span>
                            <div className="size-10 rounded-full bg-black/20 backdrop-blur-md border border-champagne/20 flex items-center justify-center text-champagne group-hover:bg-gold group-hover:text-chocolate group-hover:border-gold transition-all duration-500">
                                <span className="material-symbols-outlined text-sm">favorite</span>
                            </div>
                        </div>

                        {/* Bottom Info Block */}
                        <div className="absolute bottom-6 left-6 right-6 z-10 transform sm:translate-y-8 group-hover:translate-y-0 transition-transform duration-700">
                            <h3 className="text-2xl sm:text-3xl font-editorial font-black text-champagne uppercase leading-tight drop-shadow-2xl mb-2 group-hover:text-gold transition-colors">
                                {product.name}
                            </h3>
                            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-champagne/60 drop-shadow-md mb-6">
                                {product.material || product.category}
                            </p>

                            <div className="flex items-center justify-between border-t border-champagne/20 pt-4 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                <span className="text-xl font-editorial text-gold">
                                    {product.price}
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-champagne flex items-center gap-2">
                                    Explore <span className="material-symbols-outlined text-sm">trending_flat</span>
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </SectionContainer>
    );
};

export default SareeArchival;
