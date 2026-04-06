import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  useEffect(() => {
    document.title = 'About | Angel Archive Heritage';
  }, []);

  return (
    <main>
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img alt="Intricate detail of artisan's hands working with gold zari thread on luxury fabric"
            className="w-full h-full object-cover brightness-90"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBK8YCY5t4bRLuufKriuDzblLKXumCgL1QGKP9AMobdunnlvat3jWDiKFFOA4ptHsOsP1PyKiX_59Yrp8PPFEVH1eKKpybKxYx1x3a4AwtOM6jOeFNE1jFlJEH4W5PLkuWV9U3Oko9QOJvkMYGEJ07BHvJ30wGwiD3L0Z78qe64qTWTXaT6tFevcztf9ATKpFDiMqgVvnx2LRIK-SBsTP349gd4fBahkI61pNjDaTlABrrkUCVgAM8biX_9N_rWxiZpUMzqtd6fjJY" />
          <div className="absolute inset-0 bg-espresso/20"></div>
        </div>
        <div className="relative z-10 w-full text-center px-8">
          <h2
            className="text-[22vw] font-editorial font-black leading-none text-white tracking-tighter uppercase drop-shadow-2xl">
            ABOUT
          </h2>
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
            <span className="text-[10px] font-bold tracking-[0.6em] text-white/80 uppercase">The Craftsmanship
              Archive</span>
            <span
              className="material-symbols-outlined animate-bounce text-white/60 text-3xl font-light">keyboard_double_arrow_down</span>
          </div>
        </div>
      </section>
      <section className="relative w-full h-[90vh] bg-chocolate overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 w-full h-full">
          <img alt="Model in lehenga walking through a royal corridor"
            className="w-full h-full object-cover opacity-60"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBi1wnjhK4qOjfkb80VGF0IuC5E1qGaFVrrnRKRpSjPk1nnNRFqyPkRSRGISN87lzBIputOQptvoh3tCcy5qCIbij1762gia4rJHW8KOC5XKsACOQ8ki_VqYYUtr6scumc2oUsNJc-KdWgbnpegItgvJePBLEdEsVoMSZ8FEooUNCGPSeTjp6qQDLh53C_b5Ms-Szy63vHqMzXINit5Yz7cv4pH5ghB0yxXL1jojp7MOzA1-z1etBt2oepFyBtHbFPabdFTTMa5aHo" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-chocolate/20 to-chocolate/80"></div>
        </div>
        <div className="relative z-10 text-center px-6">
          <span className="text-gold text-[10px] font-bold uppercase tracking-[0.8em] mb-6 block">CINEMATIC
            JOURNEY</span>
          <h2
            className="text-6xl lg:text-9xl font-editorial font-black text-champagne uppercase tracking-tighter mb-12">
            HERITAGE<br /><span className="italic font-light">IN MOTION</span>
          </h2>
          <div className="flex items-center justify-center gap-6">
            <button
              className="size-20 rounded-full border border-champagne/30 flex items-center justify-center text-champagne hover:bg-champagne hover:text-chocolate transition-all duration-500">
              <span className="material-symbols-outlined text-4xl fill-1">pause</span>
            </button>
          </div>
        </div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <div className="h-px w-24 bg-champagne/20"></div>
          <span className="text-[9px] font-bold tracking-[0.5em] text-white/40 uppercase">A Study of Royal
            Silhouettes</span>
          <div className="h-px w-24 bg-champagne/20"></div>
        </div>
      </section>
      <section className="py-48 bg-oatmeal overflow-hidden">
        <div className="container mx-auto px-8 lg:px-24">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
            <div className="w-full lg:w-3/5 order-2 lg:order-1">
              <div className="relative">
                <img alt="Exterior editorial shot of the elegant Angel Archive flagship boutique"
                  className="w-full aspect-[4/5] object-cover shadow-[40px_40px_0px_0px_#7A5C41]"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBi1wnjhK4qOjfkb80VGF0IuC5E1qGaFVrrnRKRpSjPk1nnNRFqyPkRSRGISN87lzBIputOQptvoh3tCcy5qCIbij1762gia4rJHW8KOC5XKsACOQ8ki_VqYYUtr6scumc2oUsNJc-KdWgbnpegItgvJePBLEdEsVoMSZ8FEooUNCGPSeTjp6qQDLh53C_b5Ms-Szy63vHqMzXINit5Yz7cv4pH5ghB0yxXL1jojp7MOzA1-z1etBt2oepFyBtHbFPabdFTTMa5aHo" />
                <div className="absolute -bottom-10 -right-10 bg-white p-8 border fine-line hidden lg:block">
                  <span className="font-barcode text-4xl block text-bronze/40">AUS-3000</span>
                  <span className="text-[10px] font-bold tracking-widest text-gold uppercase">EST. 1994
                    MELBOURNE</span>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-2/5 order-1 lg:order-2 space-y-12">
              <div className="space-y-6">
                <span className="text-gold text-[10px] font-bold uppercase tracking-[0.6em] block">SINCE
                  1994</span>
                <h2
                  className="text-6xl lg:text-8xl font-editorial font-black text-bronze leading-[0.9] uppercase">
                  OUR<br />STORY</h2>
              </div>
              <div className="space-y-12 pr-0 lg:pr-12">
                <p className="text-xl font-medium leading-loose text-bronze/90">
                  Born in the heart of India, Angel Archive began as a curated vision to preserve the
                  vanishing techniques of traditional South Asian artisanship while defining a new era of global luxury.
                </p>
                <p className="text-lg leading-loose text-bronze/70">
                  As a premier India-based archive, we specialize in high-fashion heritage that
                  transcends seasons. Our journey is one of preservation—archiving the techniques of
                  master weavers and reimagining them for the modern connoisseur. Every garment in our
                  collection is a testament to the enduring beauty of heritage textiles.
                </p>
                <div className="pt-12 border-t border-bronze/10">
                  <span className="text-[11px] font-bold tracking-[0.4em] uppercase text-gold">MELBOURNE —
                    SYDNEY — LONDON</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-48 bg-white/40">
        <div className="container mx-auto px-8 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
            <div className="space-y-16">
              <div className="space-y-8">
                <h3 className="text-4xl font-editorial font-bold text-bronze uppercase tracking-tight">The
                  Mission</h3>
                <blockquote className="text-4xl lg:text-5xl font-editorial font-light italic text-gold border-l-4 border-gold pl-8 my-16 leading-tight">
                  "To democratize high-fashion heritage by providing uncompromising quality and artisanal
                  craftsmanship at accessible price points."
                </blockquote>
              </div>
              <div className="grid grid-cols-2 gap-12 pt-12 border-t fine-line">
                <div>
                  <p className="text-3xl font-editorial font-bold text-gold">100%</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-bronze/50 mt-2">Ethical
                    Sourcing</p>
                </div>
                <div>
                  <p className="text-3xl font-editorial font-bold text-gold">200+</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-bronze/50 mt-2">Master
                    Artisans</p>
                </div>
              </div>
            </div>
            <div className="bg-oatmeal p-12 lg:p-20 space-y-12 border fine-line">
              <div className="space-y-4">
                <h3 className="text-4xl font-editorial font-bold text-bronze uppercase">Visit the Archive</h3>
                <div className="space-y-2">
                  <p className="text-lg text-bronze font-medium">Archival House, 124 Collins Street,<br />Melbourne VIC 3000,
                    Australia</p>
                </div>
              </div>
              <div
                className="aspect-video bg-sand/30 relative overflow-hidden border fine-line flex items-center justify-center">
                <div
                  className="absolute inset-0 opacity-20 bg-[radial-gradient(#7A5C41_1px,transparent_1px)] [background-size:20px_20px]">
                </div>
                <div className="relative flex flex-col items-center">
                  <div className="size-4 bg-bronze rounded-full animate-pulse"></div>
                  <div className="h-20 w-px bg-bronze/20 mt-2"></div>
                  <span className="text-[9px] font-bold uppercase tracking-widest mt-4 text-bronze">Point of
                    Heritage</span>
                </div>
              </div>
              <Link
                to="/contact"
                className="w-full block text-center py-6 border border-bronze text-bronze hover:bg-bronze hover:text-white transition-all text-[11px] font-bold uppercase tracking-[0.4em]">
                Book a Private Viewing
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="relative h-[110vh] w-full overflow-hidden bg-chocolate">
        <img alt="High-fashion couple in premium ethnic wear"
          className="w-full h-full object-cover opacity-90 brightness-75"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmFScEDPw2oVIyyffyDHGtZ8bLFCMmZ2Md_iA0IwUuIxH2bfx9aE7CBAWEeGKhSH_Llbmydvl3LOlMJk-eSOpqbQG-mMpXtC1Qn1N2BeIXpsD8hsnIH_ycl-iPRvndn3mh4jWysPSOpia-M62pBXqqOepa5XOXOTFhD76ggcu6bnWyiHYXafhH8UJbDjqKt3tGhQO0x-4VpcnolC_MunD_gXKojInRS6J2S8hpa0do1Tb2Sh2FWt3JB6okwH0lvrNlYwHnva3w3B4" />
        <div className="absolute top-24 left-1/2 -translate-x-1/2 text-center z-10">
          <h2 className="text-6xl lg:text-[7rem] font-editorial font-black text-champagne uppercase leading-[0.8]">
            SHOP THE LOOK
          </h2>
          <p className="text-gold text-[10px] font-bold uppercase tracking-[0.6em] mt-8">The Royal Archival Ensemble
          </p>
        </div>
        <div className="absolute top-[40%] left-[35%] shop-hotspot">
          <button
            className="size-8 rounded-full bg-gold/80 backdrop-blur-sm border border-champagne/40 flex items-center justify-center text-champagne hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-sm font-bold">add</span>
          </button>
          <div
            className="hotspot-card absolute left-12 top-1/2 -translate-y-1/2 w-56 p-6 bg-white/10 backdrop-blur-2xl border border-white/20 opacity-0 -translate-y-2 pointer-events-none transition-all duration-500 shadow-2xl">
            <h4 className="text-champagne font-editorial font-bold text-lg mb-1">Archive Suite</h4>
            <p className="text-gold text-[9px] font-bold uppercase tracking-widest mb-3">Wedding Ensemble</p>
            <p className="text-white text-xl font-editorial">$1,280</p>
          </div>
        </div>
        <div className="absolute top-[55%] left-[65%] shop-hotspot">
          <button
            className="size-8 rounded-full bg-gold/80 backdrop-blur-sm border border-champagne/40 flex items-center justify-center text-champagne hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-sm font-bold">add</span>
          </button>
          <div
            className="hotspot-card absolute right-12 top-1/2 -translate-y-1/2 w-56 p-6 bg-white/10 backdrop-blur-2xl border border-white/20 opacity-0 -translate-y-2 pointer-events-none transition-all duration-500 shadow-2xl">
            <h4 className="text-champagne font-editorial font-bold text-lg mb-1">Velvet Overlay</h4>
            <p className="text-gold text-[9px] font-bold uppercase tracking-widest mb-3">Zari Handwork</p>
            <p className="text-white text-xl font-editorial">$645</p>
          </div>
        </div>
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
          <button
            className="px-16 py-8 bg-champagne text-chocolate font-bold text-[10px] uppercase tracking-[0.5em] hover:bg-gold transition-all duration-700 rounded-full">
            Add All To Concierge
          </button>
        </div>
      </section>
      <section className="bg-oatmeal py-64 px-12 lg:px-24 relative overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-editorial font-black text-bronze/5 pointer-events-none select-none uppercase tracking-tighter">
          HERITAGE
        </div>
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-7xl lg:text-[11rem] font-editorial font-black text-bronze uppercase mb-20 leading-none">
            STAY CONNECTED
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="relative group">
              <input
                className="w-full bg-transparent border-b-2 border-bronze/10 py-16 px-8 text-2xl lg:text-6xl font-editorial text-bronze placeholder:text-bronze/10 focus:outline-none focus:border-gold transition-colors"
                placeholder="YOUR EMAIL ADDRESS" type="email" />
              <button
                className="absolute right-6 top-1/2 -translate-y-1/2 size-28 rounded-full bg-gold text-white flex items-center justify-center hover:bg-bronze transition-all shadow-2xl group-hover:scale-105 duration-700">
                <span className="material-symbols-outlined text-5xl">east</span>
              </button>
            </div>
            <p className="text-[13px] font-bold uppercase tracking-[0.8em] mt-24 text-gold">Exclusive access to
              heritage drops</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
