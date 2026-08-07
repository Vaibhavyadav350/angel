import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Shop by occasion.
 *
 * This section is not a product grid — it is the one place on the page that
 * sells a *moment* rather than a garment. So it should not look like the grids
 * either side of it.
 *
 * Three decisions carry that:
 *
 *  1. THE ARCH. Cards are arch-topped, referencing the jharokha and mihrab
 *     arches of the architecture this clothing belongs to. It is a shape with a
 *     reason, not a rounded corner picked from a menu — and it is the one
 *     silhouette a square-cropped photograph can be poured into without looking
 *     cropped.
 *
 *  2. AN ACCENT PER OCCASION, drawn from the occasion itself: bridal red,
 *     marigold for haldi, plum for festive, bronze for menswear. The colour
 *     comes from the content rather than being applied on top of it, and it
 *     gives four otherwise identical cards their own identity.
 *
 *  3. A STAGGERED BASELINE. Alternate cards sit lower, so the row reads as an
 *     editorial spread rather than four boxes in a line. This is what the old
 *     accordion was reaching for — visual interest — without hiding three of the
 *     four options to get it.
 */
const occasions = [
  {
    name: 'The Wedding Edit',
    image: '/assets/landing/occ-wedding.jpg',
    url: '/products?category=Women&subCategory=LEHENGAS',
    subtitle: 'Bridal Lehengas & Sarees',
    accent: '#8C2F39', // deep bridal red
  },
  {
    name: 'Haldi & Mehendi',
    image: '/assets/landing/occ-haldi.jpg',
    url: '/products?category=Women&subCategory=SALWAR+KAMEEZ',
    subtitle: 'Vibrant Traditions',
    accent: '#D99A0B', // marigold
  },
  {
    name: 'Festive Season',
    image: '/assets/landing/occ-evening.jpg',
    url: '/products?category=Women&subCategory=SAREES',
    subtitle: 'Contemporary Elegance',
    accent: '#6A4A7B', // plum
  },
  {
    name: 'Mens Heritage',
    image: '/assets/landing/occ-mens.jpg',
    url: '/products?category=Men&subCategory=SHERWANIS',
    subtitle: 'Classic Sherwanis',
    accent: '#A98B6B', // bronze
  },
];

const OccasionsStrip = () => (
  <section className="section-rhythm relative overflow-hidden bg-gradient-to-b from-[#FBF7F0] via-[#F7EFE3] to-[#FBF7F0]">
    {/* A single hairline arch behind the row — the same motif as the cards,
        drawn once at scale. Replaces the 25vw background word. */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-24 w-[min(1100px,90vw)] h-[520px] rounded-t-full border border-[#C5A059]/15"
    />

    <div className="max-w-[1500px] mx-auto px-5 sm:px-8 relative z-10">
      <div className="text-center mb-12 sm:mb-16">
        <p className="text-[#C5A059] text-[9px] sm:text-[10px] tracking-[0.5em] uppercase font-bold mb-3 sm:mb-4">
          Celebration Edits
        </p>
        <p className="font-editorial text-lg sm:text-2xl lg:text-3xl text-[#3D2B1F] tracking-tight">
          For the days that matter most.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {occasions.map((occ, idx) => (
          <Link
            key={occ.name}
            to={occ.url}
            className={`group block ${idx % 2 === 1 ? 'lg:mt-14' : ''}`}
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-t-full bg-[#F0E6D6] ring-1 ring-[#C5A059]/15 transition-shadow duration-700 group-hover:shadow-[0_24px_60px_-24px_rgba(61,43,31,0.45)]">
              <img
                src={occ.image}
                alt={occ.name}
                loading="lazy"
                decoding="async"
                width="600"
                height="800"
                className="w-full h-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.07]"
              />

              {/* Accent wash that only appears on hover, tinted to the occasion. */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-multiply"
                style={{ background: `linear-gradient(to top, ${occ.accent}, transparent 60%)` }}
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#3D2B1F]/70 to-transparent" />

              <span
                className="absolute top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold tracking-[0.35em] text-white/80"
                style={{ textShadow: '0 1px 6px rgba(0,0,0,.45)' }}
              >
                {`0${idx + 1}`}
              </span>
            </div>

            {/* Caption below the arch, so nothing sits over the garment. */}
            <div className="mt-4 sm:mt-5 text-center">
              <h3 className="font-editorial text-base sm:text-xl font-bold text-[#3D2B1F] leading-tight transition-colors duration-300 group-hover:text-[#8C2F39]">
                {occ.name}
              </h3>
              <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.28em] text-[#7A5C41]/55 mt-1.5">
                {occ.subtitle}
              </p>
              {/* The accent reveals itself on hover — the card's own colour. */}
              <span
                className="block h-[2px] w-0 group-hover:w-12 mx-auto mt-3 transition-all duration-500"
                style={{ background: occ.accent }}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default OccasionsStrip;
