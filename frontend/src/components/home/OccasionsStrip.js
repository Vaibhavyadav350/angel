import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const occasions = [
  { 
    name: 'The Wedding Edit', 
    image: '/assets/landing/occ-wedding.jpg', 
    url: '/products?category=Women&subCategory=LEHENGAS', 
    subtitle: 'Bridal Lehengas & Sarees' 
  },
  { 
    name: 'Haldi & Mehendi', 
    image: '/assets/landing/occ-haldi.jpg', 
    url: '/products?category=Women&subCategory=SALWAR+KAMEEZ', 
    subtitle: 'Vibrant Traditions' 
  },
  { 
    name: 'Festive Season', 
    image: '/assets/landing/occ-evening.jpg', 
    url: '/products?category=Women&subCategory=SAREES', 
    subtitle: 'Contemporary Elegance' 
  },
  { 
    name: 'Mens Heritage', 
    image: '/assets/landing/occ-mens.jpg', 
    url: '/products?category=Men&subCategory=SHERWANIS', 
    subtitle: 'Classic Sherwanis' 
  }
];

const OccasionsStrip = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="bg-transparent py-16 md:py-24 pt-10 md:pt-24 overflow-hidden relative">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-[#C5A059] text-[10px] tracking-[0.5em] uppercase font-bold mb-4">Celebration Edits</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-editorial font-bold text-[#3D2B1F] leading-tight uppercase tracking-tighter text-center">
            Shop by <span className="text-[#C5A059] italic font-light">Occasion</span>
          </h2>
        </div>
        
        {/* Interactive Accordion Animation */}
        <div className="flex flex-col lg:flex-row h-[550px] lg:h-[480px] w-full gap-4 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]">
          {occasions.map((occ, idx) => {
            const isActive = activeIndex === idx;

            return (
              <Link
                to={occ.url}
                key={idx}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`relative group overflow-hidden rounded-[40px] shadow-2xl transition-all duration-700 ease-out cursor-pointer ${
                  isActive ? 'lg:flex-[4] h-[350px] lg:h-full' : 'lg:flex-[1] h-[100px] lg:h-full'
                }`}
              >
                <img
                  src={occ.image}
                  alt={occ.name}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
                    isActive ? 'scale-105 brightness-90' : 'scale-100 grayscale-[20%] brightness-75'
                  }`}
                />

                {/* Dynamic Gradient Overlay */}
                <div className={`absolute inset-0 transition-opacity duration-700 ${
                  isActive ? 'bg-gradient-to-t from-[#3D2B1F]/90 via-transparent to-transparent opacity-80' : 'bg-black/30'
                }`} />

                {/* Content */}
                <div className="absolute inset-0 p-8 lg:p-12 flex flex-col justify-end h-full">
                  {/* Vertical Text for Inactive Items (Desktop) */}
                  <div className={`hidden lg:flex absolute inset-0 items-center justify-center transition-opacity duration-700 ${
                    isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  }`}>
                    <h3 className="text-2xl font-editorial font-bold text-white whitespace-nowrap -rotate-90 uppercase tracking-[0.4em]">
                      {occ.name}
                    </h3>
                  </div>

                  {/* Active State Details */}
                  <div className={`transition-all duration-700 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-[1px] w-12 bg-[#C5A059]/60"></div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">{`0${idx + 1}`}</span>
                    </div>
                    <h3 className="text-3xl lg:text-5xl font-editorial font-black text-white uppercase leading-[0.9] mb-4">
                      {occ.name}
                    </h3>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/70">
                      {occ.subtitle}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OccasionsStrip;
