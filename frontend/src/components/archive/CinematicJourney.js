import React, { useRef } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { cinematicHeadingClasses } from '../../utils/responsiveText';

/**
 * CinematicJourney - Full-screen cinematic section with video/image
 * Shows "HERITAGE IN MOTION" with play/pause button
 */
const CinematicJourney = React.memo(() => {
  const sectionRef = useRef(null);

  // Use DRY scroll animation hook
  useScrollAnimation({
    ref: sectionRef,
    from: { y: 20 },
    to: { y: 0 },
    duration: 1,
    ease: 'power2.out',
  });

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[600px] sm:min-h-[700px] md:h-[80vh] lg:h-[90vh] bg-chocolate overflow-hidden flex items-center justify-center"
    >
      {/* Background Image - Fixed opacity (0.60) - no resize issues */}
      <div className="absolute inset-0 w-full h-full">
        <img
          alt="Model in lehenga walking through a royal corridor"
          className="w-full h-full object-cover"
          style={{ opacity: 0.6 }}
          src="/assets/landing/cinematic.jpg"
          loading="lazy"
          width="1920"
          height="1080"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-chocolate/20 to-chocolate/80" aria-hidden="true"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6">
        <span className="text-gold text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.8em] mb-4 sm:mb-6 block">
          CINEMATIC JOURNEY
        </span>
        <h2 className={`${cinematicHeadingClasses} font-editorial font-black text-champagne uppercase tracking-tighter mb-8 sm:mb-12 leading-[0.8]`}>
          HERITAGE
          <br />
          <span className="italic font-light">IN MOTION</span>
        </h2>
        <div className="flex items-center justify-center gap-6">
          <button
            className="size-20 rounded-full border border-champagne/30 flex items-center justify-center text-champagne hover:bg-champagne hover:text-chocolate transition-all duration-500 min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-champagne focus:ring-offset-2"
            aria-label="Pause video"
          >
            <span className="material-symbols-outlined text-4xl fill-1" aria-hidden="true">
              pause
            </span>
          </button>
        </div>
      </div>

      {/* Bottom Subtitle */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <div className="h-px w-24 bg-champagne/20" aria-hidden="true"></div>
        <span className="text-[9px] font-bold tracking-[0.5em] text-champagne/40">
          THE ROYAL CORRIDOR STUDY
        </span>
        <div className="h-px w-24 bg-champagne/20" aria-hidden="true"></div>
      </div>
    </section>
  );
});

CinematicJourney.displayName = 'CinematicJourney';

export default CinematicJourney;
