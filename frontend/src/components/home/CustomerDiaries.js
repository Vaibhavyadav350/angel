import React, { useRef } from 'react';
import { socialLinks } from '../../utils/constants';
import SectionHeading from './SectionHeading';

const socialReviews = [
  {
    image: "/assets/landing/diaries/diary_red_suit.jpg",
    quote: "A moment of pure joy captured in our intricately embroidered crimson suit! The fit is an absolute dream.",
    author: "Simran Kaur",
    handle: "@simran_vibes"
  },
  {
    image: "/assets/landing/diaries/diary_magenta_saree.jpg",
    quote: "Stunning in our signature magenta draped saree. The heritage gold embroidery completely stole the show tonight.",
    author: "Ayesha S.",
    handle: "Verified Buyer"
  },
  {
    image: "/assets/landing/diaries/diary_teal_lehenga.jpg",
    quote: "Finding the perfect fit in-store! This beautiful ombre teal lehenga was literally made for her.",
    author: "Emma C.",
    handle: "@emma.style"
  },
  {
    image: "/assets/landing/diaries/diary_couple_ivory.jpg",
    quote: "A picture-perfect engagement. Breathtaking in our custom ivory bridal lehenga alongside her regal groom.",
    author: "Priya & Rohan",
    handle: "Angel Bride"
  }
];

const CustomerDiaries = () => {
  const scrollRef = useRef(null);

  return (
    <section className="py-24 md:py-32 bg-stone/30 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#F5EFE4]/20 -skew-x-12 translate-x-1/2 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 gap-8 border-b border-[#D4C5B5]/30 pb-6">
          <SectionHeading title="Customer Diaries" subtitle="Social Proof" />
          <div className="pb-2 flex items-center gap-4">
            <p className="text-[11px] font-bold tracking-[0.2em] text-[#7A5C41] uppercase">
              Join the conversation
            </p>
            <span className="text-2xl text-[#C5A059] animate-pulse">→</span>
          </div>
        </div>

        {/* Horizontal Swipeable Cards */}
        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory"
        >
          {socialLinks.map((link, index) => {
            const review = socialReviews[index];
            if (!review) return null;

            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="flex-none w-[280px] md:w-[360px] snap-start group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 bg-[#F9F6F2]"
              >
                {/* Background Image */}
                <div className="absolute inset-0 w-full h-full">
                  <img
                    src={review.image}
                    alt={review.author}
                    className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110"
                  />
                  {/* Glassmorphism gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3D2B1F]/95 via-[#3D2B1F]/40 to-[#3D2B1F]/10 opacity-80 group-hover:opacity-90 transition-opacity duration-700" />
                </div>

                {/* Content Container */}
                <div className="relative h-[400px] md:h-[480px] flex flex-col justify-between p-6 md:p-8">
                  {/* Top: Icon Badge */}
                  <div className="self-end">
                    <div className="size-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:scale-110 group-hover:bg-[#C5A059] group-hover:border-[#C5A059] transition-all duration-500">
                      {React.cloneElement(link.icon, { fontSize: '1.5rem', color: 'white' })}
                    </div>
                  </div>

                  {/* Bottom: Review Content */}
                  <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="mb-4">
                      <div className="flex gap-1 mb-3 text-gold">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-sm">★</span>
                        ))}
                      </div>
                      <p className="text-sm md:text-base text-white/90 font-serif italic leading-relaxed line-clamp-4">
                        "{review.quote}"
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3 pt-4 border-t border-white/20">
                      <div className="size-10 rounded-full overflow-hidden border border-white/30">
                        <img src={review.image} alt={review.author} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-white text-xs md:text-sm font-bold tracking-wider uppercase">{review.author}</h4>
                        <p className="text-[#C5A059] text-[9px] font-bold tracking-widest uppercase">{review.handle}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default CustomerDiaries;
