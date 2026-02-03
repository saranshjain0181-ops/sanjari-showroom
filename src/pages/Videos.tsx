import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, Loader2 } from 'lucide-react';
import FloatingNav from '@/components/navigation/FloatingNav';
import Footer from '@/components/layout/Footer';

// --- VIDEO CARD COMPONENT ---
const VideoCard = ({ video, index }: { video: any; index: number }) => {
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
      <div className="relative aspect-[3/4] rounded-sm overflow-hidden bg-muted group shadow-xl hover:shadow-2xl transition-all duration-500">
        <video
          ref={videoRef}
          src={video.video_url}
          poster={video.thumbnail_url || undefined}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          muted={isMuted}
          playsInline
          loop
        />

        {/* Volume Button (Top Right) */}
        <button
          onClick={toggleMute}
          className="absolute top-4 right-4 z-20 p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white/90 hover:text-white transition-all duration-300 border border-white/10"
          aria-label="Toggle mute"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        {/* Gold Play Button (Centered) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <button
            onClick={togglePlay}
            className="pointer-events-auto w-16 h-16 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-110"
          >
            {isPlaying ? (
              <Pause size={24} className="fill-current" />
            ) : (
              <Play size={24} className="fill-current ml-1" />
            )}
          </button>
        </div>

        {/* Dark Overlay on Hover */}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500 pointer-events-none" />
      </div>

      {/* Video Title */}
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

// --- MAIN PAGE ---
export default function Videos() {
  const { data: videos, isLoading } = useQuery({
    queryKey: ['all-videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_videos')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />

      {/* Header */}
      <section className="pt-24 pb-12 bg-secondary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="text-primary font-sans text-xs font-bold tracking-[0.3em] uppercase block mb-4">
              Fresh from the Atelier
            </span>
            <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-4">
              Video Gallery
            </h1>
            <div className="h-[2px] w-24 bg-primary mx-auto mb-6" />
            <p className="text-muted-foreground font-sans text-lg max-w-2xl mx-auto">
              Explore our complete collection of exclusive fashion videos and behind-the-scenes content.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Video Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          {isLoading && (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          )}

          {!isLoading && videos?.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground font-sans text-lg">
                No videos available yet.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {videos?.map((video, index) => (
              <VideoCard key={video.id} video={video} index={index} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
