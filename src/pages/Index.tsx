import { useEffect } from "react"; // 👈 Added this
import { supabase } from "@/integrations/supabase/client"; // 👈 Added this
import HeroSection from '@/components/hero/HeroSection';
import VideoShowcase from '@/components/sections/VideoShowcase';
import CampaignTapes from '@/components/sections/CampaignTapes';
import ProductGrid from '@/components/sections/ProductGrid';
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/layout/Footer';
import FloatingNav from '@/components/navigation/FloatingNav';

const Index = () => {
  
  // 👇 This runs once when the page loads
  useEffect(() => {
    const countView = async () => {
      // Calls the 'increment_views' function we made in SQL
      await supabase.rpc('increment_views'); 
    };
    countView();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      <HeroSection />
      <VideoShowcase />
      <CampaignTapes />
      <ProductGrid />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
