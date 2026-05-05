import React from 'react';
import { Link } from 'react-router-dom';
import SectionHeading from './SectionHeading';

const showcases = [
  {
    id: "women",
    category: "Women",
    title: "The Women's Archive",
    subtitle: "A legacy of elegance, from bridal masterpieces to contemporary silhouettes.",
    bgColor: "bg-[#F5EFE4]",
    bgText: "ARCHIVE",
    sections: [
      {
        title: "LEHENGAS",
        items: [
          { name: "Bridal", sub: "PALACE", img: "/assets/landing/catalog/subcat_bridallehenga.jpg", url: "/products?category=Women&subCategory=LEHENGAS" },
          { name: "Bridesmaid", sub: "PASTEL", img: "/assets/landing/catalog/subcat_bridesmaidlehenga.jpg", url: "/products?category=Women&subCategory=LEHENGAS" },
          { name: "Cocktail", sub: "GLAM", img: "/assets/landing/catalog/subcat_cocktaillehenga.jpg", url: "/products?category=Women&subCategory=LEHENGAS" },
          { name: "Engagement", sub: "ELEGANT", img: "/assets/landing/catalog/subcat_engagementlehenga.jpg", url: "/products?category=Women&subCategory=LEHENGAS" },
          { name: "Mehendi", sub: "VIBRANT", img: "/assets/landing/catalog/subcat_mehendilehenga.jpg", url: "/products?category=Women&subCategory=LEHENGAS" },
          { name: "Partywear", sub: "MODERN", img: "/assets/landing/catalog/subcat_partywearlehenga.jpg", url: "/products?category=Women&subCategory=LEHENGAS" }
        ]
      },
      {
        title: "SAREES",
        items: [
          { name: "Wedding", sub: "HEAVY", img: "/assets/landing/catalog/subcat_weddingsaree.jpg", url: "/products?category=Women&subCategory=SAREES" },
          { name: "Lehenga Saree", sub: "FUSION", img: "/assets/landing/catalog/subcat_lehengasaree.jpg", url: "/products?category=Women&subCategory=SAREES" },
          { name: "Partywear", sub: "GLAM", img: "/assets/landing/catalog/subcat_partywearsaree.jpg", url: "/products?category=Women&subCategory=SAREES" },
          { name: "Casual", sub: "MINIMAL", img: "/assets/landing/catalog/subcat_casualsaree.jpg", url: "/products?category=Women&subCategory=SAREES" }
        ]
      },
      {
        title: "SALWAR KAMEEZ",
        items: [
          { name: "Anarkali", sub: "FLARE", img: "/assets/landing/catalog/subcat_anarkali.jpg", url: "/products?category=Women&subCategory=SALWAR+KAMEEZ" },
          { name: "Gharara", sub: "ROYAL", img: "/assets/landing/catalog/subcat_gharara.jpg", url: "/products?category=Women&subCategory=SALWAR+KAMEEZ" },
          { name: "Sharara", sub: "WIDE", img: "/assets/landing/catalog/subcat_sharara.jpg", url: "/products?category=Women&subCategory=SALWAR+KAMEEZ" },
          { name: "Pakistani", sub: "STRAIGHT", img: "/assets/landing/catalog/subcat_pakistani.jpg", url: "/products?category=Women&subCategory=SALWAR+KAMEEZ" },
          { name: "Palazzo", sub: "MODERN", img: "/assets/landing/catalog/subcat_palazzo.jpg", url: "/products?category=Women&subCategory=SALWAR+KAMEEZ" },
          { name: "Pant Suit", sub: "MINIMAL", img: "/assets/landing/catalog/subcat_pantsuit.jpg", url: "/products?category=Women&subCategory=SALWAR+KAMEEZ" },
          { name: "Punjabi", sub: "PATIALA", img: "/assets/landing/catalog/subcat_punjabi.jpg", url: "/products?category=Women&subCategory=SALWAR+KAMEEZ" },
          { name: "Kurti", sub: "CASUAL", img: "/assets/landing/catalog/subcat_kurti.jpg", url: "/products?category=Women&subCategory=SALWAR+KAMEEZ" }
        ]
      }
    ]
  },
  {
    id: "men",
    category: "Men",
    title: "The Men's Heritage",
    subtitle: "Timeless tailoring and royal silhouettes for the modern groom.",
    bgColor: "bg-white",
    bgText: "LEGACY",
    sections: [
      {
        title: "SHERWANIS & JACKETS",
        items: [
          { name: "Classic Sherwani", sub: "GROOM", img: "/assets/landing/catalog/subcat_classicsherwani.jpg", url: "/products?category=Men&subCategory=SHERWANIS" },
          { name: "Indowestern", sub: "FUSION", img: "/assets/landing/catalog/subcat_indowestern.jpg", url: "/products?category=Men&subCategory=SHERWANIS" },
          { name: "Jacket Sets", sub: "MODERN", img: "/assets/landing/catalog/subcat_jacketset.jpg", url: "/products?category=Men&subCategory=JACKET" },
          { name: "Jodhpuri", sub: "ROYAL", img: "/assets/landing/catalog/subcat_jodhpuri.jpg", url: "/products?category=Men&subCategory=JACKET" }
        ]
      },
      {
        title: "KURTA EDITS",
        items: [
          { name: "Kurta Pajama", sub: "TRADITIONAL", img: "/assets/landing/catalog/subcat_kurtapajama.jpg", url: "/products?category=Men&subCategory=KURTAS" },
          { name: "Long Kurta", sub: "CLASSIC", img: "/assets/landing/catalog/subcat_longkurta.jpg", url: "/products?category=Men&subCategory=KURTAS" },
          { name: "Short Kurta", sub: "CASUAL", img: "/assets/landing/catalog/subcat_shortkurta.jpg", url: "/products?category=Men&subCategory=KURTAS" }
        ]
      }
    ]
  },
  {
    id: "kids",
    category: "Kids",
    title: "The Young Heirs",
    subtitle: "Miniature masterpieces crafted with the same archival precision.",
    bgColor: "bg-[#F5EFE4]",
    bgText: "ESTATE",
    sections: [
      {
        title: "KIDSWEAR",
        items: [
          { name: "Girls Ethnic", sub: "BOUTIQUE", img: "/assets/landing/catalog/subcat_girlskid.jpg", url: "/products?category=Kids&subCategory=Girls" },
          { name: "Boys Ethnic", sub: "TRADITIONAL", img: "/assets/landing/catalog/subcat_boyskid.jpg", url: "/products?category=Kids&subCategory=Boys" }
        ]
      }
    ]
  },
  {
    id: "jewelry",
    category: "Jewelry",
    title: "Archival Adornments",
    subtitle: "Exquisite hand-crafted jewelry to complete the heritage look.",
    bgColor: "bg-white",
    bgText: "LUXURY",
    sections: [
      {
        title: "JEWELRY SERIES",
        items: [
          { name: "Bridal Suites", sub: "KUNDAN", img: "/assets/landing/catalog/subcat_bridaljewelry.jpg", url: "/products?category=Jewelry&subCategory=Bridal" },
          { name: "Casual Elegance", sub: "MODERN", img: "/assets/landing/catalog/subcat_casualjewelry.jpg", url: "/products?category=Jewelry&subCategory=Casual" }
        ]
      }
    ]
  }
];

