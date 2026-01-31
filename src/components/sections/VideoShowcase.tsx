import { motion } from 'framer-motion';

export default function VideoShowcase() {
  return (
    <section className="relative w-full h-[80vh] overflow-hidden">
      {/* Fixed video container for parallax effect */}
      <div className="absolute inset-0 clip-path-inset">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover scale-110"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
          }}
        >
          <source
            src="https://res.cloudinary.com/dkj2btl6g/video/upload/v1769849448/WhatsApp_Video_2026-01-31_at_2.19.52_PM_soqr4a.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Overlay mask that creates the "window" effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          clipPath: 'inset(0)',
        }}
      >
        <div 
          className="fixed inset-0 w-full h-full"
          style={{ zIndex: -1 }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source
              src="https://res.cloudinary.com/dkj2btl6g/video/upload/v1769849448/WhatsApp_Video_2026-01-31_at_2.19.52_PM_soqr4a.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </div>

      {/* Subtle gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/20 pointer-events-none" />
      
      {/* Optional brand text overlay */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="text-center">
          <span className="font-sans text-sm font-semibold tracking-[0.4em] uppercase text-white/90 drop-shadow-lg">
            Crafted for the Modern Man
          </span>
        </div>
      </motion.div>
    </section>
  );
}
