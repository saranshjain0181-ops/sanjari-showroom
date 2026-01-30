import { motion } from 'framer-motion';
import { Play, Volume2, VolumeX } from 'lucide-react';
import { useState, useRef } from 'react';

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="relative w-full h-[70vh] min-h-[500px] overflow-hidden bg-muted">
      {/* Video Container - Placeholder for now */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-muted to-secondary">
        {/* Placeholder Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-6 px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto"
            >
              <Play className="w-10 h-10 text-primary ml-1" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="text-primary font-sans text-sm font-semibold tracking-[0.3em] uppercase">
                Coming Soon
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground mt-2">
                BRAND VIDEO
              </h2>
              <p className="text-muted-foreground font-sans text-lg mt-4 max-w-md mx-auto">
                Experience the artistry and craftsmanship behind our collections
              </p>
            </motion.div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Hidden Video Element - Ready for future use */}
      <video
        ref={videoRef}
        className="hidden"
        loop
        muted={isMuted}
        playsInline
        poster=""
      >
        {/* Add video source when available */}
        {/* <source src="/videos/brand-video.mp4" type="video/mp4" /> */}
      </video>

      {/* Controls Overlay - Hidden until video is added */}
      <div className="absolute bottom-8 right-8 flex gap-3 opacity-0 pointer-events-none">
        <button
          onClick={handlePlayClick}
          className="p-3 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
        >
          <Play className={`w-5 h-5 ${isPlaying ? 'hidden' : 'block'}`} />
        </button>
        <button
          onClick={toggleMute}
          className="p-3 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>
    </section>
  );
}
