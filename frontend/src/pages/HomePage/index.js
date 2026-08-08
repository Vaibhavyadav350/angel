import React, { useEffect } from 'react';
import HeroSection from '../../components/home/HeroSection';
import ShopByCategory from '../../components/home/ShopByCategory';
import OccasionsStrip from '../../components/home/OccasionsStrip';
import TrustNewsletter from '../../components/home/TrustNewsletter';
import CategoryShowcase from '../../components/home/CategoryShowcase';
import CustomerDiaries from '../../components/home/CustomerDiaries';
import CircularCategories from '../../components/home/CircularCategories';
import PromiseMarquee from '../../components/home/PromiseMarquee';

const HomePage = () => {
  useEffect(() => {
    document.title = 'Angel Fashion Studio | Luxury Bridal & Festive Wear';
  }, []);

  return (
    <div className="bg-champagne selection:bg-[#3D2B1F] selection:text-white">
      <main>
        {/* 1. Hero Banner */}
        <HeroSection />
        
        {/* 2. Circular Categories */}
        <PromiseMarquee />

        <CircularCategories />

        {/* 3. The Discovery Series (Static Editorial Sections) */}
        <CategoryShowcase />

        {/* 4. Shop by Occasion (Editorial Accordion) */}
        <div className="hidden md:block bg-[#FFFCF9]">
          <OccasionsStrip />
        </div>

        {/* 5. Customer Diaries (Social Proof) */}
        <CustomerDiaries />

        {/* 6. Quick Directory (Arch Layout) */}
        <div className="bg-[#F5EFE4]">
          <ShopByCategory />
        </div>

        {/* 7. Trust Bar */}
        <TrustNewsletter />
      </main>
    </div>
  );
};

export default HomePage;
