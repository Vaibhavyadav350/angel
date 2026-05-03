import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { OptimizedImage } from './shared';

const BrandPhilosophy = React.memo(() => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const imageRef = useRef(null);

  useScrollAnimation({
    ref: contentRef,
    from: { y: 60, opacity: 0 },
    to: { y: 0, opacity: 1 },
    duration: 1.2,
    ease: 'power3.out',
    contextRef: sectionRef
  });

  useScrollAnimation({
    ref: imageRef,
    from: { x: 40, opacity: 0 },
    to: { x: 0, opacity: 1 },
    duration: 1.5,
    ease: 'power2.out',
    contextRef: sectionRef
  });

  return (
    <section ref={sectionRef} className="relative w-full bg-bronze text-champagne pt-24 lg:pt-32 pb-0 overflow-hidden">
      {/* Massive Background Text */}
      <div className="absolute top-10 left-0 w-full flex justify-center whitespace-nowrap opacity-[0.04] select-none pointer-events-none z-0">
        <h2 className="text-[18vw] font-editorial font-black leading-none uppercase tracking-tighter">FESTIVE ARCHIVE</h2>
      </div>

      <div className="max-w-[1600px] mx-auto w-full px-4 sm:px-8 lg:px-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-0 relative z-10">

        {/* Left Text Block - Tightly packed */}
        <div
          className="w-full lg:w-5/12 flex flex-col justify-center pb-16 lg:pb-32 lg:pr-16"
          ref={contentRef}
        >
          <div className="flex items-center gap-6 mb-8 group">
            <div className="h-[1px] w-12 bg-gold/50 group-hover:w-24 transition-all duration-700"></div>
            <p className="text-gold text-[10px] font-bold uppercase tracking-[0.5em]">Global Heritage</p>
          </div>

          <h3 className="text-5xl sm:text-7xl lg:text-[6rem] font-editorial font-black leading-[0.8] uppercase mb-10 text-champagne tracking-tighter">
            THE<br />
            FESTIVE<br />
            <span className="italic text-gold font-light">ARCHIVE</span>
          </h3>

          <p className="text-lg leading-relaxed text-champagne/70 max-w-md mb-12">
            Meticulously crafted masterpieces bridging traditional zardozi with contemporary silhouettes. Step into the season with unmatched elegance and bespoke craftsmanship.
          </p>

          <Link
            to="/products?collection=Festive"
            className="inline-flex items-center gap-6 group w-max"
            aria-label="Explore The Archive"
          >
            <div className="size-16 rounded-full border border-gold/40 flex items-center justify-center group-hover:bg-gold group-hover:border-gold transition-all duration-700 shadow-lg">
              <span className="material-symbols-outlined text-gold group-hover:text-bronze">east</span>
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-gold group-hover:text-champagne transition-colors">
              Explore The Collection
            </span>
          </Link>
        </div>

        {/* Right Image Block - Overlapping, edge-to-edge on right */}
        <div className="w-full lg:w-7/12 relative" ref={imageRef}>
          <div className="relative w-full h-[600px] sm:h-[700px] lg:h-[850px] rounded-t-[40px] sm:rounded-t-[60px] lg:rounded-tr-none lg:rounded-tl-[80px] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border-[1px] border-gold/20 border-b-0">
            <OptimizedImage
              src="/assets/landing/festive-hero.jpg"
              alt="Model wearing festive designer outfit"
              className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-[3000ms]"
              width={1000}
              height={1000}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bronze via-transparent to-transparent opacity-80"></div>

            {/* Elegant Floating Badge */}
            <div className="absolute bottom-12 left-8 lg:bottom-20 lg:left-12 bg-bronze/40 backdrop-blur-md border border-gold/20 p-6 rounded-2xl max-w-[260px] transform hover:-translate-y-2 transition-transform duration-500">
              <span className="material-symbols-outlined text-gold mb-3 text-3xl">auto_awesome</span>
              <p className="text-[10px] text-gold font-bold uppercase tracking-widest mb-2">Signature Series</p>
              <p className="text-sm font-medium leading-relaxed text-champagne/90">Hand-embroidered Shararas and Anarkalis engineered for grandeur.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
});

BrandPhilosophy.displayName = 'BrandPhilosophy';

export default BrandPhilosophy;
