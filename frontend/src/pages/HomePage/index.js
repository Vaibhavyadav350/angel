import React, { useEffect } from 'react';
import {
  Hero,
  CinematicJourney,
  MarqueeBanner,
  BrandPhilosophy,
  CuratedOccasions,
  TheBridalEdit,
  ProductCollection,
  WeaversChronicles,
  EleganceSection,
  TrendingDresses,
  ClientDiaries,
  TrustSignals,
  ShopTheLook,
  Newsletter,
  RecentlyViewed,
  CategoryDirectory,
  NewArrivalsCarousel,
  CircularCategories,
  SalwarKameezLookbook,
  LehengaBento,
  SareeArchival,
} from '../../components/archive';

const HomePage = () => {
  useEffect(() => {
    document.title = 'Angel Fashion Studio | Home';
  }, []);

  // Static Mock Data to simulate Backend until ready (Allows visual testing)
  const salwarData = [
    { name: "Georgette Anarkali", material: "Pure Georgette", originalPrice: "₹18,500", price: "₹11,336", image: "/assets/landing/salwar-1.jpg", isBespoke: true },
    { name: "Art Silk Sequence", material: "Art Silk", originalPrice: "₹14,000", price: "₹9,186", image: "/assets/landing/salwar-2.jpg", isNew: true },
    { name: "Chiffon Palazzo Suit", material: "Luxe Chiffon", price: "₹10,500", image: "/assets/landing/salwar-3.jpg" },
    { name: "Organza Embroidered", material: "Organza & Net", price: "₹10,945", image: "/assets/landing/salwar-4.jpg", isBespoke: true },
  ];

  const lehengaData = [
    { name: "Sequines Lehenga", material: "Heavy Net", price: "₹16,500", image: "/assets/landing/lehenga-1.jpg", isNew: true, isBespoke: true },
    { name: "Floral Threadwork", material: "Raw Silk", price: "₹22,000", image: "/assets/landing/lehenga-2.jpg" },
    { name: "Bridal Zardozi", material: "Pure Velvet", originalPrice: "₹1,10,000", price: "₹85,000", image: "/assets/landing/lehenga-3.jpg", isBespoke: true },
    { name: "Mirror Work Lehenga", material: "Georgette", price: "₹18,200", image: "/assets/landing/lehenga-4.jpg" },
  ];

  const sareeData = [
    { name: "Banarasi Handloom", material: "Pure Silk", originalPrice: "₹45,000", price: "₹38,000", image: "/assets/landing/saree-1.jpg", isBespoke: true },
    { name: "Ruffle Drape", material: "Crepe Silk", price: "₹12,000", image: "/assets/landing/saree-2.jpg", isNew: true },
    { name: "Zari Border Silk", material: "Kanjeevaram", price: "₹55,000", image: "/assets/landing/saree-3.jpg", isBespoke: true },
    { name: "Sequin Cocktail Saree", material: "Net & Satin", price: "₹15,400", image: "/assets/landing/saree-4.jpg" },
  ];

  return (
    <>
      <main className="bg-champagne font-body selection:bg-gold selection:text-white">
        <Hero />
        <CircularCategories />
        <CategoryDirectory />

        <CinematicJourney />
        <MarqueeBanner />

        {/* New: The highest-tier bespoke showcase */}
        <TheBridalEdit />

        <BrandPhilosophy />

        {/* E-Commerce Expansion Sections */}
        <CuratedOccasions />

        {/* Bespoke Magazine Layouts for Core Categories */}
        <SalwarKameezLookbook products={salwarData} />
        <LehengaBento products={lehengaData} />
        <SareeArchival products={sareeData} />

        <NewArrivalsCarousel />
        <TrendingDresses />

        <ProductCollection />
        <WeaversChronicles />
        <EleganceSection />
        <ShopTheLook />

        {/* Social Proof */}
        <ClientDiaries />

        <Newsletter />
        <RecentlyViewed />

        {/* Pre-Footer Trust Signals Strip */}
        <TrustSignals />
      </main>
    </>
  );
};

export default HomePage;
