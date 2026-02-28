import React, { useEffect } from 'react';
import {
  Hero,
  CinematicJourney,
  MarqueeBanner,
  BrandPhilosophy,
  ProductCollection,
  WeaversChronicles,
  EleganceSection,
  ShopTheLook,
  Newsletter,
  RecentlyViewed,
} from '../../components/archive';

const HomePage = () => {
  useEffect(() => {
    document.title = 'Angel Fashion Studio | Home';
  }, []);

  return (
    <main className="bg-champagne font-body selection:bg-gold selection:text-white">
      <Hero />
      <CinematicJourney />
      <MarqueeBanner />
      <BrandPhilosophy />
      <ProductCollection />
      <WeaversChronicles />
      <EleganceSection />
      <ShopTheLook />
      <Newsletter />
      <RecentlyViewed />
    </main>
  );
};

export default HomePage;
