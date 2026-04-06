import React from 'react';
import { Link } from 'react-router-dom';
import { SectionContainer } from './shared';

const CategoryProductFeed = ({ categoryName, subtitle, products, bgColor = "bg-champagne" }) => {
    return (
        <SectionContainer bgColor={bgColor} className="py-16 md:py-24 border-b border-bronze/5">
            <div className="container mx-auto px-4 lg:px-12 max-w-7xl">

                {/* Header section explicitly styled like CuratedOccasions */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-16 lg:mb-24">
                    <div className="text-center md:text-left mb-6 md:mb-0">
                        <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-gold block mb-4">
                            {subtitle}
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-7xl font-editorial font-black text-bronze uppercase leading-none tracking-tighter">
                            {categoryName.split(' ')[0]} <span className="text-gold italic font-light">{categoryName.split(' ').slice(1).join(' ')}</span>
                        </h2>
                    </div>

                    <Link
                        to={`/products?category=${encodeURIComponent(categoryName)}`}
                        className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-bronze hover:text-gold transition-colors pb-1 border-b border-bronze/30 hover:border-gold"
                    >
                        View All {categoryName}
                        <span className="material-symbols-outlined text-sm flex-shrink-0 group-hover:translate-x-1 transition-transform">
                            arrow_forward
                        </span>
                    </Link>
                </div>

                {/* 4-Column Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {products.map((product, idx) => (
                        <Link to={`/products`} key={idx} className="group relative aspect-[3/4] overflow-hidden rounded-2xl block bg-white/50 border border-transparent hover:border-gold/30 transition-all duration-500 shadow-sm hover:shadow-2xl">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                            />

                            {/* Inner gradient overlay mimicking CuratedOccasions */}
                            <div className="absolute inset-0 bg-gradient-to-t from-chocolate/95 via-chocolate/30 to-transparent opacity-90 transition-opacity duration-500"></div>

                            {/* Badges - Top Left */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                                {product.isNew && (
                                    <span className="bg-champagne text-chocolate text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm shadow-sm">
                                        New
                                    </span>
                                )}
                                {product.isBespoke && (
                                    <span className="bg-gold text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm shadow-sm">
                                        Custom Stitch
                                    </span>
                                )}
                            </div>

                            <div className="absolute top-4 right-4 z-10">
                                <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:text-chocolate hover:bg-white transition-all shadow-sm">
                                    <span className="material-symbols-outlined text-sm">favorite</span>
                                </button>
                            </div>

                            {/* Details Overlay (Bottom) */}
                            <div className="absolute inset-0 p-6 flex flex-col justify-end z-10 translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-champagne/80 drop-shadow-md mb-2">
                                    {product.material}
                                </p>
                                <h3 className="text-xl md:text-2xl font-editorial font-black text-white uppercase leading-tight mb-2 drop-shadow-xl group-hover:text-gold transition-colors">
                                    {product.name}
                                </h3>

                                <div className="flex items-center gap-3">
                                    {product.originalPrice && (
                                        <span className="text-xs text-champagne/60 line-through drop-shadow-md">
                                            {product.originalPrice}
                                        </span>
                                    )}
                                    <span className="text-lg font-editorial text-champagne font-medium drop-shadow-md">
                                        {product.price}
                                    </span>
                                </div>

                                {/* Hover Action */}
                                <div className="mt-4 overflow-hidden">
                                    <button className="w-full bg-champagne/10 backdrop-blur-md border border-champagne/30 text-champagne py-3 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-gold hover:border-gold hover:text-chocolate transition-all translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-500">
                                        Quick Add
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </SectionContainer>
    );
};

export default CategoryProductFeed;
