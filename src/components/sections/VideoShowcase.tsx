import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Volume2, VolumeX } from 'lucide-react';

// --- 1. STATIC DATA (Your original video links) ---
const videos = [
  {
    id: 1,
    title: "Summer Collection Launch",
    category: "New Arrivals",
    src: "https://player.vimeo.com/external/459389137.sd.mp4?s=964dc90264fb8ba390c80059180fb42153588260&profile_id=164&oauth2_token_id=57447761",
    thumbnail: "/lovable-uploads/9c508856-2401-4e18-9c44-a1bb4556906e.png"
  },
  {
    id: 2,
    title: "Signature Saree Draping",
    category: "Tutorials",
    src: "https://player.vimeo.com/external/459389952.sd.mp4?s=256245f90703c8112e7143d70781332360e227e7&profile_id=164&oauth2_token_id=57447761",
    thumbnail: "/lovable-uploads/b589535e-5939-476a-a59d-7e045623a90d.png"
  },
  {
    id: 3,
    title: "Behind the Scenes",
    category: "Our Story",
    src: "https://player.vimeo.com/external/459390347.sd.mp4?s=6a9690f9038304196340c46014432398c7929184&profile_id=164&oauth2_token_id=57447761",
    thumbnail: "/lovable-uploads/a4b03850-121e-4638-b818-a679dc205309.png"
  }
];

// --- 2. SMART VIDEO COMPONENT (Handles Volume Independently) ---
const VideoItem = ({ video, index }: { video: any, index: number }) => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents clicking the video itself
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 }}
      className="group relative aspect-[4/5] md:aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer"
    >
      {/* Video Player */}
      <video
        ref={videoRef}
        src={video.src}
        poster={video.thumbnail}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        muted={isMuted}
        playsInline
        loop
        // Auto-play on hover
        onMouseOver={(e) => e.currentTarget.play()}
        onMouseOut={(e) => e.currentTarget.pause()}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />

      {/* --- VOLUME BUTTON (The Fix) --- */}
      <button 
        onClick={toggleMute}
        className="absolute top-4 right-4 z-30 p-3 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full text-white transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0"
        aria-label={isMuted ? "Unmute video" : "Mute video"}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      {/* Text Info */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end z-20">
        <div className="transform translate-y-8 group-hover:translate-y-0 transition-all duration-500">
          <span className="text-white/80 text-sm font-sans tracking-wider uppercase mb-2 block opacity-0 group-hover:opacity-100 transition-opacity delay-100">
            {video.category}
          </span>
          <h3 className="text-white text-2xl md:text-3xl font-serif mb-4">
            {video.title}
          </h3>
          <div className="flex items-center gap-3 text-white/90 opacity-0 group-hover:opacity-100 transition-opacity delay-200">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Play size={16} className="fill-current" />
            </div>
            <span className="text-sm font-semibold tracking-wider uppercase">Watch Now</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- 3. MAIN SECTION COMPONENT ---
const VideoShowcase = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-background to-transparent z-10" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50 mix-blend-multiply pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl opacity-50 mix-blend-multiply pointer-events-none" />

      <div className="container mx-auto px-4 relative z-20">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-sans text-sm font-semibold tracking-[0.3em] uppercase block mb-4"
          >
            Experience Sanjari
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-6xl text-foreground mb-6"
          >
            Visual Stories
          </motion.h2>
          <div className="divider-warm mx-auto" />
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {videos.map((video, index) => (
            <VideoItem key={video.id} video={video} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;
