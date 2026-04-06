import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { SectionContainer } from './shared';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const TheBridalEdit = () => {
    const sectionRef = useRef(null);
    const gridRef = useRef(null);

    useScrollAnimation({
        ref: gridRef,
        from: { y: 60, opacity: 0 },
        to: { y: 0, opacity: 1 },
        duration: 1.5,
        ease: 'power3.out',
        stagger: 0.15,
        contextRef: sectionRef
    });

    return (
        <SectionContainer ref={sectionRef} bgColor="bg-[#fbf9f6]" className="py-24 lg:py-40 overflow-hidden border-t border-bronze/10">
            <div className="container mx-auto px-4 lg:px-12 max-w-[1600px]">

                {/* Header Sequence */}
                <div className="text-center mb-20 lg:mb-32 flex flex-col items-center">
                    <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-gold block mb-6">
                        Haute Couture
                    </span>
                    <h2 className="text-6xl md:text-7xl lg:text-[8rem] font-editorial font-black text-bronze uppercase leading-[0.85] tracking-tighter">
                        The Bridal <span className="text-gold italic font-light block mt-2">Edit</span>
                    </h2>
                    <p className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-bronze/60 max-w-lg mt-10">
                        Exquisite hand-spun garments tailored for the modern bride. Available strictly through bespoke consultation.
                    </p>
                </div>

                {/* Staggered 3-Column Editorial Grid */}
                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">

                    {/* Left Column: Floating Details */}
                    <div className="md:col-span-3 flex flex-col gap-12 lg:mt-32">
                        <Link to="/products" className="group block relative overflow-hidden rounded-[30px] shadow-2xl bg-champagne aspect-[3/4]">
                            <img
                                src="/assets/landing/saree-2.jpg"
                                alt="Ivory Pearl Lehenga Detail"
                                className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-105 filter brightness-95 group-hover:brightness-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-chocolate/90 via-transparent to-transparent opacity-70 group-hover:opacity-100 transition-opacity"></div>
                            <div className="absolute bottom-6 left-6 right-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <h4 className="text-xl font-editorial font-bold text-champagne uppercase leading-tight">
                                    Ivory Pearl Lehenga
                                </h4>
                                <p className="text-[9px] font-bold tracking-widest text-gold mt-2 uppercase">₹1,85,000</p>
                            </div>
                        </Link>

                        <div className="bg-white p-8 lg:p-10 rounded-[30px] shadow-xl border border-bronze/10 text-center flex flex-col items-center">
                            <span className="material-symbols-outlined text-gold text-3xl mb-4">diamond</span>
                            <h4 className="text-lg font-editorial font-bold text-bronze uppercase mb-2">Master Craftsmanship</h4>
                            <p className="text-[10px] text-bronze/60 uppercase tracking-widest leading-loose">
                                400 Hours of Zardozi<br />
                                Pure Heirloom Silk<br />
                                Lifetime Guarantee
                            </p>
                        </div>
                    </div>

                    {/* Center Column: Massive Hero */}
                    <div className="md:col-span-6 md:-mt-24 lg:-mt-40 z-10 w-full">
                        <div className="relative aspect-[3/4] lg:aspect-[4/5] overflow-hidden rounded-[40px] lg:rounded-[60px] shadow-[0_30px_60px_rgba(122,92,65,0.2)] group cursor-pointer border-[1px] border-solid border-gold/10">
                            <img
                                src="/assets/landing/hero-lehenga.jpg"
                                alt="Premium Bridal Lehenga in Crimson Red - The Royal Zardozi"
                                className="w-full h-full object-cover object-top transition-transform duration-[4000ms] group-hover:scale-105"
                            />
                            {/* Inner glow frame */}
                            <div className="absolute inset-4 border border-gold/20 rounded-[24px] lg:rounded-[44px] pointer-events-none opacity-50"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-chocolate/80 via-chocolate/10 to-transparent opacity-80 decoration-slate-100 group-hover:opacity-95 transition-opacity duration-1000"></div>

                            <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center text-center transform group-hover:-translate-y-4 transition-transform duration-700">
                                <span className="bg-black/30 backdrop-blur-md px-6 py-2 rounded-full border border-gold/30 text-[9px] font-black uppercase tracking-[0.4em] text-champagne mb-6">
                                    The Featured Masterpiece
                                </span>
                                <h3 className="text-4xl md:text-5xl lg:text-6xl font-editorial font-black text-champagne uppercase drop-shadow-2xl">
                                    The Royal Zardozi
                                </h3>
                                <p className="text-xl lg:text-2xl font-editorial text-gold italic mt-4">
                                    ₹2,50,000
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Text & CTA */}
                    <div className="md:col-span-3 flex flex-col gap-12 lg:-mt-20">
                        <Link to="/products" className="group block relative overflow-hidden rounded-[30px] shadow-2xl bg-champagne aspect-[4/5]">
                            <img
                                src="/assets/landing/salwar-1.jpg"
                                alt="Emerald Velvet Drape Detail"
                                className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-105 filter brightness-95 group-hover:brightness-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-chocolate/90 via-transparent to-transparent opacity-70 group-hover:opacity-100 transition-opacity"></div>
                            <div className="absolute bottom-6 left-6 right-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <h4 className="text-xl font-editorial font-bold text-champagne uppercase leading-tight">
                                    Emerald Velvet Suite
                                </h4>
                                <p className="text-[9px] font-bold tracking-widest text-gold mt-2 uppercase">₹1,25,000</p>
                            </div>
                        </Link>

                        <div className="h-full flex items-center justify-center p-6">
                            <Link
                                to="/products"
                                className="group flex flex-col items-center gap-6"
                            >
                                <div className="size-24 rounded-full border border-gold/40 flex items-center justify-center group-hover:bg-gold transition-colors duration-700 shadow-xl overflow-hidden relative">
                                    <span className="material-symbols-outlined absolute transform group-hover:translate-x-12 transition-transform duration-500 text-bronze text-2xl">east</span>
                                    <span className="material-symbols-outlined absolute transform -translate-x-12 group-hover:translate-x-0 transition-transform duration-500 text-champagne text-2xl">east</span>
                                </div>
                                <span className="text-[10px] text-center font-bold uppercase tracking-[0.4em] text-bronze group-hover:text-gold transition-colors block">
                                    Explore <br /> Bridal Directory
                                </span>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </SectionContainer>
    );
};

export default TheBridalEdit;
