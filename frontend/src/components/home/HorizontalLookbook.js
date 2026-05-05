import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useProductsContext } from '../../context/products_context';
import SectionHeading from './SectionHeading';

const HorizontalLookbook = ({ title, category, subCategory, bgColor = "bg-white" }) => {
  const { products } = useProductsContext();
  const scrollRef = useRef(null);

  const filteredProducts = products.filter(p =>
    p.category?.toLowerCase() === category.toLowerCase() && 
    (!subCategory || p.subCategory?.toLowerCase() === subCategory.toLowerCase())
  ).slice(0, 6);

  if (filteredProducts.length === 0) return null;

  return (
    <section className={`${bgColor} py-12 md:py-20 overflow-hidden relative border-b border-[#D4C5B5]/20`}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-row justify-between items-center mb-8 gap-4 border-b border-[#D4C5B5]/30 pb-6">
          <SectionHeading title={title} />
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
              <div className="aspect-[4/5] overflow-hidden rounded-2xl relative bg-[#F9F6F2] transition-all duration-700 shadow-sm group-hover:shadow-xl">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                />
                
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 transition-opacity duration-700 bg-gradient-to-t from-[#3D2B1F]/90 via-[#3D2B1F]/20 to-transparent opacity-70 group-hover:opacity-90" />

                {/* Content Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  {/* Price (Appears on hover in Desktop, Always visible on Mobile) */}
                  <p className="text-[#C5A059] text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase mb-1.5 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price)}
                  </p>
                  
                  {/* Product Name */}
                  <h4 className="text-sm md:text-lg font-editorial font-bold text-white uppercase leading-none tracking-tight line-clamp-2">
                    {product.name}
                  </h4>
                </div>
              </div>
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
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default HorizontalLookbook;
