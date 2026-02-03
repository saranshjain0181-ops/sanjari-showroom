import { motion } from 'framer-motion';
import { Suspense } from 'react';
import { Link } from 'react-router-dom';
import InteractiveCoin from '../3d/InteractiveCoin';
import heroImage from '@/assets/hero-store.jpg';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image with Warm Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        {/* Warm Golden-Orange Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsla(48,90%,60%,0.35)] to-[hsla(27,79%,50%,0.4)]" />
      </div>
      
      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20">
        {/* Brand Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-jet font-bold mb-4 text-luxury-shadow">
            Welcome to{' '}
            <span className="block mt-2 text-5xl md:text-7xl lg:text-8xl italic">
              Sanjari Fashion Store
            </span>
          </h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-lg md:text-xl lg:text-2xl text-jet/80 max-w-2xl mx-auto font-sans font-medium"
          >
            Discover exquisite collections for your family at Indore's premier fashion boutique.
          </motion.p>
        </motion.div>

        {/* Interactive 3D Coin */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="w-full max-w-lg"
        >
          <Suspense fallback={
            <div className="w-full h-[400px] flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-gold/30 animate-pulse" />
            </div>
          }>
            <InteractiveCoin />
          </Suspense>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="text-center text-jet/60 text-sm mt-2 font-sans"
          >
            ✨ Drag the coin to explore ✨
          </motion.p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-8"
        >
          <Link
            to="/collections"
            className="btn-gold inline-flex items-center gap-2 text-lg font-sans"
          >
            Explore Collections
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 8l4 4m0 0l-4 4m4-4H3" 
              />
            </svg>
          </Link>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 border-2 border-jet/40 rounded-full flex justify-center pt-2"
          >
            <div className="w-1.5 h-3 bg-jet/60 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
