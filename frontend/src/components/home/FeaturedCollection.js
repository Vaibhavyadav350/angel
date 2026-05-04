import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProductsContext } from '../../context/products_context';

const FeaturedCollection = () => {
  const { featured_products: products, products_loading: loading } = useProductsContext();
  const [offset, setOffset] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const top = sectionRef.current.getBoundingClientRect().top;
      const height = window.innerHeight;
      if (top < height && top > -height) {
        setOffset(top * 0.15); // Adjust parallax speed
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Use only first 4 featured products for the 2x2 grid
  const displayProducts = products.slice(0, 4);

  if (loading) return null; // Or a shimmer

  return (
    <section ref={sectionRef} className="bg-transparent py-20 md:py-32 overflow-hidden relative">
      {/* Editorial Background Text */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full flex justify-center whitespace-nowrap opacity-[0.02] select-none pointer-events-none z-0">
        <h2 className="text-[25vw] font-editorial font-black leading-none uppercase tracking-tighter">
          CURATED
        </h2>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-stretch">

          {/* Left: Editorial Image (40%) */}
          <div className="lg:w-[40%] relative group overflow-hidden rounded-2xl h-[500px] lg:h-[750px]">
            <div
              className="absolute inset-0 transition-transform duration-300 ease-out scale-110"
              style={{ transform: `translateY(${offset}px)` }}
            >
              <img
                src="/assets/landing/bridal-edit-center.jpg"
                alt="Bridal Collection"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors duration-500" />

            <div className="absolute bottom-12 left-10 text-white z-10">
              <p className="text-[10px] tracking-[0.4em] uppercase font-bold mb-3 text-[#C5A059]">Haute Couture</p>
              <h2 className="text-5xl md:text-6xl font-editorial font-black mb-8 leading-[1.1] uppercase tracking-tighter">
                The <br /> <span className="text-[#C5A059] italic font-light">Bridal</span> Edit
              </h2>
              <Link
                to="/products?category=Women&subCategory=Lehengas"
                className="inline-flex items-center gap-3 border border-white px-10 py-3.5 rounded-full text-[11px] font-bold tracking-[0.2em] hover:bg-white hover:text-[#3D2B1F] transition-all uppercase"
              >
                View Collection <span className="text-base">→</span>
              </Link>
            </div>
          </div>

          {/* Right: Product Grid (60%) */}
          <div className="lg:w-[60%] flex flex-col">
            <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <p className="text-[#C5A059] text-[10px] tracking-[0.4em] uppercase font-bold mb-4">Curated Masterpieces</p>
                <h3 className="text-5xl md:text-6xl font-editorial font-black text-[#3D2B1F] leading-[0.85] uppercase tracking-tighter">
                  Handcrafted <br /> <span className="text-[#C5A059] italic font-light">Excellence</span>
                </h3>
              </div>
              <Link to="/products" className="text-[11px] font-bold tracking-[0.2em] text-[#3D2B1F] hover:text-[#C5A059] transition-colors border-b-2 border-[#3D2B1F] pb-1 uppercase">
                Explore All
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-8 flex-1">
              {displayProducts.map((product) => (
                <Link key={product.id} to={`/products/${product.id}`} className="group flex flex-col">
                  <div className="aspect-[3/4] overflow-hidden rounded-2xl mb-5 relative bg-[#F9F6F2]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#3D2B1F] shadow-lg hover:bg-[#3D2B1F] hover:text-white transition-colors">
                        <span className="text-xl">+</span>
                      </button>
                    </div>
                  </div>
                  <h4 className="text-[14px] font-serif text-[#3D2B1F] mb-1 group-hover:text-[#C5A059] transition-colors" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {product.name}
                  </h4>
                  <p className="text-[12px] font-bold text-[#C5A059] tracking-wider">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
