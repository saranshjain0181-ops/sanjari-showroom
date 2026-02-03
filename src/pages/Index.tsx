import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import HeroSection from '@/components/hero/HeroSection';
import VideoShowcase from '@/components/sections/VideoShowcase'; // The Big Video (Full Screen)
import NewArrivals from '@/components/sections/NewArrivals';     // The Yellow Button Grid (Dynamic)
import ProductGrid from '@/components/sections/ProductGrid';
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/layout/Footer';
import FloatingNav from '@/components/navigation/FloatingNav';
import ChatWidget from '@/components/chat/ChatWidget';

const Index = () => {
  useEffect(() => {
    const countView = async () => {
      await supabase.rpc('increment_views' as any);
    };
    countView();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      <HeroSection />
      
      {/* 1. Big Attraction Video */}
      <VideoShowcase /> 

      {/* 2. Your Uploaded Videos (Yellow Button Style) */}
      <NewArrivals />   

      <ProductGrid />
      <ContactSection />
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default Index;
