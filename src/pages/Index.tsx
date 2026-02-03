import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import HeroSection from '@/components/hero/HeroSection';
import VideoShowcase from '@/components/sections/VideoShowcase'; // <--- The fixed section
import VideoReels from '@/components/sections/VideoReels';       // <--- Your reels
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
      
      {/* 1. Visual Stories (Now with working Volume Buttons) */}
      <VideoShowcase />
      
      {/* 2. Video Reels (Kept exactly as before) */}
      <VideoReels />
      
      {/* Note: The 'NewArrivals' section is intentionally removed */}
      
      <ProductGrid />
      <ContactSection />
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default Index;
