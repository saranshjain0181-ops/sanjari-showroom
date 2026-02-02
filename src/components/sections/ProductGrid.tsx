import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Eye, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Standard categories to show in tabs
const CATEGORIES = ["All", "T-shirts", "Shirts", "Jeans", "Hoodies", "Jackets", "Sherwanis"];

export default function ProductGrid() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // 1. Fetch Real Products from Supabase
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false }); // Newest first
      
      if (error) throw error;
      return data || [];
    },
  });

  // 2. Filter Logic (Case-Insensitive Fix for "Jeans" vs "JEANS")
  const filteredProducts = products?.filter((product) => {
    if (selectedCategory === "All") return true;
    return product.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <section id="collections" className="py-20 bg-background">
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
            Curated Selection
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mt-2">
            OUR COLLECTIONS
          </h2>
          <div className="divider-warm w-24 mx-auto mt-4" />
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                px-6 py-2 rounded-full font-sans text-sm font-medium transition-all duration-300 border
                ${selectedCategory === cat 
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-105' 
                  : 'bg-transparent text-muted-foreground border-border hover:border-primary hover:text-foreground'
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>

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
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="break-inside-avoid"
            >
              <div className="product-card group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-luxury transition-all duration-500">
                {/* Image Container */}
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
                  
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  
                  {/* Quick View Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link
                      to={`/product/${product.id}`}
                      className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-foreground px-6 py-3 rounded-full font-sans font-medium shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                    >
                      <Eye className="w-5 h-5" />
                      View Details
                    </Link>
                  </div>

                  {/* Category Badge */}
                  <span className="absolute top-4 left-4 bg-primary/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-sans font-semibold uppercase tracking-wider shadow-sm">
                    {product.category}
                  </span>
                </div>

                {/* Product Info */}
                <div className="p-5 text-center">
                  <h3 className="font-serif text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground font-sans text-sm line-clamp-2">
                    {product.material || product.category}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link
            to="/collections"
            className="btn-gold inline-flex items-center gap-2 font-sans px-8 py-4 text-lg"
          >
            View All Collections
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
