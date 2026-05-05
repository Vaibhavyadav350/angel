import React from 'react';
import { formatPrice } from '../../utils/helpers';
import { Link } from 'react-router-dom';

const ListView = ({ products }) => {
  return (
    <div className="space-y-8">
      {products.map((product) => {
        const { id, image, name, price, description, category } = product;
        return (
          <article
            key={id}
            className="flex flex-col sm:flex-row gap-8 pb-8 border-b border-bronze/10 group"
          >
            {/* Image */}
            <div className="relative w-full sm:w-48 aspect-[3/4] shrink-0 overflow-hidden bg-sand/20">
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover object-top transition-transform duration-[2000ms] group-hover:scale-110"
              />
            </div>

            {/* Info */}
            <div className="flex flex-col justify-between py-2 flex-1 space-y-4">
              <div className="space-y-2">
                <h4 className="text-2xl font-editorial font-bold text-bronze">{name}</h4>
                {category && (
                  <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-gold">
                    {category}
                  </p>
                )}
                
                {/* Sizes and Colors replacing Description */}
                <div className="flex flex-col gap-3 mt-4">
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-bronze/60">Sizes:</span>
                      <div className="flex gap-2">
                        {product.sizes.map((size, index) => (
                          <span key={index} className="text-[10px] font-bold text-bronze border border-bronze/20 px-2 py-0.5 rounded-sm">
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {product.colors && product.colors.length > 0 && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-bronze/60">Colors:</span>
                      <div className="flex gap-1.5">
                        {product.colors.map((color, index) => (
                          <span key={index} className="size-4 rounded-full border border-bronze/20 shadow-sm" style={{ backgroundColor: color }} title={color}></span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xl font-editorial font-bold text-bronze">
                  {formatPrice(price)}
                </span>
                <Link
                  to={`/products/${id}`}
                  className="inline-flex items-center gap-3 px-8 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/70 border border-bronze/20 hover:border-gold hover:text-gold transition-all"
                >
                  View Details
                  <span className="material-symbols-outlined text-sm">east</span>
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default ListView;
