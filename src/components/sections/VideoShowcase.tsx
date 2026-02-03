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
    <section className="w-full bg-black relative">
      {/* THE BIG VIDEO */}
      <video
        ref={videoRef}
        autoPlay
        muted={isMuted} // Controlled by state
        loop
        playsInline
        className="w-full h-auto max-h-screen object-cover"
      >
        <source src="/brand-showcase.mp4" type="video/mp4" />
      </video>

      {/* VOLUME BUTTON (Bottom Right) */}
      <button 
        onClick={toggleMute}
        className="absolute bottom-8 right-8 z-30 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all duration-300 border border-white/20"
        aria-label={isMuted ? "Unmute video" : "Mute video"}
      >
        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>
    </section>
  );
}
