import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MessageCircle, MapPin, ChevronLeft, Expand, Box, RotateCw, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import FloatingNav from '@/components/navigation/FloatingNav';
import Footer from '@/components/layout/Footer';
import ImageLightbox from '@/components/gallery/ImageLightbox';
import ProductViewer3D from '@/components/3d/ProductViewer3D';
import ProductSpin360 from '@/components/gallery/ProductSpin360';
import SizeSelector from '@/components/product/SizeSelector';

type ViewMode = 'gallery' | '3d' | '360';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('gallery');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Fetch product from database
  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: Boolean(id),
  });

  // Fetch product images from database
  const { data: productImages, isLoading: imagesLoading } = useQuery({
    queryKey: ['product-images', id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', id)
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: Boolean(id),
  });

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Get images array - prefer product_images table, fallback to image_url
  const images = productImages && productImages.length > 0 
    ? productImages.map(img => img.image_url)
    : product?.image_url 
      ? [product.image_url]
      : [];

  // For 360 view, use all images (would typically be separate set)
  const has360 = images.length >= 3;

  const isLoading = productLoading || imagesLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted-foreground font-sans">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <FloatingNav />
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <h1 className="font-serif text-3xl text-foreground">Product Not Found</h1>
          <p className="text-muted-foreground font-sans">The product you're looking for doesn't exist.</p>
          <Link 
            to="/collections" 
            className="btn-gold mt-4"
          >
            Browse Collections
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const whatsappMessage = encodeURIComponent(
    `Hi, I am interested in ${product.name} from Sanjari Fashion Store. Can you provide more details?`
  );

  // Build specs based on available data
  const specs = [
    { label: 'Material', value: product.material },
    { label: 'Sizes', value: product.sizes?.join(', ') || 'Contact for sizes' },
  ].filter(spec => spec.value);

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
              {images.length > 0 && (
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
              )}

              {images.length === 0 ? (
                <div className="aspect-[3/4] bg-muted rounded-2xl flex items-center justify-center">
                  <p className="text-muted-foreground font-sans">No images available</p>
                </div>
              ) : viewMode === '3d' ? (
                /* 3D Product Viewer */
                <ProductViewer3D 
                  imageUrl={images[0]} 
                  productName={product.name} 
                />
              ) : viewMode === '360' && has360 ? (
                /* 360° Spin Viewer */
                <ProductSpin360
                  images={images}
                  productName={product.name}
                />
              ) : (
                /* Image Gallery */
                images.map((image, index) => (
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
              images={images}
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
                {product.description && (
                  <p className="text-muted-foreground font-sans text-lg leading-relaxed mb-8">
                    {product.description}
                  </p>
                )}

                {/* Size Selector */}
                <div className="mb-8">
                  <SizeSelector
                    sizes={product.sizes || []}
                    selectedSize={selectedSize}
                    onSizeSelect={setSelectedSize}
                    sizeType={product.category === 'Jeans' ? 'number' : 'letter'}
                  />
                </div>

                {/* Specs Table */}
                {specs.length > 0 && (
                  <div className="border border-border rounded-lg overflow-hidden mb-8">
                    <table className="w-full">
                      <tbody>
                        {specs.map((spec, index) => (
                          <tr 
                            key={spec.label}
                            className={index !== specs.length - 1 ? 'border-b border-border' : ''}
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
                )}

                {/* CTA Buttons */}
                <div className="space-y-4">
                  <a
                    href={`https://wa.me/919669600574?text=${whatsappMessage}`}
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
