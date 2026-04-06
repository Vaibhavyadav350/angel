import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
    {
        label: 'BRIDAL LEHENGAS',
        sublabel: 'Wedding Trousseau',
        url: '/products?category=Women&subCategory=Lehengas',
        image: '/assets/landing/cat-lehenga.jpg',
    },
    {
        label: 'PURE SILK SAREES',
        sublabel: 'Heritage & Editorial',
        url: '/products?category=Women&subCategory=Sarees',
        image: '/assets/landing/cat-saree.jpg',
    },
    {
        label: 'SHERWANIS',
        sublabel: 'Menswear Heritage',
        url: '/products?category=Men&subCategory=Sherwanis',
        image: '/assets/landing/cat-sherwani.jpg',
    },
    {
        label: 'ANARKALI SUITS',
        sublabel: 'Festive & Celebration',
        url: '/products?category=Women&subCategory=Salwar Kameez',
        image: '/assets/landing/cat-anarkali.jpg',
    },
    {
        label: 'JEWELLERY',
        sublabel: 'Bridal & Occasional',
        url: '/products?category=Jewelry',
        image: '/assets/landing/cat-jewelry.jpg',
    },
    {
        label: 'KIDS',
        sublabel: 'Little Royals',
        url: '/products?category=Kids',
        image: '/assets/landing/cat-kids.jpg',
    },
];

const CategoryDirectory = () => {
    return (
        <section className="py-32 px-8 lg:px-24 bg-champagne">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="text-center mb-20">
                    <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-gold block mb-6">
                        Explore Our World
                    </span>
                    <h2 className="text-5xl lg:text-8xl font-editorial font-black text-bronze uppercase leading-none tracking-tighter">
                        The Directory
                    </h2>
                </div>

                {/* Category Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {categories.map((cat, idx) => (
                        <Link
                            key={idx}
                            to={cat.url}
                            className="group flex flex-col items-center gap-4 cursor-pointer"
                        >
                            {/* Arched Image Frame */}
                            <div
                                className="relative w-full overflow-hidden border border-gold/20 shadow-md group-hover:shadow-xl group-hover:border-gold/50 transition-all duration-700"
                                style={{
                                    borderRadius: '200px 200px 40px 40px',
                                    aspectRatio: '3/4',
                                }}
                            >
                                <img
                                    src={cat.image}
                                    alt={cat.label}
                                    className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-chocolate/20 group-hover:bg-chocolate/10 transition-colors duration-700" />
                            </div>

                            {/* Label */}
                            <div className="text-center space-y-1">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-bronze group-hover:text-gold transition-colors duration-300">
                                    {cat.label}
                                </h3>
                                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-bronze/40">
                                    {cat.sublabel}
                                </p>
                                <div className="h-px w-8 bg-gold/0 group-hover:bg-gold/60 mx-auto transition-all duration-500" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryDirectory;
