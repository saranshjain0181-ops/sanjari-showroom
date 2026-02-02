import { useState, useCallback, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { Upload, X, ArrowLeft, GripVertical, Star, Plus, Loader2 } from 'lucide-react';

// 👇 Synced Categories
const categories = [
  "T-shirts",
  "Shirts",
  "Jeans",
  "Hoodies",
  "Jackets",
  "Sherwanis"
];

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

interface ProductImage {
  id?: string;
  image_url: string;
  display_order: number;
  is_primary: boolean;
  file?: File;
  isNew?: boolean;
}

export default function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    material: '',
    description: '',
    sizes: [] as string[],
    image_url: '', // Kept for backward compatibility
    price: '' as string, // Price as string for input handling
  });

  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // 1. Fetch existing product details
  const { data: productData, isLoading: isFetching } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: isEditing,
  });

  // 2. Fetch existing product images
  const { data: existingImages } = useQuery({
    queryKey: ['product-images', id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', id)
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: isEditing,
  });

  // Populate form with product data
  useEffect(() => {
    if (productData) {
      setFormData({
        name: productData.name,
        category: productData.category,
        material: productData.material || '',
        description: productData.description || '',
        sizes: productData.sizes || [],
        image_url: productData.image_url || '',
        price: productData.price?.toString() || '',
      });
    }
  }, [productData]);

  // Populate images state
  useEffect(() => {
    if (existingImages && existingImages.length > 0) {
      setProductImages(existingImages.map(img => ({
        id: img.id,
        image_url: img.image_url,
        display_order: img.display_order,
        is_primary: img.is_primary,
      })));
    } else if (productData && productData.image_url && (!existingImages || existingImages.length === 0)) {
      // Fallback: If product has a main image but no entries in product_images table yet
      setProductImages([{
        image_url: productData.image_url,
        display_order: 0,
        is_primary: true,
        isNew: true // Treat as new so it gets added to the new table
      }]);
    }
  }, [existingImages, productData]);

  // --- Handlers ---

  const handleImageAdd = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage: ProductImage = {
          image_url: reader.result as string,
          display_order: productImages.length + index,
          is_primary: productImages.length === 0 && index === 0,
          file,
          isNew: true,
        };
        setProductImages(prev => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = ''; // Reset input
  }, [productImages.length]);

  const handleImageRemove = (index: number) => {
    const image = productImages[index];
    if (image.id) {
      setImagesToDelete(prev => [...prev, image.id!]);
    }
    
    const wasPrimary = image.is_primary;
    
    setProductImages(prev => {
      const updated = prev.filter((_, i) => i !== index);
      // If we removed the primary, make the first one primary
      if (wasPrimary && updated.length > 0) {
        updated[0].is_primary = true;
      }
      // Re-index display orders
      return updated.map((img, i) => ({ ...img, display_order: i }));
    });
  };

  const handleSetPrimary = (index: number) => {
    setProductImages(prev => prev.map((img, i) => ({
      ...img,
      is_primary: i === index,
    })));
  };

  const handleReorder = (newOrder: ProductImage[]) => {
    setProductImages(newOrder.map((img, i) => ({
      ...img,
      display_order: i,
    })));
  };

  const handleSizeToggle = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  // --- Mutation Logic ---

  const uploadNewImages = async (productId: string): Promise<void> => {
    // 1. Upload new files and insert rows
    for (const image of productImages) {
      if (image.isNew && image.file) {
        const fileExt = image.file.name.split('.').pop();
        const fileName = `${productId}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        
        // Upload to Bucket
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, image.file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        // Insert into DB
        const { error: insertError } = await supabase
          .from('product_images')
          .insert({
            product_id: productId,
            image_url: publicUrlData.publicUrl,
            display_order: image.display_order,
            is_primary: image.is_primary,
          });

        if (insertError) throw insertError;
      } 
      // 2. Update existing rows (order/primary status)
      else if (image.id) {
        const { error: updateError } = await supabase
          .from('product_images')
          .update({
            display_order: image.display_order,
            is_primary: image.is_primary,
          })
          .eq('id', image.id);

        if (updateError) throw updateError;
      }
    }

    // 3. Delete removed images
    if (imagesToDelete.length > 0) {
      const { error } = await supabase
        .from('product_images')
        .delete()
        .in('id', imagesToDelete);
      
      if (error) console.error('Failed to delete images:', error);
    }
  };

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      setIsUploading(true);
      
      let productId = id;
      
      // Determine primary image for the main 'products' table fallback
      // (This ensures the product card still shows an image without needing a join)
      const primaryImageObj = productImages.find(img => img.is_primary) || productImages[0];
      let mainImageUrl = primaryImageObj?.image_url || '';

      // If the primary image is a NEW file, we won't have the URL yet.
      // We'll update it after the upload loop below.

      // 1. Create or Update Product
      if (isEditing && id) {
        const { error } = await supabase
          .from('products')
          .update({ 
            name: data.name,
            category: data.category,
            material: data.material,
            description: data.description,
            sizes: data.sizes,
            price: data.price ? parseFloat(data.price) : null,
            // Only update image_url here if we already have a valid URL (not a blob)
            image_url: mainImageUrl.startsWith('blob:') ? undefined : mainImageUrl
          })
          .eq('id', id);
        if (error) throw error;
      } else {
        const { data: newProduct, error } = await supabase
          .from('products')
          .insert([{ 
            name: data.name,
            category: data.category,
            material: data.material,
            description: data.description,
            sizes: data.sizes,
            price: data.price ? parseFloat(data.price) : null,
            image_url: '' // Placeholder, will update after image upload
          }])
          .select('id')
          .single();
        
        if (error) throw error;
        productId = newProduct.id;
      }

      // 2. Handle Image Uploads & Table Updates
      if (productId) {
        await uploadNewImages(productId);

        // 3. Sync the main product `image_url` with the new primary image
        // Fetch the fresh primary image from the DB
        const { data: freshPrimary } = await supabase
          .from('product_images')
          .select('image_url')
          .eq('product_id', productId)
          .eq('is_primary', true)
          .maybeSingle();

        if (freshPrimary) {
           await supabase
            .from('products')
            .update({ image_url: freshPrimary.image_url })
            .eq('id', productId);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product-images'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      toast.success(isEditing ? 'Product updated!' : 'Product created!');
      navigate('/admin/products');
    },
    onError: (error: any) => {
      console.error(error);
      toast.error(error.message || 'Failed to save product');
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (productImages.length === 0) {
      toast.error('Please add at least one image');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }
    mutation.mutate(formData);
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/admin/products')}
        className="mb-6 hover:bg-transparent hover:text-primary pl-0"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Button>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground">
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-card rounded-xl shadow-luxury p-6 md:p-8 space-y-6">
        
        {/* Multi-Image Upload Section */}
        <div className="space-y-3">
          <Label className="font-sans font-medium">
            Product Images
            <span className="text-muted-foreground font-normal ml-2 text-xs">
              (Drag to reorder, star to set as primary)
            </span>
          </Label>
          
          <Reorder.Group
            axis="x"
            values={productImages}
            onReorder={handleReorder}
            className="flex flex-wrap gap-4"
          >
            {productImages.map((image, index) => (
              <Reorder.Item
                key={image.id || image.image_url} // Use URL as key for new images
                value={image}
                className="relative group"
              >
                <div className={`
                  relative w-28 h-28 rounded-lg overflow-hidden border-2 cursor-grab active:cursor-grabbing
                  ${image.is_primary ? 'border-primary ring-2 ring-primary/20' : 'border-border'}
                `}>
                  <img
                    src={image.image_url}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                  
                  {/* Primary Badge */}
                  {image.is_primary && (
                    <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-primary/90 text-white text-[10px] font-sans font-semibold rounded shadow-sm">
                      Main
                    </div>
                  )}
                  
                  {/* Action Buttons Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {!image.is_primary && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(index)}
                        className="p-1.5 bg-white/90 hover:bg-white text-yellow-500 rounded-full shadow-sm transition-transform hover:scale-110"
                        title="Set as primary"
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleImageRemove(index)}
                      className="p-1.5 bg-white/90 hover:bg-white text-destructive rounded-full shadow-sm transition-transform hover:scale-110"
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Reorder.Item>
            ))}

            {/* Upload Button */}
            <label className="cursor-pointer">
              <div className={`
                w-28 h-28 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2
                hover:border-primary hover:bg-primary/5 transition-colors
              `}>
                <Plus className="w-6 h-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-medium">Add Image</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageAdd}
                  className="hidden"
                />
              </div>
            </label>
          </Reorder.Group>
        </div>

        {/* Basic Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Classic Silk Saree"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="material">Material</Label>
            <Input
              id="material"
              value={formData.material}
              onChange={(e) => setFormData({ ...formData, material: e.target.value })}
              placeholder="e.g. 100% Cotton"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price (₹) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="e.g. 1999.00"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Sizes Available</Label>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <Button
                key={size}
                type="button"
                variant={formData.sizes.includes(size) ? "default" : "outline"}
                onClick={() => handleSizeToggle(size)}
                className="w-12 h-12 rounded-full"
              >
                {size}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed product description..."
            className="h-32"
          />
        </div>

        {/* 👇 UPDATED BUTTON AREA with DONE BUTTON */}
        <div className="flex justify-end gap-4 pt-4">
          {/* New DONE Button - Goes to Main Dashboard */}
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/admin')}
            disabled={mutation.isPending || isUploading}
          >
            Done
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/products')}
            disabled={mutation.isPending || isUploading}
          >
            Cancel
          </Button>
          
          <Button 
            type="submit" 
            className="btn-gold min-w-[150px]"
            disabled={mutation.isPending || isUploading}
          >
            {mutation.isPending || isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              isEditing ? 'Update Product' : 'Create Product'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
