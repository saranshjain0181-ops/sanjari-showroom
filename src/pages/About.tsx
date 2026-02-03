import { motion } from 'framer-motion';
import { ShieldCheck, Star, Users, MapPin } from 'lucide-react';
import FloatingNav from '@/components/navigation/FloatingNav';
import Footer from '@/components/layout/Footer';
import ContactSection from '@/components/sections/ContactSection';

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      
      {/* HERO BANNER */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-black/90">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/80 to-background z-10" />
        {/* You can add a background image here if you want */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
        
        <div className="relative z-20 text-center px-4">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#D4AF37] font-sans text-sm font-bold tracking-[0.3em] uppercase block mb-4"
          >
            Since 2010
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-5xl md:text-7xl text-white mb-6"
          >
            The Sanjari Legacy
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 max-w-2xl mx-auto text-lg font-light leading-relaxed"
          >
            Indore's premier destination for luxury fashion, curating exquisite collections for the whole family.
          </motion.p>
        </div>
      </section>

      {/* OUR STORY SECTION */}
      <section className="py-24 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="font-serif text-4xl text-foreground">Defining Elegance in Indore</h2>
            <div className="w-24 h-1 bg-[#D4AF37]" />
            <p className="text-muted-foreground leading-loose text-lg">
              Founded over a decade ago, <strong>Sanjari Fashion Store</strong> began with a simple mission: to bring world-class fashion to the heart of Madhya Pradesh. What started as a small boutique has grown into a landmark for style, quality, and sophistication.
            </p>
            <p className="text-muted-foreground leading-loose text-lg">
              We believe that clothing is not just about covering the body, but about expressing the soul. From traditional Sherwanis that tell stories of heritage to modern streetwear that speaks to the future, our collections are handpicked to make you stand out.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { icon: ShieldCheck, title: "Authentic Quality", desc: "100% Original Fabrics" },
              { icon: Star, title: "Premium Design", desc: "Curated Trends" },
              { icon: Users, title: "Family Focused", desc: "Men, Women & Kids" },
              { icon: MapPin, title: "Central Location", desc: "Heart of Indore" },
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-secondary/30 rounded-xl border border-transparent hover:border-[#D4AF37]/30 transition-all text-center group">
                <item.icon className="w-8 h-8 mx-auto text-[#D4AF37] mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-serif text-lg mb-2">{item.title}</h3>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Reuse Contact Section (Good for About page too) */}
      <ContactSection />
      
      <Footer />
    </div>
  );
}
