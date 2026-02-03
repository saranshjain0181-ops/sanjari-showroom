import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import HeroSection from '@/components/hero/HeroSection';
import VideoShowcase from '@/components/sections/VideoShowcase'; // <--- The Big Video
import NewArrivals from '@/components/sections/NewArrivals';     // <--- Your Drops
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
      
      {/* 1. Big Cinematic Video */}
      <VideoShowcase /> 

      {/* 2. New Arrivals (Uploaded from Admin) */}
      <NewArrivals />   

      {/* 3. Main Product Grid */}
      <ProductGrid />
      
      <ContactSection />
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default Index;
