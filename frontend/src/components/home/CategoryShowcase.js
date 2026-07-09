import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionHeading from './SectionHeading';
import taxonomy from '../../utils/taxonomy.json';

const AutoCarousel = ({ children }) => {
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let animationFrameId;
    let scrollDirection = 1;
    const speed = 0.7;

    const scroll = () => {
      const container = scrollRef.current;
      if (container && !isHovered && window.innerWidth >= 1024) {
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth - 1) {
          scrollDirection = -1;
        } else if (container.scrollLeft <= 0) {
          scrollDirection = 1;
        }
        container.scrollLeft += speed * scrollDirection;
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  return (
    <div 
      ref={scrollRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="grid grid-cols-2 gap-4 md:gap-6 lg:flex lg:gap-6 lg:overflow-x-auto lg:pb-8 no-scrollbar"
    >
      {children}
    </div>
  );
};

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
          { name: "Bridal", sub: "PALACE", img: "/assets/landing/catalog/subcat_bridallehenga.jpg", url: "/products?category=Women&subCategory=LEHENGAS&productType=Bridal%20Lehengas" },
          { name: "Bridesmaid", sub: "PASTEL", img: "/assets/landing/catalog/subcat_bridesmaidlehenga.jpg", url: "/products?category=Women&subCategory=LEHENGAS" },
          { name: "Cocktail", sub: "GLAM", img: "/assets/landing/catalog/subcat_cocktaillehenga.jpg", url: "/products?category=Women&subCategory=LEHENGAS" },
          { name: "Engagement", sub: "ELEGANT", img: "/assets/landing/catalog/subcat_engagementlehenga.jpg", url: "/products?category=Women&subCategory=LEHENGAS" },
          { name: "Mehendi", sub: "VIBRANT", img: "/assets/landing/catalog/subcat_mehendilehenga.jpg", url: "/products?category=Women&subCategory=LEHENGAS" },
          { name: "Partywear", sub: "MODERN", img: "/assets/landing/catalog/subcat_partywearlehenga.jpg", url: "/products?category=Women&subCategory=LEHENGAS&productType=Partywear%20Lehengas" }
        ]
      },
      {
        title: "SAREES",
        items: [
          { name: "Wedding", sub: "HEAVY", img: "/assets/landing/catalog/subcat_weddingsaree.jpg", url: "/products?category=Women&subCategory=SAREES&productType=WEDDING%20SAREES" },
          { name: "Lehenga Saree", sub: "FUSION", img: "/assets/landing/catalog/subcat_lehengasaree.jpg", url: "/products?category=Women&subCategory=SAREES" },
          { name: "Partywear", sub: "GLAM", img: "/assets/landing/catalog/subcat_partywearsaree.jpg", url: "/products?category=Women&subCategory=SAREES" },
          { name: "Casual", sub: "MINIMAL", img: "/assets/landing/catalog/subcat_casualsaree.jpg", url: "/products?category=Women&subCategory=SAREES&productType=casual%20wear" }
        ]
      },
      {
        title: "SALWAR KAMEEZ",
        items: [
          { name: "Anarkali", sub: "FLARE", img: "/assets/landing/catalog/subcat_anarkali.jpg", url: "/products?category=Women&subCategory=SALWAR+KAMEEZ&productType=Anarkali%20suits" },
          { name: "Gharara", sub: "ROYAL", img: "/assets/landing/catalog/subcat_gharara.jpg", url: "/products?category=Women&subCategory=SALWAR+KAMEEZ&productType=Gharara%20suit" },
          { name: "Sharara", sub: "WIDE", img: "/assets/landing/catalog/subcat_sharara.jpg", url: "/products?category=Women&subCategory=SALWAR+KAMEEZ&productType=sharara%20suits" },
          { name: "Pakistani", sub: "STRAIGHT", img: "/assets/landing/catalog/subcat_pakistani.jpg", url: "/products?category=Women&subCategory=SALWAR+KAMEEZ&productType=pakistani%20suits" },
          { name: "Palazzo", sub: "MODERN", img: "/assets/landing/catalog/subcat_palazzo.jpg", url: "/products?category=Women&subCategory=SALWAR+KAMEEZ&productType=palazzo%20suits" },
          { name: "Pant Suit", sub: "MINIMAL", img: "/assets/landing/catalog/subcat_pantsuit.jpg", url: "/products?category=Women&subCategory=SALWAR+KAMEEZ&productType=pant%20suits" },
          { name: "Punjabi", sub: "PATIALA", img: "/assets/landing/catalog/subcat_punjabi.jpg", url: "/products?category=Women&subCategory=SALWAR+KAMEEZ&productType=punjabi%20suits" },
          { name: "Kurti", sub: "CASUAL", img: "/assets/landing/catalog/subcat_kurti.jpg", url: "/products?category=Women&subCategory=SALWAR+KAMEEZ&productType=kurti" }
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
          { name: "Classic Sherwani", sub: "GROOM", img: "/assets/landing/catalog/subcat_classicsherwani.jpg", url: "/products?category=Men&subCategory=SHERWANIS&productType=Classic%20Sherwani" },
          { name: "Indowestern", sub: "FUSION", img: "/assets/landing/catalog/subcat_indowestern.jpg", url: "/products?category=Men&subCategory=SHERWANIS&productType=Indowestern%20Sherwani" },
          { name: "Jacket Sets", sub: "MODERN", img: "/assets/landing/catalog/subcat_jacketset.jpg", url: "/products?category=Men&subCategory=JACKET&productType=jacket%20sets" },
          { name: "Jodhpuri", sub: "ROYAL", img: "/assets/landing/catalog/subcat_jodhpuri.jpg", url: "/products?category=Men&subCategory=JACKET&productType=jodhpuri%20jaket%20sets" }
        ]
      },
      {
        title: "KURTA EDITS",
        items: [
          { name: "Kurta Pajama", sub: "TRADITIONAL", img: "/assets/landing/catalog/subcat_kurtapajama.jpg", url: "/products?category=Men&subCategory=KURTAS&productType=kurta%20pajama%20sets" },
          { name: "Long Kurta", sub: "CLASSIC", img: "/assets/landing/catalog/subcat_longkurta.jpg", url: "/products?category=Men&subCategory=KURTAS&productType=long%20kurta%20set" },
          { name: "Short Kurta", sub: "CASUAL", img: "/assets/landing/catalog/subcat_shortkurta.jpg", url: "/products?category=Men&subCategory=KURTAS&productType=short%20kurta%20set" }
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
          { name: "Necklaces", sub: "STATEMENT", img: "/assets/landing/catalog/subcat_necklaces.jpg", url: "/products?category=Jewelry&subCategory=Necklaces" },
          { name: "Chokers", sub: "TRADITIONAL", img: "/assets/landing/catalog/subcat_chokers.jpg", url: "/products?category=Jewelry&subCategory=Chokers" },
          { name: "Earrings", sub: "CLASSIC", img: "/assets/landing/catalog/subcat_earrings.jpg", url: "/products?category=Jewelry&subCategory=Earrings" },
          { name: "Bracelets & Bangles", sub: "ELEGANT", img: "/assets/landing/catalog/subcat_bracelets.jpg", url: "/products?category=Jewelry&subCategory=Bracelets" },
          { name: "Rings", sub: "STATEMENT", img: "/assets/landing/catalog/subcat_rings.jpg", url: "/products?category=Jewelry&subCategory=Rings" },
          { name: "Casual Elegance", sub: "MODERN", img: "/assets/landing/catalog/subcat_casualjewelry.jpg", url: "/products?category=Jewelry&subCategory=Casual" }
        ]
      }
    ]
  }
];

