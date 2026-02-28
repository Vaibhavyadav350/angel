import React from 'react';
import { responsivePatterns } from '../../../utils/responsiveClasses';

/**
 * Reusable section container component
 * Follows DRY principles by centralizing section wrapper patterns
 */
const SectionContainer = React.memo(React.forwardRef(({
  children,
  className = '',
  bgColor = 'bg-warm-bg',
  padding = true,
  paddingX = true,
  rounded = false,
  maxWidth = true,
  ...props
}, ref) => {
  const classes = [
    bgColor,
    padding && responsivePatterns.sectionPadding,
    paddingX && responsivePatterns.sectionPaddingX,
    rounded && responsivePatterns.borderRadiusLarge,
    className,
  ].filter(Boolean).join(' ');

  return (
    <section ref={ref} className={classes} {...props}>
      {maxWidth ? (
        <div className={responsivePatterns.container}>
          {children}
        </div>
      ) : (
        <div className="w-full">
          {children}
        </div>
      )}
    </section>
  );
}));

SectionContainer.displayName = 'SectionContainer';

export default SectionContainer;

