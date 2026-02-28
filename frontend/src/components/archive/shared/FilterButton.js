import React from 'react';

/**
 * Reusable filter button component
 * Follows DRY principles by centralizing button styling and behavior
 */
const FilterButton = React.memo(({ 
  label, 
  value, 
  isActive, 
  onClick, 
  ariaLabel 
}) => {
  return (
    <button
      onClick={() => onClick(value)}
      aria-label={ariaLabel || `Filter by ${label}`}
      className={`px-12 py-5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] transition-all min-h-[44px] ${
        isActive
          ? 'bg-gold text-bronze hover:brightness-110'
          : 'border border-champagne/20 hover:border-gold hover:text-gold'
      }`}
    >
      {label}
    </button>
  );
});

FilterButton.displayName = 'FilterButton';

export default FilterButton;
