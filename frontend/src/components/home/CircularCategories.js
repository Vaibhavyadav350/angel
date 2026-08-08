import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import taxonomy from '../../utils/taxonomy.json';
import { products_url } from '../../utils/constants';

/**
 * Shop by Cloth.
 *
 * Circles rather than editorial tiles is a deliberate choice — there is no
 * portrait photography to fill tall rectangles, and a circular crop is far more
 * forgiving of mixed source imagery.
 *
 * Every cloth in the taxonomy is shown, whether or not the catalogue currently
 * has something tagged with it — these are cloths the studio carries, and the
 * row is the house's range, not a live stock report.
 *
 * Catalogue counts are still fetched, but only to ORDER the row: cloths with
 * pieces behind them lead, and the ones waiting to be tagged fall to the end of
 * the scroll. A shopper's first click therefore lands somewhere with products,
 * without any circle being hidden or labelled as empty.
 *
 * The row renders immediately in taxonomy order and re-sorts once counts arrive,
 * so a failed or slow request costs nothing.
 */
const FABRIC_IMAGES = {
    'A-Line': '/assets/landing/circ-aline.jpg',
    Fishtail: '/assets/landing/circ-fishtail.jpg',
    Banarasi: '/assets/landing/circ-banarasi.jpg',
    Silk: '/assets/landing/circ-silk.jpg',
    Velvet: '/assets/landing/circ-velvet.jpg',
    Georgette: '/assets/landing/circ-georgette.jpg',
    Net: '/assets/landing/circ-net.jpg',
    Organza: '/assets/landing/circ-organza.jpg',
};

const mappingKey = (label) => `circular_${label.toLowerCase().replace('-', '')}`;

const CircularCategories = () => {
    const [counts, setCounts] = useState({});

    useEffect(() => {
        let live = true;
        axios
            .get(`${products_url}/fabric-counts`)
            .then(({ data }) => {
                if (live) setCounts(data?.counts || {});
            })
            .catch(() => {
                /* Ordering is a refinement, not a requirement — keep taxonomy order. */
            });
        return () => {
            live = false;
        };
    }, []);

    const categories = (taxonomy.fabrics || [])
        .map((label, i) => ({
            label,
            img: FABRIC_IMAGES[label],
            order: i,
            stocked: (counts[label] || 0) > 0,
            link: `/products${taxonomy.landing_page_mappings?.[mappingKey(label)] || `?fabric=${encodeURIComponent(label)}`}`,
        }))
        // Stocked first; taxonomy order preserved within each group.
        .sort((a, b) => Number(b.stocked) - Number(a.stocked) || a.order - b.order);

    return (
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
};

export default CircularCategories;
