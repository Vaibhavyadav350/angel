import React from 'react';

function PreLoader() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-champagne font-body gap-6">
      <div className="flex flex-col items-center">
        <span className="font-editorial text-3xl font-black text-bronze uppercase tracking-[0.15em] leading-none">
          Angel
        </span>
        <span className="text-[8px] font-bold uppercase tracking-[0.6em] text-gold mt-1">
          Archive
        </span>
      </div>
      {/* Animated loading bar */}
      <div className="w-40 h-0.5 bg-bronze/10 rounded-full overflow-hidden">
        <div className="h-full bg-gold rounded-full animate-pulse" style={{ width: '60%' }} />
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-bronze/30">
        Loading...
      </p>
    </div>
  );
}

export default PreLoader;
