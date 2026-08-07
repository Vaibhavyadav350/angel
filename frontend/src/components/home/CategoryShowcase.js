import React from 'react';
import { Link } from 'react-router-dom';
import SectionHeading from './SectionHeading';
import taxonomy from '../../utils/taxonomy.json';

/**
 * Static grid. Replaces an AutoCarousel that ran an infinite requestAnimationFrame
 * loop, ping-ponging scrollLeft at 0.7px/frame — sliding right, hitting the end,
 * then reversing. That reversal is what made it read as a broken slider rather
 * than a design decision, and the loop ran every frame whether or not the
 * section was on screen.
 *
 * A rail was considered instead, but the data rules it out: 14 of the 15 groups
 * hold three items or fewer, so its arrows would be permanently disabled.
 * Everything now fits on screen with nothing moving.
 */
const ItemGrid = ({ children }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">{children}</div>
);

const showcases = [
  {
    id: "women",
    category: "Women",
    title: "The Women's Archive",
    subtitle: "A legacy of elegance, from bridal masterpieces to contemporary silhouettes.",
    bgColor: "bg-[#F7EFE3]",
    // Soft arch: bridal, architectural, feminine.
    shape: "rounded-2xl",
    accent: "#E8B4BC",
    sections: [
      {
        title: "LEHENGAS",
        items: [
          { name: "Bridal", sub: "PALACE", img: "/assets/landing/catalog/subcat_bridallehenga.jpg", url: "/products?category=Women&subCategory=LEHENGAS&productType=Bridal%20Lehengas" },
          { name: "Partywear", sub: "MODERN", img: "/assets/landing/catalog/subcat_partywearlehenga.jpg", url: "/products?category=Women&subCategory=LEHENGAS&productType=Partywear%20Lehengas" },
          { name: "Indo Western", sub: "FUSION", img: "/assets/landing/catalog/subcat_indowestern.jpg", url: "/products?category=Women&subCategory=LEHENGAS&productType=Indo%20Western" }
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
    // Square with a rule beneath: tailored, structured, menswear.
    shape: "rounded-2xl",
    accent: "#E3D3BE",
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
    bgColor: "bg-[#F3EFE8]",
    // Fully rounded: softer, lighter, for the children's room.
    shape: "rounded-2xl",
    accent: "#EFD9BE",
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
    bgColor: "bg-[#2E2119]",
    // Jewellery reads best against dark, the way it is displayed in a case.
    shape: "rounded-full",
    aspect: "aspect-square",
    accent: "#C5A059",
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
      `}</style>
      
      {showcases.map((section, sIdx) => {
        const onDark = section.id === 'jewelry';
        return (
        <section key={sIdx} className={`${section.bgColor} section-rhythm relative border-b border-[#D4C5B5]/20`}>

          <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
            
            <div className="max-w-2xl mb-12 md:mb-16">
              <SectionHeading title={section.title} subtitle={`${section.category} Collection`} onDark={onDark} />
              <p className={`text-sm font-medium leading-relaxed mt-5 hidden md:block ${onDark ? 'text-[#F7EFE3]/60' : 'text-[#7A5C41]/75'}`}>
                {section.subtitle}
              </p>
            </div>

            {section.sections.map((sub, subIdx) => (
                <div key={subIdx} className="mb-14 sm:mb-20 last:mb-0">
                  <div className="flex items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="h-px w-10 bg-[#C5A059] shrink-0" />
                      <h3 className={`text-[10px] font-bold tracking-[0.4em] uppercase truncate ${onDark ? 'text-[#F7EFE3]' : 'text-[#3D2B1F]'}`}>{sub.title}</h3>
                    </div>
                    <Link
                      to={getViewMoreUrl(section.category, sub.title)}
                      className={`group shrink-0 text-[9px] sm:text-[10px] font-bold tracking-[0.25em] uppercase hover:text-[#C5A059] transition-colors flex items-center gap-2 ${onDark ? 'text-[#F7EFE3]/50' : 'text-[#7A5C41]/60'}`}
                    >
                      View all
                      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </Link>
                  </div>
                  
                  <div className="w-full">
                    <ItemGrid>
                      {sub.items.map((item, iIdx) => (
                        <Link 
                          key={iIdx} 
                          to={item.url}
                          className="group flex flex-col"
                        >
                          <div className={`relative ${section.aspect || 'aspect-[3/4]'} overflow-hidden bg-[#F9F6F2] ring-1 ring-black/5 transition-shadow duration-700 group-hover:shadow-[0_24px_60px_-24px_rgba(61,43,31,0.5)] ${section.shape}`}>
                            <img
                              loading="lazy"
                              decoding="async"
                              src={item.img}
                              alt={item.name}
                              className="w-full h-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.06]"
                            />
                          </div>

                          {/* Caption below the card, never over it. Overlaying meant
                              laying a dark gradient across the lower half of every
                              photograph to keep the text legible, which muddied the
                              garment. The jewellery row read better than the rest for
                              exactly this reason — its caption already sat underneath. */}
                          <div className="mt-4 text-center">
                            <p
                              className={`text-[8px] sm:text-[9px] tracking-[0.3em] font-bold mb-1 uppercase ${
                                onDark ? 'text-[#C5A059]' : 'text-[#B08D57]'
                              }`}
                            >
                              {item.sub}
                            </p>
                            <h4
                              className={`font-editorial text-base sm:text-lg font-bold leading-tight transition-colors ${
                                onDark ? 'text-[#F7EFE3] group-hover:text-[#C5A059]' : 'text-[#3D2B1F] group-hover:text-[#B08D57]'
                              }`}
                            >
                              {item.name}
                            </h4>
                            <span
                              className="block h-[2px] w-0 group-hover:w-10 mx-auto mt-2.5 transition-all duration-500"
                              style={{ background: onDark ? '#C5A059' : '#B08D57' }}
                            />
                          </div>
                        </Link>
                      ))}
                    </ItemGrid>
                  </div>
                </div>
              ))}
          </div>
        </section>
        );
      })}
    </>
  );
};

export default CategoryShowcase;
