import React from 'react';

const SectionHeading = ({ title, subtitle, className = "" }) => {
  // Split title to dynamically render the last word in gold italics
  const titleParts = title.split(' ');
  const firstPart = titleParts.slice(0, -1).join(' ');
  const lastPart = titleParts[titleParts.length - 1];

  return (
    <div className={`max-w-2xl ${className}`}>
      {subtitle && (
        <p className="text-[#C5A059] text-[10px] tracking-[0.5em] uppercase font-bold mb-4">
          {subtitle}
        </p>
      )}
      <h2 className="text-3xl md:text-5xl font-editorial font-bold text-[#3D2B1F] leading-[1.1] uppercase tracking-tighter">
        {firstPart} <span className="text-[#C5A059] italic font-light">{lastPart}</span>
      </h2>
    </div>
  );
};

export default SectionHeading;
