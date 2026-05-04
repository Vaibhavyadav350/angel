import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

const pills = [
  { label: 'New Arrivals', url: '/products?collection=new+arrivals' },
  { label: 'Lehengas', url: '/products?category=Women&subCategory=LEHENGAS' },
  { label: 'Sarees', url: '/products?category=Women&subCategory=SAREES' },
  { label: 'Salwar Kameez', url: '/products?category=Women&subCategory=SALWAR+KAMEEZ' },
  { label: 'Sherwanis', url: '/products?category=Men&subCategory=SHERWANIS' },
  { label: 'Kids', url: '/products?category=Kids' },
  { label: 'Jewelry', url: '/products?category=Jewelry' },
  { label: 'Sale', url: '/products?collection=sale', sale: true },
];

const CategoryPills = () => {
  const scrollRef = useRef(null);

  return (
    <section className="bg-white border-b border-[#F0E8DF] sticky top-16 z-40 h-[80px] md:h-[100px] flex items-center">
      <div
        ref={scrollRef}
        className="h-full flex items-center px-4 md:px-8 overflow-x-auto w-full"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Pill container — centered on desktop, scrollable on mobile */}
        <div className="flex items-center gap-4 mx-auto py-4">
          {pills.map(({ label, url, sale }) => (
            <Link
              key={label}
              to={url}
              id={`pill-${label.toLowerCase().replace(/\s+/g, '-')}`}
              className={`flex items-center px-6 py-2 rounded-full border text-[10px] font-bold tracking-[0.15em] transition-all duration-300 shrink-0
                ${sale
                  ? 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white'
                  : 'border-[#D4C5B5] text-[#3D2B1F] hover:border-[#3D2B1F] hover:bg-[#F9F6F2]'
                }`}
            >
              <span className="uppercase">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Hide scrollbar for webkit */}
      <style>{`section .overflow-x-auto::-webkit-scrollbar { display: none; }`}</style>
    </section>
  );
};

export default CategoryPills;
