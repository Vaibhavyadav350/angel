import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  {
    name: 'Bridal Lehengas',
    sub: 'Traditional · Modern · Luxe',
    image: '/assets/landing/cat-lehenga.jpg',
    url: '/products?category=Women&subCategory=LEHENGAS'
  },
  {
    name: 'Pure Silk Sarees',
    sub: 'Banarasi · Silk · Heritage',
    image: '/assets/landing/cat-saree.jpg',
    url: '/products?category=Women&subCategory=SAREES'
  },
  {
    name: 'Salwar Kameez',
    sub: 'Anarkali · Suits · Kurti',
    image: '/assets/landing/cat-anarkali.jpg',
    url: '/products?category=Women&subCategory=SALWAR+KAMEEZ'
  },
  {
    name: 'Sherwanis',
    sub: 'Classic · Indo-Western',
    image: '/assets/landing/cat-sherwani.jpg',
    url: '/products?category=Men&subCategory=SHERWANIS'
  },
  {
    name: 'Mens Kurtas',
    sub: 'Casual · Festive Wear',
    image: '/assets/landing/hero-men.jpg',
    url: '/products?category=Men&subCategory=KURTAS'
  },
  {
    name: 'Kids Wear',
    sub: 'Boys · Girls Collections',
    image: '/assets/landing/cat-kids.jpg',
    url: '/products?category=Kids'
  },
  {
    name: 'Fine Jewelry',
    sub: 'Bridal · Casual Wear',
    image: '/assets/landing/cat-jewelry.jpg',
    url: '/products?category=Jewelry'
  },
  {
    name: 'New Arrivals',
    sub: 'Fresh Style · Just In',
    image: '/assets/landing/hero-lehenga.jpg',
    url: '/products?collection=new+arrivals'
  },
  {
    name: 'The Sale',
    sub: 'Limited Time · Best Value',
    image: '/assets/landing/cat-lehenga.jpg',
    url: '/products?collection=sale',
    isSale: true
  }
];

const ShopByCategory = () => {
  return (
    <section className="bg-chocolate py-20 md:py-32 overflow-hidden relative">
      {/* Editorial Background Text */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full flex justify-center whitespace-nowrap opacity-[0.03] select-none pointer-events-none z-0">
        <h2 className="text-[25vw] font-editorial font-black leading-none uppercase tracking-tighter text-white">
          CATEGORIES
        </h2>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <p className="text-[#C5A059] text-[10px] tracking-[0.5em] uppercase font-bold mb-4">Explore Our World</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-editorial font-bold text-white leading-tight uppercase tracking-tighter">
            Shop by <span className="text-[#C5A059] italic font-light">Category</span>
          </h2>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-8">
          {categories.map((cat, idx) => (
            <Link 
              key={idx} 
              to={cat.url}
              className="group flex flex-col items-center"
            >
              {/* Semicircle Arch Shape - aspect-square on mobile, aspect-[2/3] on desktop */}
              <div className="relative w-full aspect-square sm:aspect-[2/3] overflow-hidden rounded-t-full border border-white/10 group-hover:border-[#C5A059]/50 transition-all duration-700 shadow-2xl">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110"
                />
                
                {/* Overlay Text */}
                <div className="absolute inset-0 bg-gradient-to-t from-chocolate/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-end justify-center pb-8">
                  <span className="text-white text-[10px] font-bold tracking-[0.3em] uppercase">Explore</span>
                </div>

                {/* Sale Badge */}
                {cat.isSale && (
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[9px] font-bold tracking-[0.3em] uppercase px-4 py-1.5 rounded-full shadow-lg z-20">
                    Sale
                  </div>
                )}
              </div>
              
              <h3 className="mt-6 text-[10px] font-bold tracking-[0.25em] text-white/90 group-hover:text-[#C5A059] transition-colors uppercase text-center leading-tight">
                {cat.name}
              </h3>
              <p className="hidden sm:block text-[9px] tracking-[0.1em] text-white/50 uppercase mt-1">
                {cat.sub}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
