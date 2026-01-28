import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { MessageCircle, MapPin, ChevronLeft, Expand, Box, RotateCw } from 'lucide-react';
import FloatingNav from '@/components/navigation/FloatingNav';
import Footer from '@/components/layout/Footer';
import ImageLightbox from '@/components/gallery/ImageLightbox';
import ProductViewer3D from '@/components/3d/ProductViewer3D';
import ProductSpin360 from '@/components/gallery/ProductSpin360';

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
  spin360Images?: string[];
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
    // 360° images - simulating multiple angle shots
    spin360Images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=1200&fit=crop&sat=-100',
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&h=1200&fit=crop&hue=30',
      'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=800&h=1200&fit=crop&blur=0',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=1200&fit=crop&bri=10',
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&h=1200&fit=crop&con=10',
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
    spin360Images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=1200&fit=crop&sat=-50',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1200&fit=crop&bri=5',
    ],
  },
};

const defaultProduct = products['1'];

type ViewMode = 'gallery' | '3d' | '360';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = products[id || '1'] || defaultProduct;
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('gallery');

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const has360 = product.spin360Images && product.spin360Images.length > 0;


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
            {/* Left - Images / 3D View */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* View Toggle */}
              <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit flex-wrap">
                <button
                  onClick={() => setViewMode('gallery')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-sans text-sm font-medium transition-all ${
                    viewMode === 'gallery'
                      ? 'bg-background text-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Expand className="w-4 h-4" />
                  Gallery
                </button>
                <button
                  onClick={() => setViewMode('3d')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-sans text-sm font-medium transition-all ${
                    viewMode === '3d'
                      ? 'bg-background text-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Box className="w-4 h-4" />
                  3D View
                </button>
                {has360 && (
                  <button
                    onClick={() => setViewMode('360')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md font-sans text-sm font-medium transition-all ${
                      viewMode === '360'
                        ? 'bg-background text-foreground shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <RotateCw className="w-4 h-4" />
                    360°
                  </button>
                )}
              </div>

              {viewMode === '3d' ? (
                /* 3D Product Viewer */
                <ProductViewer3D 
                  imageUrl={product.images[0]} 
                  productName={product.name} 
                />
              ) : viewMode === '360' && has360 ? (
                /* 360° Spin Viewer */
                <ProductSpin360
                  images={product.spin360Images!}
                  productName={product.name}
                />
              ) : (
                /* Image Gallery */
                product.images.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative rounded-2xl overflow-hidden shadow-luxury-lg group cursor-pointer"
                    onClick={() => openLightbox(index)}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - View ${index + 1}`}
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 text-foreground font-sans text-sm font-medium">
                        <Expand className="w-4 h-4" />
                        Click to expand
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>

            {/* Lightbox */}
            <ImageLightbox
              images={product.images}
              initialIndex={lightboxIndex}
              isOpen={lightboxOpen}
              onClose={() => setLightboxOpen(false)}
            />

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
