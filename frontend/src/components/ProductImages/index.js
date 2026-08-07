import React, { useState } from 'react';
import ReactImageMagnify from 'react-image-magnify';
import { motion } from 'framer-motion';

const ProductImages = ({ images = [] }) => {
  const defaultImage = { url: 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><rect width="500" height="500" fill="#F0E6D6"/><text x="250" y="258" text-anchor="middle" font-family="serif" font-size="26" fill="#B9A488">No Image</text></svg>'), filename: 'placeholder' };

  // Normalize images: if they are strings, convert to objects
  const normalizedImages = (images && images.length > 0) ? images.map(img => {
    return typeof img === 'string' ? { url: img, filename: 'product' } : img;
  }) : [defaultImage];

  const [main, setMain] = useState(normalizedImages[0]);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative bg-white aspect-[3/4] overflow-hidden border border-bronze/10 cursor-crosshair group"
      >
        <ReactImageMagnify
          {...{
            className: 'w-full h-full object-cover',
            imageClassName: 'w-full h-full object-cover',
            enlargedImageContainerClassName: 'bg-white z-50 border border-bronze/20 shadow-2xl',
            smallImage: {
              sizes: '(max-width: 576px) 300px, (min-width: 992px) 500px,',
              isFluidWidth: true,
              alt: 'main product image',
              src: main.url,
            },
            largeImage: {
              src: main.url,
              width: 1400,
              height: 2100,
            },
            enlargedImageContainerDimensions: {
              width: '150%',
              height: '150%',
            },
            isHintEnabled: true,
            hintTextMouse: "Hover to Inspect Heritage Details",
            hintTextTouch: "Long-Touch to Inspect Heritage Details",
          }}
        />
      </motion.div>

      <div className="grid grid-cols-4 md:grid-cols-5 gap-4">
        {normalizedImages.map((image, index) => {
          return (
            <button
              key={index}
              onClick={() => setMain(normalizedImages[index])}
              className={`relative aspect-[3/4] overflow-hidden bg-white border border-bronze/10 transition-all duration-300 ${image.url === main.url ? 'ring-2 ring-gold ring-offset-2' : 'hover:opacity-75'
                }`}
            >
              <img
                src={image.url}
                alt={image.filename || `product-thumbnail-${index}`}
                className="w-full h-full object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductImages;
