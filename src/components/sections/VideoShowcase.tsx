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
      {/* THE BIG VIDEO (Replaced with your Vimeo Link) */}
      <video
        ref={videoRef}
        autoPlay
        muted={isMuted}
        loop
        playsInline
        // h-screen forces it to be the full height of your monitor/phone
        className="w-full h-screen object-cover"
      >
        {/* Using the high-quality Vimeo link from your previous collection */}
        <source 
          src="https://player.vimeo.com/external/459389137.sd.mp4?s=964dc90264fb8ba390c80059180fb42153588260&profile_id=164&oauth2_token_id=57447761" 
          type="video/mp4" 
        />
      </video>

      {/* VOLUME BUTTON */}
      <button 
        onClick={toggleMute}
        className="absolute bottom-10 right-10 z-30 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all duration-300 border border-white/20 hover:scale-110"
        aria-label={isMuted ? "Unmute video" : "Mute video"}
      >
        {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
      </button>
      
      {/* Gradient Overlay (Optional: Makes the video fade into the next section slightly) */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