const getViewMoreUrl = (sectionCategory, subTitle) => {
  const subCats = taxonomy.categories[sectionCategory];
  if (!subCats) return `/products?category=${sectionCategory}`;

  // Exact match against taxonomy keys (e.g. "SALWAR KAMEEZ")
  if (subCats[subTitle]) {
    return `/products?category=${sectionCategory}&subCategory=${encodeURIComponent(subTitle)}`;
  }

  // Fallback: try the first word (e.g. "SHERWANIS" from "SHERWANIS & JACKETS")
  const firstWord = subTitle.replace('& ', '').split(' ')[0];
  if (subCats[firstWord]) {
    return `/products?category=${sectionCategory}&subCategory=${encodeURIComponent(firstWord)}`;
  }

  // No matching subcategory — link to the category page
  return `/products?category=${sectionCategory}`;
};

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
                    <AutoCarousel>
                      {sub.items.map((item, iIdx) => (
                        <Link 
                          key={iIdx} 
                          to={item.url}
                          className="group flex flex-col lg:flex-none lg:w-[320px]"
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
                            {/* Hover overlay with minimal "Explore" */}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                              <span className="text-white text-[10px] tracking-[0.3em] uppercase border border-white/40 px-6 py-2 rounded-full backdrop-blur-sm">
                                Explore
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-center lg:text-left mt-2 px-2">
                            <p className="text-[10px] text-[#C5A059] tracking-[0.2em] font-bold mb-1 uppercase">{item.sub}</p>
                            <h4 className="font-serif text-lg text-[#3D2B1F] tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{item.name}</h4>
                          </div>
                        </Link>
                      ))}

                      {/* View More Card (Desktop only to maintain mobile grid symmetry) */}
                      <Link
                        to={getViewMoreUrl(section.category, sub.title)}
                        className="hidden lg:flex flex-none w-[320px] snap-start items-center justify-center bg-[#F5EFE4] rounded-2xl group border-2 border-dashed border-[#D4C5B5] hover:border-[#C5A059] transition-colors"
                      >
                        <div className="text-center">
                          <span className="text-4xl text-[#C5A059] block mb-2 group-hover:translate-x-2 transition-transform">→</span>
                          <p className="text-[11px] font-bold tracking-widest text-[#3D2B1F] uppercase">View Complete Collection</p>
                        </div>
                      </Link>
                    </AutoCarousel>
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
