import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { useProductsContext } from '../../context/products_context';
import { useCartContext } from '../../context/cart_context';

const filters = ["All", "Women", "Men", "Kids", "Jewelry", "Sale"];

const NewArrivalsGrid = () => {
  const { products, products_loading: loading } = useProductsContext();
  const { addToCart } = useCartContext();
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredProducts = products.filter(product => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Sale") return product.collections?.includes("sale");
    return product.category === activeFilter;
  }).slice(0, 8); // Show max 8 on landing page

  if (loading) return null;

  return (
    <section className="bg-transparent py-16 md:py-24 pt-10 md:pt-24 relative overflow-hidden">
      {/* Massive Background Text */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full flex justify-center whitespace-nowrap opacity-[0.02] select-none pointer-events-none z-0">
        <h2 className="text-[25vw] font-editorial font-black leading-none uppercase tracking-tighter">
          HERITAGE
        </h2>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-12">
          <div className="text-center lg:text-left">
            <p className="text-[#C5A059] text-[10px] font-bold uppercase tracking-[0.5em] mb-4">Timeless Masterpieces</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-editorial font-bold text-[#3D2B1F] leading-tight uppercase tracking-tighter">
              The Heritage Collection
            </h2>
            <p className="text-sm font-medium text-[#7A5C41]/80 leading-relaxed border-l-2 border-[#C5A059]/40 pl-6 mt-6 max-w-lg">
              Curated selections from our latest hand-crafted editions, woven with legacy.
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap justify-center gap-3">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-8 py-2.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 border ${activeFilter === filter ? 'bg-[#3D2B1F] text-white border-[#3D2B1F] shadow-lg' : 'bg-transparent text-[#7A5C41] border-[#D4C5B5] hover:border-[#3D2B1F]'}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Grid: 3 columns on mobile, 3 on tablet, 5 on desktop */}
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group flex flex-col">
              {/* Image Card */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-5 bg-[#F9F6F2]">
                <Link to={`/products/${product.id}`} className="block h-full">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                </Link>

                {/* Badges */}
                {product.featured && (
                  <span className="absolute top-4 left-4 bg-[#C5A059] text-white px-3 py-1 rounded-full text-[9px] font-bold tracking-[0.2em] uppercase shadow-sm">
                    Featured
                  </span>
                )}
                {product.collections?.includes('sale') && (
                  <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-[9px] font-bold tracking-[0.2em] uppercase shadow-sm">
                    Sale
                  </span>
                )}

                {/* Quick Actions */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-5 left-4 right-4 flex gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <button
                      onClick={() => addToCart(product.id, 1, product)}
                      className="flex-1 bg-white text-[#3D2B1F] py-3 rounded-xl text-[10px] font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:bg-[#3D2B1F] hover:text-white transition-colors shadow-xl"
                    >
                      <FiShoppingBag size={14} /> Add to Cart
                    </button>
                    <button className="w-12 bg-white text-[#3D2B1F] rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors shadow-xl">
                      <FiHeart size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="text-center md:text-left px-1">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-[#C5A059] text-[10px] font-bold tracking-[0.3em] uppercase">{product.category}</p>
                  <p className="text-[13px] font-bold text-[#3D2B1F]">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price)}
                  </p>
                </div>
                <Link to={`/products/${product.id}`} className="text-[16px] md:text-[18px] font-serif text-[#3D2B1F] block group-hover:text-[#C5A059] transition-colors leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {product.name}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Link */}
        <div className="mt-20 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-4 border-2 border-[#3D2B1F] text-[#3D2B1F] px-12 py-4 rounded-full text-xs font-bold tracking-[0.3em] hover:bg-[#3D2B1F] hover:text-white transition-all uppercase"
          >
            Browse All Collections <span className="text-lg">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewArrivalsGrid;
