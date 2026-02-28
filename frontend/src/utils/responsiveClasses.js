/**
 * DRY utility functions for responsive Tailwind classes
 * Centralizes common responsive patterns to avoid repetition
 */

/**
 * Responsive typography scale utility
 * @param {Object} sizes - Size configuration { base, sm, md, lg, xl, '2xl' }
 * @returns {string} Responsive text size classes
 */
export const responsiveText = (sizes) => {
  const classes = [];
  if (sizes.base) classes.push(`text-${sizes.base}`);
  if (sizes.sm) classes.push(`sm:text-${sizes.sm}`);
  if (sizes.md) classes.push(`md:text-${sizes.md}`);
  if (sizes.lg) classes.push(`lg:text-${sizes.lg}`);
  if (sizes.xl) classes.push(`xl:text-${sizes.lg}`);
  if (sizes['2xl']) classes.push(`2xl:text-${sizes['2xl']}`);
  return classes.join(' ');
};

/**
 * Responsive spacing utility (padding/margin)
 * @param {Object} sizes - Size configuration { base, md, lg }
 * @param {string} type - 'p', 'py', 'px', 'pt', 'pb', 'm', 'my', 'mx', 'mt', 'mb', 'gap'
 * @returns {string} Responsive spacing classes
 */
export const responsiveSpacing = (sizes, type = 'py') => {
  const classes = [];
  if (sizes.base) classes.push(`${type}-${sizes.base}`);
  if (sizes.md) classes.push(`md:${type}-${sizes.md}`);
  if (sizes.lg) classes.push(`lg:${type}-${sizes.lg}`);
  return classes.join(' ');
};

/**
 * Responsive gap utility
 * @param {Object} sizes - Gap sizes { base, md, lg }
 * @returns {string} Responsive gap classes
 */
export const responsiveGap = (sizes) => {
  const classes = [];
  if (sizes.base) classes.push(`gap-${sizes.base}`);
  if (sizes.md) classes.push(`md:gap-${sizes.md}`);
  if (sizes.lg) classes.push(`lg:gap-${sizes.lg}`);
  return classes.join(' ');
};

/**
 * Common responsive patterns
 */
export const responsivePatterns = {
  // Section padding
  sectionPadding: 'py-20 md:py-32 lg:py-40',
  sectionPaddingX: 'px-4 md:px-6 lg:px-8',
  
  // Container
  container: 'container mx-auto max-w-7xl',
  
  // Typography scales
  heroTitle: 'text-[15vw] sm:text-[14vw] md:text-[13vw] lg:text-[12vw] xl:text-[11vw] 2xl:text-[10vw]',
  sectionTitle: 'text-4xl sm:text-5xl md:text-6xl lg:text-[9rem] xl:text-[8rem] 2xl:text-[7rem]',
  headingLarge: 'text-3xl md:text-4xl lg:text-5xl xl:text-7xl',
  headingMedium: 'text-2xl md:text-3xl lg:text-4xl',
  bodyText: 'text-sm md:text-base',
  smallText: 'text-[10px] md:text-[11px] lg:text-[12px]',
  
  // Spacing
  spacingSmall: 'gap-6 md:gap-8 lg:gap-10',
  spacingMedium: 'gap-8 md:gap-12 lg:gap-16',
  spacingLarge: 'gap-12 md:gap-16 lg:gap-24',
  
  // Border radius
  borderRadiusSmall: 'rounded-[30px] md:rounded-[40px] lg:rounded-[50px]',
  borderRadiusLarge: 'rounded-[40px] md:rounded-[60px] lg:rounded-[100px]',
  
  // Grid
  productGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-16',
  footerGrid: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 md:gap-12 lg:gap-16',
};

