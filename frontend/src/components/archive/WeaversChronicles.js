import React, { useRef } from 'react';
import { mediumHeadingClasses, containerPaddingClasses, sectionPaddingClasses } from '../../utils/responsiveText';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const WeaversChronicles = React.memo(() => {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  useScrollAnimation({
    ref: gridRef,
    from: { y: 60, opacity: 0 },
    to: { y: 0, opacity: 1 },
    duration: 1.2,
    ease: 'power3.out',
    contextRef: sectionRef
  });
  return (
    <section ref={sectionRef} className={`${sectionPaddingClasses} ${containerPaddingClasses} bg-champagne`}>
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 md:gap-12 mb-24 sm:mb-32 w-full">
          <h2 className={`${mediumHeadingClasses} font-editorial font-black text-bronze uppercase leading-[0.8]`}>
            THE ART OF<br /><span className="italic text-gold">FINE JEWELRY</span>
          </h2>
          <div className="max-w-xs mt-16 lg:mt-0">
            <p className="text-xs font-bold uppercase tracking-[0.5em] text-gold mb-8">{`//`} HERITAGE ARCHIVES</p>
            <p className="text-base font-medium leading-relaxed text-bronze/70">Exquisite Kundan, regal Polki, and masterfully crafted heirlooms designed to be passed down through generations.</p>
          </div>
        </div>
        <div ref={gridRef} className="grid grid-cols-12 gap-16 lg:gap-24">
          <div className="col-span-12 lg:col-span-7 space-y-12">
            <div className="rounded-[80px] overflow-hidden aspect-[16/10] relative group shadow-2xl border-[0.5px] border-[rgba(122,92,65,0.2)]">
              <img
                alt="Bridal Jewelry Craftsmanship"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                src="/assets/landing/jewelry-main.jpg"
                width="1200"
                height="750"
              />
              <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="flex items-center gap-12">
              <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-gold">Master Artisans</span>
              <div className="h-px flex-1 bg-gold/20"></div>
              <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-bronze/30">Timeless Elegance</span>
            </div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-editorial font-black uppercase leading-[0.9] text-bronze">THE HERITAGE COLLECTION</h3>
          </div>
          <div className="col-span-12 lg:col-span-5 space-y-24">
            <div className="flex gap-12 group cursor-pointer">
              <div className="size-44 shrink-0 rounded-[40px] overflow-hidden shadow-xl border-[0.5px] border-[rgba(122,92,65,0.2)] border-gold/10">
                <img
                  alt="Kundan Necklaces"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  src="/assets/landing/jewelry-kundan.jpg"
                  width="400"
                  height="400"
                />
              </div>
              <div className="space-y-4 pt-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-gold">Royal Kundan</p>
                <h4 className="text-2xl font-editorial font-bold uppercase leading-tight group-hover:text-gold transition-colors text-bronze">Intricate Gold Masterpieces</h4>
              </div>
            </div>
            <div className="flex gap-12 group cursor-pointer">
              <div className="size-44 shrink-0 rounded-[40px] overflow-hidden shadow-xl border-[0.5px] border-[rgba(122,92,65,0.2)] border-gold/10">
                <img
                  alt="Polki Earrings"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  src="/assets/landing/jewelry-polki.jpg"
                  width="400"
                  height="400"
                />
              </div>
              <div className="space-y-4 pt-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-gold">Uncut Diamonds</p>
                <h4 className="text-2xl font-editorial font-bold uppercase leading-tight group-hover:text-gold transition-colors text-bronze">The Polki Bridal Set</h4>
              </div>
            </div>
            <div className="flex gap-12 group cursor-pointer">
              <div className="size-44 shrink-0 rounded-[40px] overflow-hidden shadow-xl border-[0.5px] border-[rgba(122,92,65,0.2)] border-gold/10">
                <img
                  alt="Temple Jewelry"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  src="/assets/landing/jewelry-temple.jpg"
                  width="400"
                  height="400"
                />
              </div>
              <div className="space-y-4 pt-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-gold">Temple Archives</p>
                <h4 className="text-2xl font-editorial font-bold uppercase leading-tight group-hover:text-gold transition-colors text-bronze">South Indian Tradition</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

WeaversChronicles.displayName = 'WeaversChronicles';

export default WeaversChronicles;
