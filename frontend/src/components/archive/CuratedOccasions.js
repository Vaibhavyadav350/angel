import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { SectionContainer } from './shared';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const occasions = [
    {
        title: "The Wedding Edit",
        subtitle: "Bridal Lehengas & Heavy Sarees",
        img: "/assets/landing/lehenga-3.jpg",
        link: "/products?category=Women",
    },
    {
        title: "Haldi & Mehendi",
        subtitle: "Vibrant Yellows & Greens",
        img: "/assets/landing/salwar-2.jpg",
        link: "/products?category=Women",
    },
    {
        title: "Evening Soirée",
        subtitle: "Contemporary Gowns & Drape Sarees",
        img: "/assets/landing/lehenga-2.jpg",
        link: "/products?category=Women",
    },
    {
        title: "Mens Heritage",
        subtitle: "Classic Sherwanis & Kurtas",
        img: "/assets/landing/hero-men.jpg",
        link: "/products?category=Men",
    }
];

const CuratedOccasions = () => {
    const sectionRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useScrollAnimation({
        ref: sectionRef,
        from: { y: 60, opacity: 0 },
        to: { y: 0, opacity: 1 },
        duration: 1.2,
        ease: 'power3.out',
    });

    return (
        <SectionContainer ref={sectionRef} bgColor="bg-champagne" className="border-t border-bronze/10 py-24 lg:py-40">
            <div className="container mx-auto px-4 lg:px-12 max-w-[1600px]">
                {/* Header */}
                <div className="text-center mb-16 lg:mb-24 flex flex-col items-center">
                    <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-gold block mb-6">
                        Curated Guide
                    </span>
                    <h2 className="text-5xl md:text-6xl lg:text-[6rem] font-editorial font-black text-bronze uppercase leading-none tracking-tighter">
                        Shop By <span className="text-gold italic font-light">Occasion</span>
                    </h2>
                </div>

                {/* Premium Interactive Accordion */}
                <div className="flex flex-col lg:flex-row h-[800px] lg:h-[700px] w-full gap-4 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]">
                    {occasions.map((occ, idx) => {
                        const isActive = activeIndex === idx;

                        return (
                            <Link
                                to={occ.link}
                                key={idx}
                                onMouseEnter={() => setActiveIndex(idx)}
                                className={`relative group overflow-hidden rounded-[40px] shadow-2xl transition-all duration-700 ease-out cursor-pointer ${isActive ? 'lg:flex-[4] h-[400px] lg:h-full' : 'lg:flex-[1] h-[120px] lg:h-full'
                                    }`}
                            >
                                <img
                                    src={occ.img}
                                    alt={occ.title}
                                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${isActive ? 'scale-105 filter-none' : 'scale-100 grayscale-[30%] brightness-75'}`}
                                />

                                {/* Dynamic Gradient Overlay */}
                                <div className={`absolute inset-0 transition-opacity duration-700 ${isActive ? 'bg-gradient-to-t from-chocolate/90 via-chocolate/20 to-transparent opacity-80' : 'bg-black/40'}`}></div>

                                {/* Content */}
                                <div className={`absolute bottom-0 left-0 right-0 p-8 lg:p-12 transition-all duration-700 ease-out flex flex-col justify-end h-full ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 lg:opacity-100 lg:translate-y-8'}`}>
                                    {/* Vertical/Rotated Text for Inactive Items (Desktop only) */}
                                    <div className={`hidden lg:flex absolute inset-0 items-center justify-center transition-opacity duration-700 ${isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                                        <h3 className="text-3xl font-editorial font-bold text-champagne whitespace-nowrap -rotate-90 uppercase tracking-widest">
                                            {occ.title}
                                        </h3>
                                    </div>

                                    {/* Active State Details */}
                                    <div className={`transition-all duration-1000 delay-100 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="h-[1px] w-12 bg-gold/60"></div>
                                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold">{`0${idx + 1}`}</span>
                                        </div>
                                        <h3 className="text-4xl lg:text-5xl font-editorial font-black text-champagne uppercase leading-[0.9] drop-shadow-2xl mb-4">
                                            {occ.title}
                                        </h3>
                                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-champagne/70 drop-shadow-md flex items-center gap-4">
                                            {occ.subtitle}
                                            <span className="material-symbols-outlined text-sm text-gold">east</span>
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </SectionContainer>
    );
};

export default CuratedOccasions;
