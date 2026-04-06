import React from 'react';
import { Link } from 'react-router-dom';

// Placeholder elegant texture/fabric images for categories
const categories = [
    { label: 'A-LINE', img: '/assets/landing/cat-lehenga.jpg', link: '/products?subCategory=Lehengas' },
    { label: 'FISHTAIL', img: '/assets/landing/cat-anarkali.jpg', link: '/products?subCategory=Lehengas' },
    { label: 'BANARASI', img: '/assets/landing/cat-saree.jpg', link: '/products?subCategory=Sarees' },
    { label: 'SILK', img: '/assets/landing/hero-saree.jpg', link: '/products?category=Women' },
    { label: 'VELVET', img: '/assets/landing/hero-lehenga.jpg', link: '/products?category=Women' },
    { label: 'GEORGETTE', img: '/assets/landing/saree-2.jpg', link: '/products?category=Women' },
    { label: 'NET', img: '/assets/landing/lehenga-1.jpg', link: '/products?category=Women' },
    { label: 'ORGANZA', img: '/assets/landing/salwar-4.jpg', link: '/products?category=Women' },
];

const CircularCategories = () => {
    return (
        <section className="bg-champagne border-b border-bronze/10 py-6 overflow-x-auto scrollbar-hide">
            <div className="container mx-auto max-w-7xl px-8 flex items-center justify-start lg:justify-center gap-8 md:gap-12 min-w-max">
                {categories.map((cat, idx) => (
                    <Link key={idx} to={cat.link} className="flex flex-col items-center gap-3 group">
                        <div className="w-[72px] h-[72px] md:w-[88px] md:h-[88px] rounded-full overflow-hidden border border-bronze/20 group-hover:border-gold transition-colors duration-300 shadow-sm relative">
                            <img
                                src={cat.img}
                                alt={cat.label}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-champagne/10 group-hover:bg-transparent transition-colors duration-300" />
                        </div>
                        <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.3em] text-bronze/70 group-hover:text-gold transition-colors text-center w-full">
                            {cat.label}
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default CircularCategories;
