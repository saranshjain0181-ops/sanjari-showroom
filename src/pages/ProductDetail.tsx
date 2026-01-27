import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { MessageCircle, MapPin, ChevronLeft } from 'lucide-react';
import FloatingNav from '@/components/navigation/FloatingNav';
import Footer from '@/components/layout/Footer';

// Mock product data
const products: Record<string, {
  id: number;
  name: string;
  category: string;
  material: string;
  fit: string;
  care: string;
  description: string;
  images: string[];
}> = {
  '1': {
    id: 1,
    name: 'Royal Silk Saree',
    category: 'Women',
    material: 'Pure Mulberry Silk',
    fit: 'Free Size (Blouse customizable)',
    care: 'Dry Clean Only',
    description: 'An exquisite handwoven silk saree featuring intricate zari work and traditional motifs. Perfect for weddings and festive occasions.',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=800&h=1200&fit=crop',
    ],
  },
  '2': {
    id: 2,
    name: 'Classic Sherwani',
    category: 'Men',
    material: 'Jacquard Silk',
    fit: 'Regular Fit',
    care: 'Dry Clean Recommended',
    description: 'A timeless sherwani with intricate embroidery, perfect for grooms and wedding guests.',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1200&fit=crop',
    ],
  },
};

const defaultProduct = products['1'];

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = products[id || '1'] || defaultProduct;

  const whatsappMessage = encodeURIComponent(
    `Hi, I am interested in ${product.name} from Sanjari Fashion Store. Can you provide more details?`
  );

  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      
      {/* Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <Link
          to="/collections"
          className="flex items-center gap-2 glass-nav px-4 py-2 rounded-full text-foreground font-sans text-sm font-medium hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      <div className="pt-20 pb-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left - Images (Scrollable) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {product.images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-2xl overflow-hidden shadow-luxury-lg"
                >
                  <img
                    src={image}
                    alt={`${product.name} - View ${index + 1}`}
                    className="w-full h-auto object-cover"
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Right - Sticky Details Panel */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:sticky lg:top-24"
            >
              <div className="bg-card rounded-2xl p-8 shadow-luxury">
                {/* Category Badge */}
                <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-sans font-semibold uppercase tracking-wider mb-4">
                  {product.category}
                </span>

                {/* Title */}
                <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
                  {product.name}
                </h1>

                {/* Description */}
                <p className="text-muted-foreground font-sans text-lg leading-relaxed mb-8">
                  {product.description}
                </p>

                {/* Specs Table */}
                <div className="border border-border rounded-lg overflow-hidden mb-8">
                  <table className="w-full">
                    <tbody>
                      {[
                        { label: 'Material', value: product.material },
                        { label: 'Fit', value: product.fit },
                        { label: 'Care', value: product.care },
                      ].map((spec, index) => (
                        <tr 
                          key={spec.label}
                          className={index !== 2 ? 'border-b border-border' : ''}
                        >
                          <td className="px-4 py-3 bg-muted font-sans font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                            {spec.label}
                          </td>
                          <td className="px-4 py-3 font-sans text-foreground">
                            {spec.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-4">
                  <a
                    href={`https://wa.me/917311234567?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full btn-gold text-lg"
                  >
                    <MessageCircle className="w-6 h-6" />
                    Chat on WhatsApp
                  </a>

                  <a
                    href="#contact"
                    className="flex items-center justify-center gap-3 w-full bg-secondary text-secondary-foreground px-6 py-4 rounded-lg font-sans font-semibold hover:bg-muted transition-colors"
                  >
                    <MapPin className="w-5 h-5" />
                    Visit Store
                  </a>
                </div>

                {/* Store Info */}
                <div className="mt-8 pt-6 border-t border-border">
                  <p className="text-muted-foreground font-sans text-sm text-center">
                    📍 123 MG Road, Indore • Open Mon-Sat, 10AM - 9PM
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
