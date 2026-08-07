import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const slides = [
  {
    id: 1,
    image: '/assets/landing/hero_slide_1.jpg',
    label: 'HAUTE COUTURE',
    title: 'THE BRIDAL\nEDIT',
    cta: 'SHOP COLLECTION',
    url: '/products?category=Women&subCategory=LEHENGAS',
    align: 'left',
  },
  {
    id: 2,
    image: '/assets/landing/hero_slide_2.jpg',
    label: 'FESTIVE ARCHIVE',
    title: 'THE ROYAL\nSAREE',
    cta: 'EXPLORE NOW',
    url: '/products?category=Women&subCategory=SAREES',
    align: 'left',
  },
  {
    id: 3,
    image: '/assets/landing/hero_slide_3.jpg',
    label: 'MENS HERITAGE',
    title: 'THE REGAL\nGROOM',
    cta: 'VIEW CATALOG',
    url: '/products?category=Men',
    align: 'left',
  },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback((idx) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 400);
  }, [animating]);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: '100vh', minHeight: '600px' }}
      aria-label="Hero Banner"
    >
      {/* Background Image */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${animating ? 'opacity-0' : 'opacity-100'}`}
      >
        <img decoding="async"
          src={slide.image}
          alt={slide.title}
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div
        className={`relative z-10 h-full flex flex-col justify-end pb-16 md:pb-20 px-6 md:px-16 lg:px-24 transition-all duration-500 ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
      >
        {/* Label */}
        <p className="text-[10px] md:text-[11px] font-semibold tracking-[0.35em] text-[#C5A059] uppercase mb-3">
          {slide.label}
        </p>

        {/* Title */}
        <h1
          className="text-white font-bold leading-[0.9] mb-6 md:mb-8"
          style={{
            fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
            fontSize: 'clamp(2.25rem, 12vw, 7rem)',
            whiteSpace: 'pre-line',
          }}
        >
          {slide.title}
        </h1>

        {/* CTA Button */}
        <div>
          <Link
            to={slide.url}
            id={`hero-cta-${slide.id}`}
            className="inline-flex items-center gap-3 border border-white text-white text-[11px] font-semibold tracking-[0.3em] uppercase px-10 py-4 hover:bg-white hover:text-[#3D2B1F] transition-all duration-300 rounded-full"
          >
            {slide.cta}
            <span className="text-[14px]">→</span>
          </Link>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 right-8 md:right-16 z-10 flex items-center gap-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`transition-all duration-300 rounded-full ${i === current ? 'w-8 h-1.5 bg-[#C5A059]' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'}`}
          />
        ))}
      </div>

      {/* Arrow Controls — desktop only */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-white/40 text-white flex items-center justify-center hover:bg-white/20 transition-colors hidden md:flex"
      >
        <FiChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-white/40 text-white flex items-center justify-center hover:bg-white/20 transition-colors hidden md:flex"
      >
        <FiChevronRight size={20} />
      </button>

      {/* Slide Number */}
      <div className="absolute bottom-8 left-6 md:left-16 z-10 text-white/40 text-[11px] tracking-widest font-mono hidden md:block">
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>
    </section>
  );
};

export default HeroSection;
