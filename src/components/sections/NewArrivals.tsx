import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Loader2, Play } from 'lucide-react';

export default function NewArrivals() {
  // Fetch only the videos you uploaded to Supabase
  const { data: videos, isLoading } = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_videos')
        .select('*')
        .order('created_at', { ascending: false }) // Newest uploads first
        .limit(8); // Show the latest 8 videos
      
      if (error) throw error;
      return data || [];
    },
  });

  // If loading, show spinner
  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // If you haven't uploaded any videos yet, HIDE the section completely
  if (!videos || videos.length === 0) return null;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-sans text-sm font-semibold tracking-[0.3em] uppercase">
            Latest Drops
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mt-2">
            NEW ARRIVALS
          </h2>
          <div className="divider-warm w-24 mx-auto mt-4" />
        </motion.div>

        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative aspect-[9/16] rounded-xl overflow-hidden shadow-lg bg-black"
            >
              {/* Show Thumbnail if available, else Autoplay Video */}
              {video.thumbnail_url ? (
                <img 
                  src={video.thumbnail_url} 
                  alt={video.title} 
                  className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <video
                  src={video.video_url}
                  className="w-full h-full object-cover opacity-90"
                  muted
                  playsInline
                  loop
                  autoPlay // Auto-play so users see the movement immediately
                />
              )}

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />

              {/* Title on Hover */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <h3 className="font-serif text-white text-xl text-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  {video.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
