import React from 'react';
import { Link } from 'react-router-dom';
import taxonomy from '../../utils/taxonomy.json';

// Placeholder elegant texture/fabric images for categories
const categories = [
    { label: 'A-LINE', img: '/assets/landing/circ-aline.jpg', link: `/products${taxonomy.landing_page_mappings.circular_lehenga}` },
    { label: 'FISHTAIL', img: '/assets/landing/circ-fishtail.jpg', link: `/products${taxonomy.landing_page_mappings.circular_anarkali}` },
    { label: 'BANARASI', img: '/assets/landing/circ-banarasi.jpg', link: `/products${taxonomy.landing_page_mappings.circular_saree}` },
    { label: 'SILK', img: '/assets/landing/circ-silk.jpg', link: `/products${taxonomy.landing_page_mappings.circular_women}` },
    { label: 'VELVET', img: '/assets/landing/circ-velvet.jpg', link: `/products${taxonomy.landing_page_mappings.circular_women}` },
    { label: 'GEORGETTE', img: '/assets/landing/circ-georgette.jpg', link: `/products${taxonomy.landing_page_mappings.circular_women}` },
    { label: 'NET', img: '/assets/landing/circ-net.jpg', link: `/products${taxonomy.landing_page_mappings.circular_women}` },
    { label: 'ORGANZA', img: '/assets/landing/circ-organza.jpg', link: `/products${taxonomy.landing_page_mappings.circular_women}` },
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
