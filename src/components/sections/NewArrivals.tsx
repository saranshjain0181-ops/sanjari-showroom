import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, Loader2 } from 'lucide-react';

// --- VIDEO CARD COMPONENT ---
const VideoCard = ({ video, index }: { video: any, index: number }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="flex flex-col gap-6"
    >
      {/* Video Container with Elegant Shadow */}
      <div className="relative aspect-[3/4] rounded-sm overflow-hidden bg-gray-100 group shadow-xl hover:shadow-2xl transition-all duration-500">
        <video
          ref={videoRef}
          src={video.video_url}
          poster={video.thumbnail_url || undefined}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          muted={isMuted}
          playsInline
          loop
        />

        {/* 1. VOLUME BUTTON (Top Right - Minimalist) */}
        <button
          onClick={toggleMute}
          className="absolute top-4 right-4 z-20 p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white/90 hover:text-white transition-all duration-300 border border-white/10"
          aria-label="Toggle mute"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        {/* 2. GOLD PLAY BUTTON (Centered & Glowing) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <button
            onClick={togglePlay}
            className="pointer-events-auto w-16 h-16 bg-[#D4AF37] hover:bg-[#C5A028] text-white rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-[#D4AF37]/40"
          >
            {isPlaying ? (
              <Pause size={24} className="fill-current" />
            ) : (
              <Play size={24} className="fill-current ml-1" />
            )}
          </button>
        </div>

        {/* Dark Overlay on Hover for better contrast */}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500 pointer-events-none" />
      </div>

      {/* 3. NAME BELOW (Luxury Typography) */}
      <div className="text-center space-y-2">
        <span className="text-xs font-sans tracking-[0.2em] text-muted-foreground uppercase opacity-80">
          Exclusive
        </span>
        <h3 className="font-serif text-2xl text-foreground capitalize tracking-wide">
          {video.title}
        </h3>
      </div>
    </motion.div>
  );
};

// --- MAIN SECTION ---
export default function NewArrivals() {
  const { data: videos, isLoading } = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_videos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <div className="py-32 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  if (!videos || videos.length === 0) return null;

  return (
    <section className="py-32 bg-background relative">
      {/* Background Decoration (Optional Subtle Gradient) */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-50 via-background to-background -z-10" />

      <div className="container mx-auto px-6">
        
        {/* --- ATTRACTIVE HEADING SECTION --- */}
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#D4AF37] font-sans text-xs font-bold tracking-[0.3em] uppercase block mb-4"
          >
            Fresh from the Atelier
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-5xl md:text-6xl text-foreground mb-6"
          >
            New Arrivals
          </motion.h2>
          
          {/* Gold Divider Line */}
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "100px" }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="h-[2px] bg-[#D4AF37] mx-auto mb-6"
          />

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground font-sans text-lg font-light leading-relaxed"
          >
            Discover our latest masterpieces, crafted with passion and designed for the modern connoisseur.
          </motion.p>
        </div>

        {/* --- VIDEO GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {videos.map((video, index) => (
            <VideoCard key={video.id} video={video} index={index} />
          ))}
        </div>

        {/* Bottom Spacing Element */}
        <div className="mt-24 text-center">
           <button className="px-8 py-3 border border-foreground/20 hover:border-foreground hover:bg-foreground hover:text-background transition-all duration-300 uppercase tracking-widest text-xs font-semibold">
              View All Collections
           </button>
        </div>
      </div>
    </section>
  );
}
