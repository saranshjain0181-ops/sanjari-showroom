import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, Loader2 } from 'lucide-react';

// --- COMPONENT: Individual Video Card ---
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="flex flex-col gap-4"
    >
      {/* Video Container */}
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 group shadow-lg">
        <video
          ref={videoRef}
          // CONNECTED TO DATABASE: Uses 'video_url' from your upload
          src={video.video_url} 
          poster={video.thumbnail_url || undefined}
          className="w-full h-full object-cover"
          muted={isMuted}
          playsInline
          loop
        />

        {/* 1. VOLUME BUTTON (Top Right) */}
        <button
          onClick={toggleMute}
          className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all duration-300"
          aria-label="Toggle mute"
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        {/* 2. YELLOW PLAY BUTTON (Centered) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <button
            onClick={togglePlay}
            className="pointer-events-auto w-14 h-14 bg-yellow-400 hover:bg-yellow-500 rounded-full flex items-center justify-center text-black shadow-lg transform transition-transform duration-300 hover:scale-110"
          >
            {isPlaying ? (
              <Pause size={24} className="fill-current" />
            ) : (
              <Play size={24} className="fill-current ml-1" />
            )}
          </button>
        </div>
      </div>

      {/* 3. NAME BELOW (Just below the video) */}
      <div className="text-center">
        <h3 className="font-serif text-xl text-foreground capitalize">
          {video.title}
        </h3>
      </div>
    </motion.div>
  );
};

// --- MAIN COMPONENT: Fetches Data from Supabase ---
export default function NewArrivals() {
  // FETCHING LOGIC: Connects to your 'content_videos' table
  const { data: videos, isLoading } = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_videos')
        .select('*')
        .order('created_at', { ascending: false }); // Show newest uploads first
      
      if (error) throw error;
      return data || [];
    },
  });

  // Loading State
  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // If you haven't uploaded videos, hide this section
  if (!videos || videos.length === 0) return null;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl text-foreground">New Arrivals</h2>
          <div className="divider-warm w-24 mx-auto mt-4" />
        </div>

        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video, index) => (
            <VideoCard key={video.id} video={video} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
