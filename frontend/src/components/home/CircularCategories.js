import React from 'react';
import { Link } from 'react-router-dom';
import taxonomy from '../../utils/taxonomy.json';

/**
 * Fabric & silhouette rail.
 *
 * Kept as circles deliberately — there is no portrait photography available to
 * replace them with editorial tiles, and a circle crop is far more forgiving of
 * mixed source imagery than a tall rectangle would be.
 *
 * The refinements are about presentation, not structure:
 *   • a heading, so the row reads as a considered edit rather than a toolbar;
 *   • the flat black wash over every image is gone — it dulled the garments;
 *   • the row now PEEKS on mobile (it stops short of the edge) so it is obvious
 *     more exists to the right, without anything auto-scrolling;
 *   • larger, quieter type with more breathing room between items.
 *
 * Note for the client: these eight labels are fabric and silhouette names, but
 * the catalogue is not organised by fabric — each one points at the closest real
 * clothing type. Renaming them to match the catalogue is an open decision.
 */
const categories = [
    { label: 'A-Line', img: '/assets/landing/circ-aline.jpg', link: `/products${taxonomy.landing_page_mappings?.circular_aline || ''}` },
    { label: 'Fishtail', img: '/assets/landing/circ-fishtail.jpg', link: `/products${taxonomy.landing_page_mappings?.circular_fishtail || ''}` },
    { label: 'Banarasi', img: '/assets/landing/circ-banarasi.jpg', link: `/products${taxonomy.landing_page_mappings?.circular_banarasi || ''}` },
    { label: 'Silk', img: '/assets/landing/circ-silk.jpg', link: `/products${taxonomy.landing_page_mappings?.circular_silk || ''}` },
    { label: 'Velvet', img: '/assets/landing/circ-velvet.jpg', link: `/products${taxonomy.landing_page_mappings?.circular_velvet || ''}` },
    { label: 'Georgette', img: '/assets/landing/circ-georgette.jpg', link: `/products${taxonomy.landing_page_mappings?.circular_georgette || ''}` },
    { label: 'Net', img: '/assets/landing/circ-net.jpg', link: `/products${taxonomy.landing_page_mappings?.circular_net || ''}` },
    { label: 'Organza', img: '/assets/landing/circ-organza.jpg', link: `/products${taxonomy.landing_page_mappings?.circular_organza || ''}` },
];

const CircularCategories = () => (
    <section className="bg-white border-b border-[#F0E8DF] py-12 sm:py-16">
        <div className="max-w-[1500px] mx-auto">
            <div className="text-center px-5 mb-8 sm:mb-12">
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.5em] text-[#C5A059] block mb-3">
                    Shop by Cloth
                </span>
                <p className="font-editorial text-lg sm:text-2xl text-[#3D2B1F] tracking-tight">
                    Woven, draped, embroidered.
                </p>
            </div>

            {/*
              The row scrolls on small screens. `pr-12` leaves the last circle
              short of the edge so a sliver of empty space is always visible —
              the static cue that the row moves, replacing the auto-scroll.
            */}
            <div className="flex items-start gap-7 sm:gap-10 lg:gap-14 overflow-x-auto lg:overflow-visible lg:justify-center px-5 sm:px-8 pr-12 lg:pr-8 circ-scroll">
                {categories.map((cat) => (
                    <Link key={cat.label} to={cat.link} className="flex flex-col items-center gap-3.5 group shrink-0">
                        <div className="w-[76px] h-[76px] sm:w-[96px] sm:h-[96px] lg:w-[112px] lg:h-[112px] rounded-full overflow-hidden ring-1 ring-[#D4C5B5]/60 group-hover:ring-[#C5A059] transition-all duration-500">
                            <img
                                src={cat.img}
                                alt={cat.label}
                                loading="lazy"
                                decoding="async"
                                width="224"
                                height="224"
                                className="w-full h-full object-cover object-top transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                            />
                        </div>
                        <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.18em] uppercase text-[#3D2B1F]/60 group-hover:text-[#C5A059] transition-colors text-center whitespace-nowrap">
                            {cat.label}
                        </span>
                    </Link>
                ))}
            </div>
        </div>

        <style>{`
            .circ-scroll::-webkit-scrollbar { display: none; }
            .circ-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
    </section>
);

export default CircularCategories;
