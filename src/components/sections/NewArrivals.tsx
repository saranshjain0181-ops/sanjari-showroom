import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

// Sample data (You can add more or fetch from Supabase if you prefer)
const arrivals = [
  {
    id: 1,
    title: "Summer Collection Launch",
    src: "https://player.vimeo.com/external/459389137.sd.mp4?s=964dc90264fb8ba390c80059180fb42153588260&profile_id=164&oauth2_token_id=57447761",
    thumbnail: "/lovable-uploads/9c508856-2401-4e18-9c44-a1bb4556906e.png"
  },
  {
    id: 2,
    title: "Signature Saree Draping",
    src: "https://player.vimeo.com/external/459389952.sd.mp4?s=256245f90703c8112e7143d70781332360e227e7&profile_id=164&oauth2_token_id=57447761",
    thumbnail: "/lovable-uploads/b589535e-5939-476a-a59d-7e045623a90d.png"
  },
  {
    id: 3,
    title: "Behind the Scenes",
    src: "https://player.vimeo.com/external/459390347.sd.mp4?s=6a9690f9038304196340c46014432398c7929184&profile_id=164&oauth2_token_id=57447761",
    thumbnail: "/lovable-uploads/a4b03850-121e-4638-b818-a679dc205309.png"
  }
];

const VideoCard = ({ video, index }: { video: any, index: number }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false); // Start paused so user uses the button
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
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 group">
        <video
          ref={videoRef}
          src={video.src}
          className="w-full h-full object-cover"
          muted={isMuted}
          playsInline
          loop
          // Optional: Auto-play on hover if you prefer, currently manual via button
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
        <h3 className="font-serif text-xl text-foreground">{video.title}</h3>
      </div>
    </motion.div>
  );
};

export default function NewArrivals() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl text-foreground">New Arrivals</h2>
          <div className="divider-warm w-24 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {arrivals.map((video, index) => (
            <VideoCard key={video.id} video={video} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
