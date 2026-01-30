import HeroSection from '@/components/hero/HeroSection';
import VideoSection from '@/components/sections/VideoSection';
import CampaignTapes from '@/components/sections/CampaignTapes';
import ProductGrid from '@/components/sections/ProductGrid';
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/layout/Footer';
import FloatingNav from '@/components/navigation/FloatingNav';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      <HeroSection />
      <VideoSection />
      <CampaignTapes />
      <ProductGrid />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
