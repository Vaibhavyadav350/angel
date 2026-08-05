import React from 'react';
import { Link } from 'react-router-dom';
import taxonomy from '../../utils/taxonomy.json';

const categories = [
    { label: 'A-LINE', img: '/assets/landing/circ-aline.jpg', link: `/products${taxonomy.landing_page_mappings?.circular_aline || ''}` },
    { label: 'FISHTAIL', img: '/assets/landing/circ-fishtail.jpg', link: `/products${taxonomy.landing_page_mappings?.circular_fishtail || ''}` },
    { label: 'BANARASI', img: '/assets/landing/circ-banarasi.jpg', link: `/products${taxonomy.landing_page_mappings?.circular_banarasi || ''}` },
    { label: 'SILK', img: '/assets/landing/circ-silk.jpg', link: `/products${taxonomy.landing_page_mappings?.circular_silk || ''}` },
    { label: 'VELVET', img: '/assets/landing/circ-velvet.jpg', link: `/products${taxonomy.landing_page_mappings?.circular_velvet || ''}` },
    { label: 'GEORGETTE', img: '/assets/landing/circ-georgette.jpg', link: `/products${taxonomy.landing_page_mappings?.circular_georgette || ''}` },
    { label: 'NET', img: '/assets/landing/circ-net.jpg', link: `/products${taxonomy.landing_page_mappings?.circular_net || ''}` },
    { label: 'ORGANZA', img: '/assets/landing/circ-organza.jpg', link: `/products${taxonomy.landing_page_mappings?.circular_organza || ''}` },
];

const CircularCategories = () => {
    return (
        <section className="bg-white border-b border-[#F0E8DF] py-8 overflow-x-auto scrollbar-hide">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex items-center justify-start lg:justify-center gap-8 md:gap-16 min-w-max">
                {categories.map((cat, idx) => (
                    <Link key={idx} to={cat.link} className="flex flex-col items-center gap-3 group shrink-0">
                        <div className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full overflow-hidden border border-[#D4C5B5] group-hover:border-[#C5A059] transition-all duration-500 shadow-sm relative">
                            <img
                                src={cat.img}
                                alt={cat.label}
                                className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3D2B1F]/70 group-hover:text-[#C5A059] transition-colors text-center w-full">
                            {cat.label}
                        </span>
                    </Link>
                ))}
            </div>
            <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
        </section>
    );
};

export default CircularCategories;