const CategoryShowcase = () => {
  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      {showcases.map((section, sIdx) => (
        <section key={sIdx} className={`${section.bgColor} py-16 md:py-24 relative overflow-hidden border-b border-[#D4C5B5]/20`}>
          
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full flex justify-center whitespace-nowrap opacity-[0.02] select-none pointer-events-none z-0">
            <h2 className="text-[25vw] font-editorial font-black leading-none uppercase tracking-[0.05em]">
              {section.bgText}
            </h2>
          </div>

          <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
            
            <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end gap-8 mb-16">
              <div className="text-center lg:text-left w-full lg:w-auto flex flex-col items-center lg:items-start">
                <SectionHeading title={section.title} subtitle={`Series 0${sIdx + 1}`} className="text-center lg:text-left flex flex-col items-center lg:items-start" />
                <p className="text-sm font-medium text-[#7A5C41]/80 leading-relaxed border-l-2 border-[#C5A059]/40 pl-6 mt-6 max-w-lg hidden md:block">
                  {section.subtitle}
                </p>
              </div>
              <div className="h-px flex-1 bg-[#D4C5B5]/30 mx-12 hidden lg:block" />
              <p className="text-[10px] font-bold text-[#C5A059] tracking-[0.4em] uppercase whitespace-nowrap">{section.category} COLLECTION</p>
            </div>

            {section.sections.map((sub, subIdx) => (
                <div key={subIdx} className="mb-20 last:mb-0">
                  <div className="flex items-center gap-4 mb-10 px-0">
                    <div className="h-px w-10 bg-[#C5A059]" />
                    <h3 className="text-[10px] font-bold text-[#3D2B1F] tracking-[0.4em] uppercase">{sub.title}</h3>
                  </div>
                  
                  <div className="w-full">
                    <div className="grid grid-cols-2 gap-4 md:gap-6 lg:flex lg:gap-6 lg:overflow-x-auto lg:pb-8 no-scrollbar lg:snap-x lg:snap-mandatory">
                      {sub.items.map((item, iIdx) => (
                        <Link 
                          key={iIdx} 
                          to={item.url}
                          className="group flex flex-col lg:flex-none lg:w-[320px] lg:snap-start"
                        >
                          <div className={`relative aspect-[3/4] overflow-hidden rounded-2xl mb-4 bg-[#F9F6F2] transition-all duration-700 shadow-md group-hover:shadow-xl
                            ${section.id === 'men' ? 'rounded-none border-b-0' : ''}
                            ${section.id === 'kids' ? 'rounded-t-[4rem] rounded-b-xl' : ''}
                            ${section.id === 'jewelry' ? 'bg-[#3D2B1F]' : ''}
                          `}>
                            <img 
                              src={item.img} 
                              alt={item.name}
                              className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                            />
                            <div className={`absolute inset-0 transition-opacity duration-700
                              ${section.id === 'jewelry' ? 'bg-gradient-to-t from-[#3D2B1F]/95 via-transparent to-transparent opacity-80' : 'bg-gradient-to-t from-[#3D2B1F]/80 via-transparent to-transparent opacity-60 group-hover:opacity-40'}
                            `} />
                            {section.id === 'men' && (
                              <div className="absolute inset-0 border-0 group-hover:border-[1px] border-[#C5A059]/40 transition-all duration-500" />
                            )}
                            <div className="absolute inset-x-0 bottom-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                              <p className="text-[#C5A059] text-[8px] font-bold tracking-[0.3em] uppercase mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                {item.sub}
                              </p>
                              <h4 className="text-sm md:text-base font-editorial font-bold text-white uppercase leading-none tracking-tight">
                                {item.name}
                              </h4>
                            </div>
                          </div>
                          <div className="text-center md:text-left">
                            <span className="text-[9px] font-bold text-[#C5A059] tracking-[0.2em] uppercase border-b border-[#C5A059]/20 pb-1 group-hover:border-[#C5A059] transition-all">
                              Explore
                            </span>
                          </div>
                        </Link>
                      ))}

                      {/* View More Card (Desktop only to maintain mobile grid symmetry) */}
                      <Link
                        to={`/products?category=${section.category}&subCategory=${encodeURIComponent(sub.title.replace('& ', '').split(' ')[0])}`}
                        className="hidden lg:flex flex-none w-[320px] snap-start items-center justify-center bg-[#F5EFE4] rounded-2xl group border-2 border-dashed border-[#D4C5B5] hover:border-[#C5A059] transition-colors"
                      >
                        <div className="text-center">
                          <span className="text-4xl text-[#C5A059] block mb-2 group-hover:translate-x-2 transition-transform">→</span>
                          <p className="text-[11px] font-bold tracking-widest text-[#3D2B1F] uppercase">View Complete Collection</p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>
      ))}
    </>
  );
};

export default CategoryShowcase;
