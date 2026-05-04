import React from 'react';
import { FiTruck, FiRotateCcw, FiShield, FiPhoneCall } from 'react-icons/fi';

const trustItems = [
  { icon: <FiTruck size={24} />, text: "Free Shipping on $150+" },
  { icon: <FiRotateCcw size={24} />, text: "30-Day Easy Returns" },
  { icon: <FiShield size={24} />, text: "Authentic Handcrafted" },
  { icon: <FiPhoneCall size={24} />, text: "WhatsApp Support" }
];

const TrustNewsletter = () => {
  return (
    <section className="bg-champagne overflow-hidden">
      {/* Trust Bar (80px) */}
      <div className="bg-white border-y border-[#F0E8DF] py-6 md:py-0 md:h-[80px] flex items-center">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 w-full">
          <div className="grid grid-cols-2 md:flex md:flex-row md:justify-between items-center gap-6 md:gap-4">
            {trustItems.map((item, index) => (
              <div key={index} className="flex items-center gap-3 group">
                <div className="text-[#C5A059] group-hover:scale-110 transition-transform">
                  {React.cloneElement(item.icon, { size: 18 })}
                </div>
                <p className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-[#3D2B1F] uppercase">{item.text}</p>
                {index < trustItems.length - 1 && (
                  <div className="hidden md:block h-4 w-[1px] bg-[#D4C5B5] ml-8" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter (200px approx) */}
      <div className="py-20 md:py-24 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <p className="text-[#C5A059] text-[9px] font-bold tracking-[0.5em] uppercase mb-4">The Inner Circle</p>
          <h2 className="text-3xl md:text-5xl font-serif text-[#3D2B1F] mb-10" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Stay in the Loop</h2>
          
          <form className="flex flex-col md:flex-row gap-0 items-center justify-center rounded-full overflow-hidden border border-[#D4C5B5] bg-white p-1 shadow-xl focus-within:border-[#C5A059] transition-all max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="w-full flex-1 px-8 py-3 bg-transparent text-sm outline-none text-[#3D2B1F] placeholder-[#A89080]"
              required
            />
            <button 
              type="submit" 
              className="w-full md:w-auto bg-[#3D2B1F] text-white px-10 py-3 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#C5A059] transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
          <p className="text-[10px] text-[#A89080] mt-6 italic opacity-60">
            Exclusive collections, early access, and curated stories.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrustNewsletter;
