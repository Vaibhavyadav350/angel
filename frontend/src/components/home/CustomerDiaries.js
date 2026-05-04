import React from 'react';

const diaries = [
  {
    id: 1,
    name: "Aanya & Rahul",
    location: "Udaipur, India",
    image: "/assets/landing/client-udaipur.jpg",
    quote: "The heritage collection made our special day feel like a royal dream.",
    size: "large"
  },
  {
    id: 2,
    name: "Priya Sharma",
    location: "London, UK",
    image: "/assets/landing/client-sangeet.jpg",
    quote: "Exquisite craftsmanship that truly represents our culture.",
    size: "small"
  },
  {
    id: 3,
    name: "Ishani",
    location: "Mumbai, India",
    image: "/assets/landing/client-mehendi.jpg",
    quote: "A perfect blend of traditional elegance and modern style.",
    size: "medium"
  },
  {
    id: 4,
    name: "The Royal Grooms",
    location: "Jaipur, India",
    image: "/assets/landing/client-groomsquad.jpg",
    quote: "Unmatched quality and attention to detail in every thread.",
    size: "medium"
  }
];

const CustomerDiaries = () => {
  return (
    <section className="py-24 md:py-32 bg-stone/30 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#F5EFE4]/20 -skew-x-12 translate-x-1/2 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24 gap-8">
          <div className="max-w-2xl">
            <p className="text-[#C5A059] text-[10px] tracking-[0.5em] uppercase font-bold mb-4">Social Proof</p>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-editorial font-black text-[#3D2B1F] leading-[0.85] uppercase tracking-tighter">
              Customer <span className="text-[#C5A059] italic font-light">Diaries</span>
            </h2>
          </div>
          <div className="hidden md:block pb-4">
            <p className="text-[11px] font-bold tracking-[0.2em] text-[#7A5C41] uppercase border-b-2 border-[#C5A059] pb-2">
              Shared by our community
            </p>
          </div>
        </div>

        {/* Unique Staggered Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 auto-rows-[200px]">
          {/* Card 1: Large */}
          <div className="md:col-span-7 md:row-span-3 group relative overflow-hidden rounded-2xl shadow-xl">
            <img src={diaries[0].image} alt={diaries[0].name} className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3D2B1F]/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
            <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white">
              <p className="text-[#C5A059] text-[10px] font-bold uppercase tracking-widest mb-2">{diaries[0].location}</p>
              <h3 className="text-3xl md:text-4xl font-editorial font-bold mb-4">{diaries[0].name}</h3>
              <p className="text-sm md:text-base italic font-serif text-white/80 max-w-md">"{diaries[0].quote}"</p>
            </div>
          </div>

          {/* Card 2: Small */}
          <div className="md:col-span-5 md:row-span-2 group relative overflow-hidden rounded-2xl shadow-xl">
            <img src={diaries[1].image} alt={diaries[1].name} className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3D2B1F]/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
            <div className="absolute bottom-0 left-0 p-8 text-white">
              <p className="text-[#C5A059] text-[9px] font-bold uppercase tracking-widest mb-1">{diaries[1].location}</p>
              <h3 className="text-2xl font-editorial font-bold mb-2">{diaries[1].name}</h3>
              <p className="text-[11px] italic font-serif text-white/70">"{diaries[1].quote}"</p>
            </div>
          </div>

          {/* Card 3: Medium */}
          <div className="md:col-span-5 md:row-span-2 group relative overflow-hidden rounded-2xl shadow-xl">
            <img src={diaries[2].image} alt={diaries[2].name} className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3D2B1F]/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
            <div className="absolute bottom-0 left-0 p-8 text-white">
              <p className="text-[#C5A059] text-[9px] font-bold uppercase tracking-widest mb-1">{diaries[2].location}</p>
              <h3 className="text-2xl font-editorial font-bold mb-2">{diaries[2].name}</h3>
            </div>
          </div>

          {/* Card 4: Last one fitting in the staggered flow */}
          <div className="md:col-span-7 md:row-span-1 group relative overflow-hidden rounded-2xl shadow-xl flex items-center bg-[#3D2B1F]">
            <div className="px-12 py-8 flex items-center justify-between w-full">
              <div>
                <h3 className="text-white font-editorial text-2xl mb-2">Join the Heritage</h3>
                <p className="text-[#C5A059] text-[10px] font-bold uppercase tracking-[0.3em]">Share your story with us</p>
              </div>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="size-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-[#C5A059] hover:border-[#C5A059] transition-all">
                <span className="text-2xl">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerDiaries;
