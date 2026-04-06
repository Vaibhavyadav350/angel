import React, { useRef } from 'react';
import { largeHeadingClasses, containerPaddingClasses, sectionPaddingClasses } from '../../utils/responsiveText';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const EleganceSection = React.memo(() => {
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
    from: { opacity: 0, scale: 0.9 },
    to: { opacity: 1, scale: 1 },
    duration: 1.5,
    ease: 'power2.out',
    contextRef: sectionRef
  });
  return (
    <section ref={sectionRef} className={`w-full bg-bronze ${sectionPaddingClasses} overflow-hidden relative`}>
      <div className={`container mx-auto ${containerPaddingClasses} flex flex-col lg:flex-row items-center justify-between gap-16 sm:gap-24 lg:gap-40`}>
        <div ref={contentRef} className="w-full lg:w-1/2 flex flex-col justify-center space-y-12 sm:space-y-16 lg:space-y-20 relative z-10">
          <h2
            className={`${largeHeadingClasses} font-editorial font-black text-champagne uppercase leading-[0.8] tracking-tighter`}
            style={{
              wordBreak: 'keep-all',
              whiteSpace: 'pre-line',
              overflowWrap: 'normal',
              hyphens: 'none'
            }}
          >
            Elegance<br /><span className="text-gold">In&nbsp;Every</span><br />Thread
          </h2>
          <p className="text-base font-bold uppercase tracking-[0.4em] text-champagne/40 max-w-md leading-relaxed">
            A collection curated for the connoisseur. Harmonizing traditional gold embroidery with modern architectural silhouettes for the contemporary gentleman.
          </p>
          <div className="flex items-center gap-10">
            <div className="h-px w-40 bg-gold"></div>
            <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-gold">Archival Edition 2024</span>
          </div>
        </div>
        <div ref={imageRef} className="w-full lg:w-1/2 flex justify-center lg:justify-end relative">
          <div className="relative w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] xl:w-[700px] xl:h-[700px]">
            <div className="w-full h-full rounded-full overflow-hidden bg-bronze relative z-10 border-[1px] border-gold/30 shadow-[0_40px_80px_rgba(0,0,0,0.3)]">
              <img
                alt="High-contrast portrait of a male model wearing a premium gold-toned designer ethnic Kurta"
                loading="lazy"
                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-[2000ms] brightness-110"
                src="/assets/archive/elegance_male.jpg"
                width="700"
                height="700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bronze/60 to-transparent"></div>
            </div>
            <div className="absolute -top-12 -right-12 lg:-top-20 lg:-right-20 z-20 animate-rotate">
              <svg className="size-56 lg:size-80" viewBox="0 0 100 100">
                <path d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" id="eleganceCirclePath"></path>
                <text className="text-[10px] font-bold uppercase fill-gold tracking-[0.45em]">
                  <textPath xlinkHref="#eleganceCirclePath">ARCHIVE 2024 • THE GOLDEN ERA • </textPath>
                </text>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-gold text-5xl font-light">stars</span>
              </div>
            </div>
            <div className="absolute -bottom-16 -left-16 w-[120%] h-[120%] rounded-full border border-gold/10 -z-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
});

EleganceSection.displayName = 'EleganceSection';

export default EleganceSection;
