import React, { useMemo } from 'react';

const MarqueeBanner = React.memo(() => {
  // Memoize marquee content to prevent re-renders
  const marqueeContent = useMemo(() => (
    <>
      <span className="text-5xl lg:text-7xl font-editorial font-bold text-champagne uppercase tracking-tighter">
        HERITAGE SILKS
      </span>
      <span className="material-symbols-outlined text-gold text-4xl" aria-hidden="true">star</span>
      <span className="text-5xl lg:text-7xl font-editorial font-bold uppercase tracking-tighter text-stroke" style={{ WebkitTextStrokeColor: '#E1C699' }}>
        TIMELESS
      </span>
      <span className="material-symbols-outlined text-gold text-4xl" aria-hidden="true">star</span>
      <span className="text-5xl lg:text-7xl font-editorial font-bold text-champagne uppercase tracking-tighter">
        ETHNIC ARCHIVE
      </span>
      <span className="material-symbols-outlined text-gold text-4xl" aria-hidden="true">star</span>
    </>
  ), []);

  return (
    <div className="bg-bronze py-10 overflow-hidden border-y border-gold/20" aria-label="Heritage silks, timeless, ethnic archive">
      <div className="flex animate-marquee whitespace-nowrap items-center">
        <div className="flex items-center gap-24 mx-12">
          {marqueeContent}
        </div>
        <div className="flex items-center gap-24 mx-12" aria-hidden="true">
          {marqueeContent}
        </div>
      </div>
    </div>
  );
});

MarqueeBanner.displayName = 'MarqueeBanner';

export default MarqueeBanner;
