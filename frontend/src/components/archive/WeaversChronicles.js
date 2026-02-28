import React from 'react';
import { mediumHeadingClasses, containerPaddingClasses, sectionPaddingClasses } from '../../utils/responsiveText';

const WeaversChronicles = React.memo(() => {
  return (
    <section className={`${sectionPaddingClasses} ${containerPaddingClasses} bg-champagne`}>
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 md:gap-12 mb-24 sm:mb-32 w-full">
          <h2 className={`${mediumHeadingClasses} font-editorial font-black text-bronze uppercase leading-[0.8]`}>
            THE WEAVER'S<br /><span className="italic text-gold">CHRONICLES</span>
          </h2>
          <div className="max-w-xs mt-16 lg:mt-0">
            <p className="text-xs font-bold uppercase tracking-[0.5em] text-gold mb-8">// MATERIALITY RESEARCH</p>
            <p className="text-base font-medium leading-relaxed text-bronze/70">A study on gold-thread embroidery and the tactile soul of ancestral silk and velvet textiles.</p>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-16 lg:gap-24">
          <div className="col-span-12 lg:col-span-7 space-y-12">
            <div className="rounded-[80px] overflow-hidden aspect-[16/10] relative group shadow-2xl border-[0.5px] border-[rgba(122,92,65,0.2)]">
              <img
                alt="Gold Thread Zari Embroidery Close-up"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                src="/assets/archive/texture_gold_zari.jpg"
                width="1200"
                height="750"
              />
              <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="flex items-center gap-12">
              <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-gold">Archive Entry 042</span>
              <div className="h-px flex-1 bg-gold/20"></div>
              <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-bronze/30">A/W 2024.08</span>
            </div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-editorial font-black uppercase leading-[0.9] text-bronze">THE TACTILE LANGUAGE OF GOLD THREAD</h3>
          </div>
          <div className="col-span-12 lg:col-span-5 space-y-24">
            <div className="flex gap-12 group cursor-pointer">
              <div className="size-44 shrink-0 rounded-[40px] overflow-hidden shadow-xl border-[0.5px] border-[rgba(122,92,65,0.2)] border-gold/10">
                <img
                  alt="Hand-woven Silk Material Texture"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  src="/assets/archive/texture_silk.jpg"
                  width="400"
                  height="400"
                />
              </div>
              <div className="space-y-4 pt-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-gold">Artisanship</p>
                <h4 className="text-2xl font-editorial font-bold uppercase leading-tight group-hover:text-gold transition-colors text-bronze">Banarasi Silk: The Soul of the Weave</h4>
              </div>
            </div>
            <div className="flex gap-12 group cursor-pointer">
              <div className="size-44 shrink-0 rounded-[40px] overflow-hidden shadow-xl border-[0.5px] border-[rgba(122,92,65,0.2)] border-gold/10">
                <img
                  alt="Deep Crimson Velvet Close-up Material"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  src="/assets/archive/texture_velvet.jpg"
                  width="400"
                  height="400"
                />
              </div>
              <div className="space-y-4 pt-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-gold">Materiality</p>
                <h4 className="text-2xl font-editorial font-bold uppercase leading-tight group-hover:text-gold transition-colors text-bronze">Royal Velvet &amp; Modern Rituals</h4>
              </div>
            </div>
            <div className="flex gap-12 group cursor-pointer">
              <div className="size-44 shrink-0 rounded-[40px] overflow-hidden shadow-xl border-[0.5px] border-[rgba(122,92,65,0.2)] border-gold/10">
                <img
                  alt="Raw Silk Detail Texture"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  src="/assets/archive/texture_raw_silk.jpg"
                  width="400"
                  height="400"
                />
              </div>
              <div className="space-y-4 pt-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-gold">Sustainability</p>
                <h4 className="text-2xl font-editorial font-bold uppercase leading-tight group-hover:text-gold transition-colors text-bronze">Raw Silks: A Sustainable Legacy</h4>
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
