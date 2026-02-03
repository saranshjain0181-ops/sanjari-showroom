import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import HeroSection from '@/components/hero/HeroSection';
import VideoShowcase from '@/components/sections/VideoShowcase'; // <--- RESTORED
import VideoReels from '@/components/sections/VideoReels';       // <--- RESTORED
import NewArrivals from '@/components/sections/NewArrivals';     // <--- NEW DYNAMIC SECTION
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
      
      {/* 1. Your original video section (The one you wanted to keep) */}
      <VideoShowcase />
      
      {/* 2. Your original reels section */}
      <VideoReels />
      
      {/* 3. The NEW dynamic section (Only shows videos you upload in Admin) */}
      <NewArrivals />
      
      <ProductGrid />
      <ContactSection />
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default Index;
