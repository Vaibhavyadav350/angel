import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { heroTitleClasses, containerPaddingClasses } from '../../utils/responsiveText';
import { useProductsContext } from '../../context/products_context';

const Hero = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const circleRef = useRef(null);
  const { products_loading: loading, products_error: error, featured_products } = useProductsContext();

  // Fallback image if no products
  const defaultImage = "/assets/archive/hero_main.jpg";
  const heroImage = featured_products.length > 0 ? featured_products[0].image : defaultImage;

  useEffect(() => {
    // GSAP animations - optimized with will-change
    if (titleRef.current && circleRef.current) {
      // Set will-change for better performance
      titleRef.current.style.willChange = 'transform, opacity';
      circleRef.current.style.willChange = 'transform, opacity';

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.fromTo(
          titleRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
          }
        ).fromTo(
          circleRef.current,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.5,
            delay: 0.3,
          },
          '-=0.5'
        );

        // Clean up will-change after animation
        const titleEl = titleRef.current;
        const circleEl = circleRef.current;
        tl.eventCallback('onComplete', () => {
          if (titleEl) titleEl.style.willChange = 'auto';
          if (circleEl) circleEl.style.willChange = 'auto';
        });
      }, heroRef);

      return () => {
        const titleEl = titleRef.current;
        const circleEl = circleRef.current;
        ctx.revert();
        if (titleEl) titleEl.style.willChange = 'auto';
        if (circleEl) circleEl.style.willChange = 'auto';
      };
    }
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,_#FFFFFF_0%,_#F7E7CE_100%)]"
    >
      <div className={`container mx-auto ${containerPaddingClasses} relative pt-32 lg:pt-48`}>
        <div className="relative z-10 w-full text-center mt-8">
          <h2
            ref={titleRef}
            className={`${heroTitleClasses} font-editorial font-black leading-[0.8] text-bronze tracking-tighter uppercase mb-[-3vw]`}
            style={{ wordBreak: 'keep-all', hyphens: 'none' }}
          >
            ANGEL
            <br />
            ARCHIVE
          </h2>

          <div className="flex flex-col lg:flex-row justify-center items-center gap-12 lg:gap-32 mt-16 relative">
            {/* Left Side Description - Hidden on mobile */}
            <div className="hidden lg:block w-64 text-left space-y-6 order-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold">
                Bridal Archive 2024
              </p>
              <p className="text-[14px] font-medium leading-relaxed text-bronze/70 italic">
                A sun-drenched architectural study of luxury bridal couture. High-fashion silhouettes reimagined through an archival lens.
              </p>
            </div>

            {/* Center Image - FULL BODY, PERFECT CIRCLE */}
            <div
              ref={circleRef}
              className="relative w-[80vw] sm:w-[70vw] md:w-[60vw] lg:w-[32vw] aspect-square z-20 order-2 max-w-[500px] lg:max-w-none"
            >
              <div className="absolute inset-0 rounded-full overflow-hidden border-[1px] border-gold/20 shadow-[0_20px_50px_rgba(197,160,89,0.15)] bg-bronze/10">
                <img
                  alt="High-fashion editorial full-length shot of a model wearing a luxury bridal Lehenga"
                  className="w-full h-full object-cover brightness-105 hover:scale-105 transition-transform duration-[3000ms]"
                  src={heroImage}
                  loading="eager"
                  fetchpriority="high"
                  width="600"
                  height="750"
                />
              </div>

              {/* Barcode Label */}
              <div className="absolute -left-20 bottom-32 bg-white/40 backdrop-blur-xl p-5 border fine-line border-gold/10 rotate-[-4deg] hidden lg:block">
                <div className="flex flex-col items-start gap-1">
                  <span className="font-barcode text-5xl leading-none text-bronze/60">CHAMP-88</span>
                  <span className="text-[9px] font-bold tracking-widest uppercase text-gold">
                    EST. 1994 // BRIDAL
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side Stats - Hidden on mobile */}
            <div className="hidden lg:flex flex-col gap-16 text-right order-3 w-64">
              <div>
                <p className="text-7xl font-editorial font-black text-gold/80">100%</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] mt-2 text-bronze/50">
                  Hand-Spun Gold Zari
                </p>
              </div>
              <div>
                <p className="text-7xl font-editorial font-black text-bronze/90">{new Date().getFullYear()}</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] mt-2 text-bronze/50">
                  The Heritage Collection
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="mt-20">
        <span className="material-symbols-outlined animate-bounce text-gold/40 text-4xl font-light" aria-hidden="true">
          keyboard_double_arrow_down
        </span>
      </div>
    </section>
  );
};

export default Hero;
