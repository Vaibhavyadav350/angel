import React, { useState } from 'react';

function ImagesList({ images = [{ url: '' }] }) {
  const [mainImage, setMainImage] = useState(images[0]);
  return (
    <div className="flex flex-col items-center gap-4">
      <img
        src={mainImage.url}
        alt="Product"
        className="w-[408px] h-[408px] object-cover rounded-lg"
      />
      <div className="flex items-start gap-3">
        {images.map((image, index) => {
          const { url } = image;
          return (
            <div key={index} className="flex flex-col items-center gap-1">
              <img
                src={url}
                alt={`thumbnail-${index}`}
                className={`w-[75px] h-[75px] object-cover rounded-lg cursor-pointer transition-opacity ${mainImage.url === url ? 'opacity-100 ring-2 ring-gold' : 'opacity-60 hover:opacity-100'
                  }`}
                onClick={() => setMainImage(images[index])}
              />
              {mainImage.url === url && (
                <div className="w-1.5 h-1.5 bg-bronze rounded-full" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ImagesList;
