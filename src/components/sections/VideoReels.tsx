import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { Play, VolumeX, Video } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ContentVideo {
  id: string;
  title: string;
  video_url: string;
  thumbnail_url: string | null;
  display_order: number;
}

export default function VideoReels() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement }>({});

  const { data: videos, isLoading } = useQuery({
    queryKey: ['content-videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_videos' as any)
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return (data as unknown as ContentVideo[]) || [];
    },
  });

  const handleVideoClick = (id: string) => {
    const video = videoRefs.current[id];
    if (video) {
      if (playingId === id) {
        video.pause();
        setPlayingId(null);
      } else {
        // Pause any currently playing video
        if (playingId && videoRefs.current[playingId]) {
          videoRefs.current[playingId].pause();
        }
        video.play();
        setPlayingId(id);
      }
    }
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  if (!videos || videos.length === 0) {
    return null; // Don't render section if no videos
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary font-sans text-sm font-semibold tracking-[0.3em] uppercase">
            What's Trending
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mt-2">
            NEW ARRIVALS
          </h2>
          <div className="divider-warm w-24 mx-auto mt-4" />
        </motion.div>

        {/* Horizontal Scroll Container */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
        >
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex-shrink-0 snap-center"
              onMouseEnter={() => setHoveredId(video.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div 
                className={`
                  video-reel relative w-[280px] md:w-[320px] aspect-[9/16] 
                  transition-transform duration-500 cursor-pointer
                  ${hoveredId === video.id ? 'scale-[1.02]' : ''}
                `}
                onClick={() => handleVideoClick(video.id)}
              >
                {/* Video */}
                <video
                  ref={(el) => {
                    if (el) videoRefs.current[video.id] = el;
                  }}
                  src={video.video_url}
                  poster={video.thumbnail_url || undefined}
                  className="w-full h-full object-cover rounded-xl"
                  loop
                  muted
                  playsInline
                />
                
                {/* Overlay */}
                <div className={`
                  absolute inset-0 bg-gradient-to-t from-jet/80 via-transparent to-transparent rounded-xl
                  transition-opacity duration-300
                  ${playingId === video.id ? 'opacity-0' : hoveredId === video.id ? 'opacity-100' : 'opacity-70'}
                `} />

                {/* Play Button */}
                {playingId !== video.id && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ 
                      scale: hoveredId === video.id ? 1 : 0.9,
                      opacity: hoveredId === video.id ? 1 : 0.7
                    }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-gold hover:bg-primary transition-colors">
                      <Play className="w-7 h-7 text-primary-foreground ml-1" />
                    </div>
                  </motion.div>
                )}

                {/* Title */}
                <div className={`absolute bottom-4 left-4 right-4 transition-opacity ${playingId === video.id ? 'opacity-0' : 'opacity-100'}`}>
                  <h3 className="font-serif text-xl text-white">
                    {video.title}
                  </h3>
                  <p className="text-white/70 text-sm font-sans mt-1">
                    Tap to {playingId === video.id ? 'pause' : 'play'}
                  </p>
                </div>

                {/* Mute Indicator */}
                <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                  <VolumeX className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
