import React from 'react';

const Loading = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-champagne p-8 text-center transition-opacity duration-1000">
      {/* Morphing Logo Loader */}
      <div className="relative size-16 mb-8 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-t-2 border-gold animate-spin" style={{ animationDuration: '2s' }}></div>
        <div className="absolute inset-2 rounded-full border-r-2 border-bronze animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }}></div>
        <div className="absolute inset-4 bg-bronze/10 rounded-full animate-pulse"></div>
      </div>

      {/* Skeleton Text */}
      <div className="space-y-4 w-full max-w-sm mx-auto">
        <div className="h-4 bg-bronze/10 rounded-full w-24 mx-auto animate-pulse"></div>
        <div className="h-2 bg-bronze/5 rounded-full w-48 mx-auto animate-pulse" style={{ animationDelay: '150ms' }}></div>
      </div>
    </div>
  );
};

export default Loading;
