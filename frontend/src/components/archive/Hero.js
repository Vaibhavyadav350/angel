import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

const heroCollections = [
  {
    title: "THE BRIDAL EDIT",
    subtitle: "Timeless Zardozi & Handloom Silk",
    imgPrimary: "/assets/landing/hero-lehenga.jpg",
    link: "/products?subCategory=Lehengas"
  },
  {
    title: "ROYAL DRAPES",
    subtitle: "Heritage Banarasi Sarees",
    imgPrimary: "/assets/landing/hero-saree.jpg",
    link: "/products?subCategory=Sarees"
  },
  {
    title: "MENS HERITAGE",
    subtitle: "Bespoke Silk Sherwanis",
    imgPrimary: "/assets/landing/hero-men.jpg",
    link: "/products?category=Men"
  }
];

const Hero = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const imageRef = useRef(null);

  // Parallax setup
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 1000], ['0%', '15%']);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIdx]);

  const handleNext = () => {
    gsap.to([titleRef.current, subtitleRef.current], {
      opacity: 0,
      y: 20,
      duration: 0.4,
      onComplete: () => {
        setActiveIdx((prev) => (prev + 1) % heroCollections.length);
        gsap.to([titleRef.current, subtitleRef.current], { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.2 });
      }
    });

    gsap.fromTo(imageRef.current,
      { scale: 1.05, opacity: 0.8 },
      { scale: 1, opacity: 1, duration: 1.5, ease: 'power2.out' }
    );
  };

  const handlePrev = () => {
    gsap.to([titleRef.current, subtitleRef.current], {
      opacity: 0,
      y: 20,
      duration: 0.4,
      onComplete: () => {
        setActiveIdx((prev) => (prev === 0 ? heroCollections.length - 1 : prev - 1));
        gsap.to([titleRef.current, subtitleRef.current], { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.2 });
      }
    });

    gsap.fromTo(imageRef.current,
      { scale: 1.05, opacity: 0.8 },
      { scale: 1, opacity: 1, duration: 1.5, ease: 'power2.out' }
    );
  };

  const active = heroCollections[activeIdx];

  return (
    <section className="relative w-full h-[100svh] overflow-hidden bg-chocolate">
      {/* Immersive Background Image with Parallax */}
      <motion.div
        className="absolute inset-x-0 top-0 bottom-[-20%] pointer-events-none"
        style={{ y: backgroundY }}
      >
        <img
          key={active.imgPrimary}
          ref={imageRef}
          src={active.imgPrimary}
          alt={active.title}
          className="w-full h-full object-cover object-top hardware-accelerated"
        />
        {/* Cinematic dark gradients for text readability, brightened for vibrancy */}
        <div className="absolute inset-0 bg-black/10 bg-gradient-to-t from-black/60 via-black/10 to-black/30"></div>
      </motion.div>

      {/* Massive Overland Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 w-full h-full z-10 pt-20">
        <div className="overflow-hidden">
          <p ref={subtitleRef} className="text-xs md:text-sm font-bold uppercase tracking-[0.5em] md:tracking-[0.8em] text-champagne/90 mb-4 md:mb-6 drop-shadow-md">
            {active.subtitle}
          </p>
        </div>
        <div className="overflow-hidden mb-12">
          <h2 ref={titleRef} className="text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-editorial font-black uppercase text-white drop-shadow-2xl leading-[0.8] tracking-tighter">
            {active.title}
          </h2>
        </div>

        <Link
          to={active.link}
          className="group flex flex-col items-center justify-center gap-3 mt-4"
        >
          <div className="h-12 w-px bg-white/50 group-hover:bg-gold transition-colors duration-500"></div>
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-white group-hover:text-gold transition-colors duration-500 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 group-hover:border-gold">
            Shop Collection
          </span>
        </Link>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-12 w-full px-8 md:px-24 flex justify-between items-center z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrev}
            className="size-12 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white hover:text-chocolate transition-colors backdrop-blur-md"
            aria-label="Previous slider"
          >
            <span className="material-symbols-outlined font-light">arrow_back</span>
          </button>
          <button
            onClick={handleNext}
            className="size-12 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white hover:text-chocolate transition-colors backdrop-blur-md"
            aria-label="Next slider"
          >
            <span className="material-symbols-outlined font-light">arrow_forward</span>
          </button>
        </div>

        {/* Dynamic Indicators */}
        <div className="flex gap-3">
          {heroCollections.map((_, i) => (
            <div
              key={i}
              className={`h-1 cursor-pointer transition-all duration-700 rounded-full ${i === activeIdx ? 'w-16 bg-white' : 'w-6 bg-white/30 hover:bg-white/60'}`}
              onClick={() => setActiveIdx(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
