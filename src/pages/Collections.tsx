import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Eye, Filter, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import FloatingNav from '@/components/navigation/FloatingNav';
import Footer from '@/components/layout/Footer';
import { useState } from 'react';

const CATEGORIES = ['All', 'T-shirts', 'Shirts', 'Jeans', 'Hoodies', 'Jackets', 'Sherwanis'];

export default function Collections() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fetch real products from Supabase
  const { data: products, isLoading } = useQuery({
    queryKey: ['all-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Filter products by category (case-insensitive)
  const filteredProducts = products?.filter((product) => {
    if (selectedCategory === 'All') return true;
    return product.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

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
            {CATEGORIES.map((category) => (
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
          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredProducts?.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground font-sans text-lg">
                No products found in "{selectedCategory}".
              </p>
            </div>
          )}

          {/* Product Grid */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredProducts?.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="break-inside-avoid"
              >
                <div className="product-card group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-luxury transition-all duration-500">
                  <div className="relative overflow-hidden aspect-[3/4]">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                        No Image
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Link
                        to={`/product/${product.id}`}
                        className="flex items-center gap-2 bg-background text-foreground px-6 py-3 rounded-full font-sans font-medium shadow-luxury hover:shadow-luxury-lg transition-shadow"
                      >
                        <Eye className="w-5 h-5" />
                        View Details
                      </Link>
                    </div>

                    <span className="absolute top-4 left-4 bg-primary/90 backdrop-blur-md text-primary-foreground px-3 py-1 rounded-full text-xs font-sans font-semibold uppercase tracking-wider shadow-sm">
                      {product.category}
                    </span>
                  </div>

                  <div className="p-5 text-center">
                    <h3 className="font-serif text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    {product.price && (
                      <p className="text-primary font-sans font-semibold text-lg mb-1">
                        ₹{product.price.toLocaleString('en-IN')}
                      </p>
                    )}
                    <p className="text-muted-foreground font-sans text-sm">
                      {product.material || product.category}
                    </p>
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
