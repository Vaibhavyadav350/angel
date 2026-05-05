import React, { useEffect } from 'react';
import HeroSection from '../../components/home/HeroSection';
import ShopByCategory from '../../components/home/ShopByCategory';
import NewArrivalsGrid from '../../components/home/NewArrivalsGrid';
import OccasionsStrip from '../../components/home/OccasionsStrip';
import SaleBanner from '../../components/home/SaleBanner';
import TrustNewsletter from '../../components/home/TrustNewsletter';
import CategoryShowcase from '../../components/home/CategoryShowcase';
import CustomerDiaries from '../../components/home/CustomerDiaries';
import CircularCategories from '../../components/home/CircularCategories';
import HorizontalLookbook from '../../components/home/HorizontalLookbook';

const HomePage = () => {
  useEffect(() => {
    document.title = 'Angel Fashion Studio | Luxury Bridal & Festive Wear';
  }, []);

  return (
    <div className="bg-champagne selection:bg-[#3D2B1F] selection:text-white">
      <main>
        {/* 1. Hero Banner */}
        <HeroSection />
        
        {/* 2. Circular Categories (Restored) */}
        <CircularCategories />

        {/* 3. The Heritage Collection (Dynamic Product Grid) */}
        {/* <div className="bg-[#F5EFE4]">
          <NewArrivalsGrid />
        </div> */}

        {/* 4. The Discovery Series (New Static Editorial Sections) */}
        {/* These appear AFTER Heritage Collection as requested, with smaller images */}
        <CategoryShowcase />

        {/* 5. Dynamic Lookbooks (Restored) */}
        <HorizontalLookbook 
          title="The Sherwani Edit" 
          category="Men" 
          subCategory="SHERWANIS" 
          bgColor="bg-[#FFFCF9]"
        />
        <HorizontalLookbook 
          title="The Kurta Edit" 
          category="Men" 
          subCategory="KURTAS" 
          bgColor="bg-[#F5EFE4]"
        />
        <HorizontalLookbook 
          title="The Salwar Lookbook" 
          category="Women" 
          subCategory="Salwar Kameez" 
          bgColor="bg-[#FFFCF9]"
        />
        <HorizontalLookbook 
          title="The Lehenga Edit" 
          category="Women" 
          subCategory="Lehengas" 
          bgColor="bg-[#F5EFE4]"
        />
        <HorizontalLookbook 
          title="The Saree Edit" 
          category="Women" 
          subCategory="Sarees" 
          bgColor="bg-[#FFFCF9]"
        />
        <HorizontalLookbook 
          title="The Jewelry Edit" 
          category="Jewelry" 
          bgColor="bg-[#F5EFE4]"
        />

        {/* 6. Shop by Occasion (Editorial Accordion) */}
        <div className="hidden md:block bg-[#FFFCF9]">
          <OccasionsStrip />
        </div>

        {/* 7. Customer Diaries (Social Proof) */}
        <CustomerDiaries />

        {/* 8. Quick Directory (Arch Layout) */}
        <div className="bg-[#F5EFE4]">
          <ShopByCategory />
        </div>

        {/* 9. Sale Archive & Trust Bar */}
        <SaleBanner />
        <TrustNewsletter />
      </main>
    </div>
  );
};

export default HomePage;
