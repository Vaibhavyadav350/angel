import React from 'react';
import { Link } from 'react-router-dom';

const SaleBanner = () => {
  return (
    <section className="w-full py-12 md:py-20">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-[220px] md:h-[260px]">
        <div className="bg-[#6B3E2A] rounded-3xl overflow-hidden flex h-full items-stretch relative shadow-2xl">
          
          {/* Left: Text Content (60%) */}
          <div className="flex-[1.5] p-6 md:p-12 flex flex-col justify-center z-10">
            <p className="text-[#C5A059] text-[9px] md:text-[11px] tracking-[0.4em] font-bold uppercase mb-2">Limited Time Only</p>
            <h2 className="text-white text-2xl md:text-5xl font-serif mb-6 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              The Grand Finale <br className="hidden sm:block" /> 
              <span className="text-[#C5A059]">Up to 40% Off</span>
            </h2>
            <div>
              <Link 
                to="/products?collection=sale" 
                className="inline-block border-2 border-[#C5A059] text-[#C5A059] px-8 py-2.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#C5A059] hover:text-white transition-all shadow-lg"
              >
                Shop the Sale
              </Link>
            </div>
          </div>

          {/* Right: Image (40%) */}
          <div className="flex-1 relative hidden md:block">
            <img 
              src="/assets/landing/hero_slide_2.jpg" 
              alt="Sale Event" 
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay to blend */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#6B3E2A] via-[#6B3E2A]/20 to-transparent" />
          </div>

          {/* Background Decorative Text */}
          <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none select-none">
            <span className="text-[180px] font-serif text-white italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>%</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SaleBanner;
