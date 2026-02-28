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
            <div className="relative w-full sm:w-48 h-56 shrink-0 overflow-hidden bg-sand/20">
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
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
                <p className="text-sm font-medium leading-relaxed text-bronze/60 max-w-lg line-clamp-3">
                  {description?.substring(0, 150)}...
                </p>
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
