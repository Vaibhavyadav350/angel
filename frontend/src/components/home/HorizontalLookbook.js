import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useProductsContext } from '../../context/products_context';

const HorizontalLookbook = ({ title, category, subCategory, bgColor = "bg-white" }) => {
  const { products } = useProductsContext();
  const scrollRef = useRef(null);

  const filteredProducts = products.filter(p =>
    p.category === category && (!subCategory || p.subCategory === subCategory)
  ).slice(0, 6);

  if (filteredProducts.length === 0) return null;

  // Split title into two parts for the specific editorial style
  const titleParts = title.split(' ');
  const firstPart = titleParts.slice(0, -1).join(' ');
  const lastPart = titleParts[titleParts.length - 1];

  return (
    <section className={`${bgColor} py-12 md:py-20 overflow-hidden relative border-b border-[#D4C5B5]/20`}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-row justify-between items-center mb-8 gap-4 border-b border-[#D4C5B5]/30 pb-6">
          <div className="flex items-center gap-6">
            <h2 className="text-3xl md:text-5xl font-editorial font-bold text-[#3D2B1F] leading-none uppercase tracking-tighter">
              {firstPart} <span className="text-[#C5A059] italic font-light">{lastPart}</span>
            </h2>
          </div>
          <Link
            to={`/products?category=${category}${subCategory ? `&subCategory=${subCategory}` : ''}`}
            className="group flex items-center gap-3 shrink-0"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#3D2B1F] group-hover:text-[#C5A059] transition-colors">
              View All
            </span>
            <div className="size-10 rounded-full border border-[#3D2B1F] text-[#3D2B1F] flex items-center justify-center group-hover:bg-[#3D2B1F] group-hover:text-white transition-all duration-500 overflow-hidden relative">
              <span className="text-xl group-hover:translate-x-10 transition-transform duration-500">→</span>
              <span className="text-xl absolute -translate-x-10 group-hover:translate-x-0 transition-transform duration-500">→</span>
            </div>
          </Link>
        </div>

        {/* Horizontal Scroll */}
        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory"
        >
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="flex-none w-[220px] md:w-[320px] snap-start group"
            >
              <div className="aspect-[4/5] overflow-hidden rounded-2xl relative mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors" />

                {/* Subtle Price Tag */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-[10px] font-bold text-[#3D2B1F]">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price)}
                  </p>
                </div>
              </div>
              <h3 className="text-[15px] font-serif text-[#3D2B1F] group-hover:text-[#C5A059] transition-colors uppercase tracking-wide">
                {product.name}
              </h3>
            </Link>
          ))}

          {/* View More Card */}
          <Link
            to={`/products?category=${category}${subCategory ? `&subCategory=${subCategory}` : ''}`}
            className="flex-none w-[220px] md:w-[320px] snap-start flex items-center justify-center bg-[#F5EFE4] rounded-2xl group border-2 border-dashed border-[#D4C5B5] hover:border-[#C5A059] transition-colors"
          >
            <div className="text-center">
              <span className="text-4xl text-[#C5A059] block mb-2 group-hover:translate-x-2 transition-transform">→</span>
              <p className="text-[11px] font-bold tracking-widest text-[#3D2B1F] uppercase">View Complete Collection</p>
            </div>
          </Link>
        </div>
      </div>
      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
    </section>
  );
};

export default HorizontalLookbook;
