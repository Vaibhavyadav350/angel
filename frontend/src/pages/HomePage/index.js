import React, { useEffect } from 'react';
import HeroSection from '../../components/home/HeroSection';
import ShopByCategory from '../../components/home/ShopByCategory';
import NewArrivalsGrid from '../../components/home/NewArrivalsGrid';
import OccasionsStrip from '../../components/home/OccasionsStrip';
import SaleBanner from '../../components/home/SaleBanner';
import TrustNewsletter from '../../components/home/TrustNewsletter';
import HorizontalLookbook from '../../components/home/HorizontalLookbook';
import CircularCategories from '../../components/home/CircularCategories';
import CustomerDiaries from '../../components/home/CustomerDiaries';

const HomePage = () => {
  useEffect(() => {
    document.title = 'Angel Fashion Studio | Luxury Bridal & Festive Wear';
  }, []);

  return (
    <div className="bg-champagne selection:bg-[#3D2B1F] selection:text-white">
      {/* Content Layer */}
      <main>
        {/* Section 2: Hero */}
        <HeroSection />
        
        {/* Section 3: Circular Categories (Replaced Chips) */}
        <CircularCategories />

        {/* Section 4: Heritage Collection (Champagne) */}
        <div className="bg-[#F5EFE4]">
          <NewArrivalsGrid />
        </div>

        {/* Section 5: Salwar Kameez Lookbook (Light) */}
        <HorizontalLookbook 
          title="The Salwar Lookbook" 
          category="Women" 
          subCategory="Salwar Kameez" 
          bgColor="bg-[#FFFCF9]"
        />

        {/* Section 6: Lehenga Choli Lookbook (Champagne) */}
        <HorizontalLookbook 
          title="The Lehenga Edit" 
          category="Women" 
          subCategory="Lehengas" 
          bgColor="bg-[#F5EFE4]"
        />

        {/* Section 7: Saree Archival (Light) */}
        <HorizontalLookbook 
          title="The Saree Edit" 
          category="Women" 
          subCategory="Sarees" 
          bgColor="bg-[#FFFCF9]"
        />

        {/* Section 8: Jewelry Edit (Champagne) */}
        <HorizontalLookbook 
          title="The Jewelry Edit" 
          category="Jewelry" 
          bgColor="bg-[#F5EFE4]"
        />

        {/* Section 10: Shop By Category (Champagne) */}
        <div className="bg-[#F5EFE4]">
          <ShopByCategory />
        </div>

        {/* Section 11: Occasions (Light) */}
        <div className="bg-[#FFFCF9]">
          <OccasionsStrip />
        </div>

        {/* Section 12: Sale Banner (Dark) */}
        <SaleBanner />

        {/* Section 12.5: Customer Diaries (Stone/Light) */}
        <CustomerDiaries />

        {/* Section 13: Trust Bar & Newsletter (Light) */}
        <TrustNewsletter />
      </main>
    </div>
  );
};


export default HomePage;
