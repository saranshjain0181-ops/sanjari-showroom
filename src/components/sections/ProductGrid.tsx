import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';

// Sample products data - Men's categories only
const products = [
  {
    id: 1,
    name: 'Classic Cotton Tee',
    category: 'T-shirts',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop',
  },
  {
    id: 2,
    name: 'Premium Sherwani',
    category: 'Sherwanis',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=600&fit=crop',
  },
  {
    id: 3,
    name: 'Slim Fit Denim',
    category: 'Jeans',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=600&fit=crop',
  },
  {
    id: 4,
    name: 'Casual Oxford Shirt',
    category: 'Shirts',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&h=600&fit=crop',
  },
  {
    id: 5,
    name: 'Urban Hoodie',
    category: 'Hoodies',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=600&fit=crop',
  },
  {
    id: 6,
    name: 'Leather Jacket',
    category: 'Jackets',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=600&fit=crop',
  },
];

export default function ProductGrid() {
  return (
    <section id="collections" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-sans text-sm font-semibold tracking-[0.3em] uppercase">
            Curated Selection
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mt-2">
            OUR COLLECTIONS
          </h2>
          <div className="divider-warm w-24 mx-auto mt-4" />
        </motion.div>

        {/* Masonry-like Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="break-inside-avoid"
            >
              <div className="product-card group">
                {/* Image Container */}
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-jet/0 group-hover:bg-jet/30 transition-colors duration-300" />
                  
                  {/* Quick View Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <Link
                      to={`/product/${product.id}`}
                      className="flex items-center gap-2 bg-background text-foreground px-6 py-3 rounded-full font-sans font-medium shadow-luxury hover:shadow-luxury-lg transition-shadow"
                    >
                      <Eye className="w-5 h-5" />
                      Quick View
                    </Link>
                  </motion.div>

                  {/* Category Badge */}
                  <span className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-sans font-semibold uppercase tracking-wider">
                    {product.category}
                  </span>
                </div>

                {/* Product Info */}
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

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/collections"
            className="btn-gold inline-flex items-center gap-2 font-sans"
          >
            View All Collections
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
