import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { Play, Volume2, VolumeX } from 'lucide-react';

const campaigns = [
  {
    id: 1,
    title: 'Summer Collection',
    thumbnail: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=700&fit=crop',
  },
  {
    id: 2,
    title: 'Wedding Season',
    thumbnail: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=700&fit=crop',
  },
  {
    id: 3,
    title: 'Kids Fashion',
    thumbnail: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&h=700&fit=crop',
  },
];

export default function CampaignTapes() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary font-sans text-sm font-semibold tracking-[0.3em] uppercase">
            What's Trending
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mt-2">
            NEW ARRIVALS
          </h2>
          <div className="divider-warm w-24 mx-auto mt-4" />
        </motion.div>

        {/* Horizontal Scroll Container */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
        >
          {campaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex-shrink-0 snap-center"
              onMouseEnter={() => setHoveredId(campaign.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div 
                className={`
                  video-reel relative w-[280px] md:w-[320px] aspect-[9/16] 
                  transition-transform duration-500
                  ${hoveredId === campaign.id ? 'scale-[1.02]' : ''}
                `}
              >
                {/* Thumbnail/Video */}
                <img
                  src={campaign.thumbnail}
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay */}
                <div className={`
                  absolute inset-0 bg-gradient-to-t from-jet/80 via-transparent to-transparent
                  transition-opacity duration-300
                  ${hoveredId === campaign.id ? 'opacity-100' : 'opacity-70'}
                `} />

                {/* Play Button */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ 
                    scale: hoveredId === campaign.id ? 1 : 0.9,
                    opacity: hoveredId === campaign.id ? 1 : 0.7
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-gold cursor-pointer hover:bg-primary transition-colors">
                    <Play className="w-7 h-7 text-primary-foreground ml-1" />
                  </div>
                </motion.div>

                {/* Title */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-serif text-xl text-white">
                    {campaign.title}
                  </h3>
                  <p className="text-white/70 text-sm font-sans mt-1">
                    Tap to view lookbook
                  </p>
                </div>

                {/* Mute Button */}
                <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                  <VolumeX className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
