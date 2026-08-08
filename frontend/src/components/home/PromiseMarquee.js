import React from 'react';
import { Link } from 'react-router-dom';

/**
 * A slow band of house promises between the hero and the cloth strip.
 *
 * Every line here is verifiable against the shipping policy, the returns policy
 * or the store itself. Nothing invents an offer — a scrolling "extra 15% off"
 * that no coupon backs up is a consumer-law problem, not marketing.
 *
 * Motion is decorative, so it stops for anyone who prefers reduced motion and
 * pauses on hover for anyone still reading.
 */
const PROMISES = [
  'Free Regular Post Australia-wide on orders over $200',
  'Made to order and finished by hand',
  'Express Post — next day if ordered before 2pm AEST',
  'Sizes S to 2XL across the collection',
  'Visit the studio — Truganina, Melbourne',
  'Exchanges within 48 hours of delivery',
];

const PromiseMarquee = () => (
  <section
    aria-label="Store promises"
    className="bg-[#3D2B1F] text-[#F7E7CE] overflow-hidden border-y border-[#C5A059]/20"
  >
    <Link to="/shipping" className="block py-4 sm:py-5 group">
      <div className="flex whitespace-nowrap promise-track">
        {/* Rendered twice so the loop meets itself with no visible seam. */}
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
            {PROMISES.map((line) => (
              <span key={line} className="flex items-center">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.35em] px-8 sm:px-12">
                  {line}
                </span>
                <span className="text-[#C5A059] text-[9px]">◆</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </Link>

    <style>{`
      @keyframes promise-scroll {
        from { transform: translateX(0); }
        to   { transform: translateX(-50%); }
      }
      .promise-track {
        animation: promise-scroll 44s linear infinite;
        will-change: transform;
      }
      .group:hover .promise-track { animation-play-state: paused; }
      @media (prefers-reduced-motion: reduce) {
        .promise-track { animation: none; justify-content: center; }
      }
    `}</style>
  </section>
);

export default PromiseMarquee;
