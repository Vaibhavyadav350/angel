import React, { useState } from 'react';
import ReactImageMagnify from 'react-image-magnify';

const ProductImages = ({ images = [] }) => {
  const defaultImage = { url: 'https://via.placeholder.com/500x500?text=No+Image', filename: 'placeholder' };

  // Normalize images: if they are strings, convert to objects
  const normalizedImages = (images && images.length > 0) ? images.map(img => {
    return typeof img === 'string' ? { url: img, filename: 'product' } : img;
  }) : [defaultImage];

  const [main, setMain] = useState(normalizedImages[0]);

  return (
    <div>
      <ReactImageMagnify
        {...{
          className: 'main',
          imageClassName: 'main',
          smallImage: {
            sizes: '(max-width: 576px) 300px, (min-width: 992px) 500px,',
            isFluidWidth: true,
            alt: 'main',
            src: main.url,
          },
          largeImage: {
            src: main.url,
            width: 1200,
            height: 1800,
          },
          enlargedImageContainerDimensions: {
            width: '100%',
            height: '100%',
          },
        }}
      />
      <div className='gallery'>
        {normalizedImages.map((image, index) => {
          return (
            <img
              src={image.url}
              alt={image.filename || `product-image-${index}`}
              className={`${image.url === main.url ? 'active' : null}`}
              key={index}
              onClick={() => {
                setMain(normalizedImages[index]);
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ProductImages;
