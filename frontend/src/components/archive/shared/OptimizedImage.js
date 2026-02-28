import React from 'react';

/**
 * Reusable optimized image component
 * Follows DRY principles by centralizing image optimization patterns
 */
const OptimizedImage = React.memo(({
  src,
  alt = '',
  className = '',
  loading = 'lazy',
  priority = false,
  width,
  height,
  aspectRatio,
  ...props
}) => {
  const imageProps = {
    src,
    alt: alt || '',
    className,
    loading: priority ? 'eager' : loading,
    ...(priority && { fetchpriority: 'high' }),
    ...(width && height && { width, height }),
    ...props,
  };

  return <img {...imageProps} />;
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;

