import React from 'react';
import { FiTruck, FiRotateCcw, FiShield, FiPhoneCall } from 'react-icons/fi';

const trustItems = [
  { icon: <FiTruck size={24} />, text: "Free Regular Post over $200" },
  { icon: <FiRotateCcw size={24} />, text: "48-Hour Exchange Window" },
  { icon: <FiShield size={24} />, text: "Authentic Handcrafted" },
  { icon: <FiPhoneCall size={24} />, text: "WhatsApp Support" }
];

const TrustNewsletter = () => {
  return (
    <section className="bg-white overflow-hidden">
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
    </section>
  );
};

export default TrustNewsletter;
