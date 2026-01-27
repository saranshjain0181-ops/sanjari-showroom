import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Eye, Filter } from 'lucide-react';
import FloatingNav from '@/components/navigation/FloatingNav';
import Footer from '@/components/layout/Footer';
import { useState } from 'react';

const categories = ['All', 'Women', 'Men', 'Kids', 'Accessories'];

const allProducts = [
  { id: 1, name: 'Royal Silk Saree', category: 'Women', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&h=700&fit=crop' },
  { id: 2, name: 'Classic Sherwani', category: 'Men', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=650&fit=crop' },
  { id: 3, name: 'Designer Lehenga', category: 'Women', image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500&h=800&fit=crop' },
  { id: 4, name: 'Kids Party Wear', category: 'Kids', image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500&h=600&fit=crop' },
  { id: 5, name: 'Embroidered Kurta', category: 'Men', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=750&fit=crop' },
  { id: 6, name: 'Festive Anarkali', category: 'Women', image: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=500&h=700&fit=crop' },
  { id: 7, name: 'Bridal Lehenga Set', category: 'Women', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=850&fit=crop' },
  { id: 8, name: 'Boys Ethnic Set', category: 'Kids', image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500&h=600&fit=crop' },
  { id: 9, name: 'Designer Clutch', category: 'Accessories', image: 'https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=500&h=500&fit=crop' },
];

export default function Collections() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = selectedCategory === 'All'
    ? allProducts
    : allProducts.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      
      {/* Header */}
      <section className="pt-24 pb-12 bg-secondary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-4">
              Our Collections
            </h1>
            <p className="text-muted-foreground font-sans text-lg max-w-2xl mx-auto">
              Discover our curated selection of premium fashion for every occasion
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-0 z-40 bg-background border-b border-border py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
            <Filter className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-4 py-2 rounded-full font-sans text-sm font-medium whitespace-nowrap transition-all
                  ${selectedCategory === category
                    ? 'bg-primary text-primary-foreground shadow-gold'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="break-inside-avoid"
              >
                <div className="product-card group">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    <div className="absolute inset-0 bg-jet/0 group-hover:bg-jet/30 transition-colors duration-300" />
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Link
                        to={`/product/${product.id}`}
                        className="flex items-center gap-2 bg-background text-foreground px-6 py-3 rounded-full font-sans font-medium shadow-luxury hover:shadow-luxury-lg transition-shadow"
                      >
                        <Eye className="w-5 h-5" />
                        View Details
                      </Link>
                    </div>

                    <span className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-sans font-semibold uppercase tracking-wider">
                      {product.category}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="font-serif text-xl text-foreground mb-3">
                      {product.name}
                    </h3>
                    <Link
                      to={`/product/${product.id}`}
                      className="inline-flex items-center gap-2 text-primary font-sans font-semibold text-sm hover:gap-3 transition-all"
                    >
                      View Details
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
