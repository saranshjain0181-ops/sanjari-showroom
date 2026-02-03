import { useState, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function VideoShowcase() {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="w-full h-screen bg-black relative overflow-hidden">
      {/* YOUR CUSTOM VIDEO */}
      <video
        ref={videoRef}
        autoPlay
        muted={isMuted}
        loop
        playsInline
        // h-screen forces it to fill the ENTIRE screen (Cinematic)
        className="w-full h-screen object-cover"
      >
        {/* Linking to the file you added in the public folder */}
        <source src="/Clothing_Brand_Video_Generation.mp4" type="video/mp4" />
      </video>

      {/* VOLUME BUTTON */}
      <button 
        onClick={toggleMute}
        className="absolute bottom-10 right-10 z-30 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all duration-300 border border-white/20 hover:scale-110"
        aria-label={isMuted ? "Unmute video" : "Mute video"}
      >
        {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
      </button>
      
      {/* Optional: Dark gradient at bottom to make the button visible */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
    </section>
  );
}
