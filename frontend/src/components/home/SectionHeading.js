import React from 'react';

/**
 * Section heading.
 *
 * The previous version split the title and set the last word in gold italics
 * automatically. Applied to every section on the page, that flourish stopped
 * reading as emphasis and started reading as a template — "Shop by *Occasion*",
 * "Shop by *Category*", "The Women's *Archive*" — all shouted in uppercase at
 * 4xl–6xl.
 *
 * The one section that felt right was the fabric strip, which used a quiet
 * sentence-case line at a moderate size. That restraint is the treatment here.
 *
 * `size`:
 *   'lg' — a major section that opens a new part of the page
 *   'sm' — a strip or sub-section inside one
 */
const SectionHeading = ({ title, subtitle, size = 'lg', align = 'left', onDark = false, className = '' }) => {
  const titleSize =
    size === 'sm'
      ? 'text-lg sm:text-2xl'
      : 'text-2xl sm:text-3xl lg:text-[2.75rem]';

  const alignment = align === 'center' ? 'text-center mx-auto items-center' : 'text-left';

  return (
    <div className={`max-w-2xl flex flex-col ${alignment} ${className}`}>
      {subtitle && (
        <p className="text-[#C5A059] text-[9px] sm:text-[10px] tracking-[0.5em] uppercase font-bold mb-3 sm:mb-4">
          {subtitle}
        </p>
      )}
      {/* Sentence case, no forced uppercase, no auto-italic. Let the words work. */}
      <h2 className={`${titleSize} font-editorial font-bold leading-[1.15] tracking-tight ${onDark ? 'text-[#F7EFE3]' : 'text-[#3D2B1F]'}`}>
        {title}
      </h2>
    </div>
  );
};

export default SectionHeading;
