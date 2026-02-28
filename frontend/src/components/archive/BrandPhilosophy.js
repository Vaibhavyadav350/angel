import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useMultipleScrollAnimations } from '../../hooks/useScrollAnimation';
import { OptimizedImage } from './shared';
import { SectionContainer } from './shared';
import { largeHeadingClasses, containerPaddingClasses, sectionPaddingClasses } from '../../utils/responsiveText';

const BrandPhilosophy = React.memo(() => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const imageRef = useRef(null);

  // Use DRY multiple animations hook
  useMultipleScrollAnimations(
    [
      {
        ref: titleRef,
        from: { y: 80 },
        to: { y: 0 },
        duration: 1,
      },
      {
        ref: imageRef,
        from: { scale: 0.95 },
        to: { scale: 1 },
        duration: 1.2,
      },
    ],
    sectionRef
  );

  return (
    <SectionContainer ref={sectionRef} className={`${sectionPaddingClasses} bg-white/20`} paddingX={false} maxWidth={false}>
      <div className={`container mx-auto ${containerPaddingClasses}`}>
        <div className="flex flex-col lg:flex-row items-center gap-16 sm:gap-24 lg:gap-40">
          <div className="w-full lg:w-1/2 relative space-y-12 sm:space-y-16">
            <h3
              ref={titleRef}
              className={`${largeHeadingClasses} font-editorial font-black leading-[0.8] text-bronze uppercase`}
              style={{
                wordBreak: 'keep-all',
                whiteSpace: 'pre-line',
                overflowWrap: 'normal',
                hyphens: 'none'
              }}
            >
              LIVE <br /> BOLDLY<br /><span className="text-gold">DRESS</span><br />BRAVELY
            </h3>
            <div className="max-w-md">
              <p className="text-lg font-medium leading-relaxed text-bronze/70 mb-12">
                Our philosophy centers on 'Quiet Luxury'—the art of being noticed without needing to shout. Every textured drape of our designer sarees tells a story of modern sovereignty.
              </p>
              <div className="inline-flex items-center gap-8 group cursor-pointer">
                <div className="size-16 rounded-full border border-gold/40 flex items-center justify-center group-hover:bg-gold group-hover:text-champagne transition-all duration-700">
                  <span className="material-symbols-outlined">arrow_forward</span>
                </div>
                <Link
                  to="/products"
                  className="text-xs font-bold uppercase tracking-[0.4em] text-gold focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 rounded-sm"
                  aria-label="Discover our philosophy"
                >
                  Discover Our Philosophy
                </Link>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 relative" ref={imageRef}>
            <div className="rounded-[40px] sm:rounded-[50px] overflow-hidden aspect-[4/5] border-[1px] border-gold/20 shadow-[0_30px_60px_rgba(122,92,65,0.1)] relative">
              <OptimizedImage
                src="/assets/archive/brand_philosophy.jpg"
                alt="High-end editorial photograph of a model wearing a premium textured designer Saree"
                className="w-full h-full object-cover object-center"
                width={600}
                height={750}
              />
              <div className="absolute bottom-16 right-16 size-32 animate-rotate bg-white/20 backdrop-blur-md rounded-full border border-white/40">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <path d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent" id="playPath"></path>
                  <text className="text-[10px] font-bold uppercase fill-bronze tracking-[0.3em]">
                    <textPath xlinkHref="#playPath">THE FILM • THE FILM • </textPath>
                  </text>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-bronze text-4xl fill-1">play_arrow</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
});

BrandPhilosophy.displayName = 'BrandPhilosophy';

export default BrandPhilosophy;
