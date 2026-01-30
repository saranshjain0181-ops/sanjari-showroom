import { useState, useCallback, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { Upload, X, ArrowLeft, GripVertical, Star, Plus, Loader2 } from 'lucide-react';

const categories = ['Women', 'Men', 'Kids', 'Accessories'];
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
  const queryClient = useQueryClient();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    material: '',
    description: '',
    sizes: [] as string[],
    image_url: '',
  });
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch existing product if editing
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

  // Fetch existing product images
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

  // Populate form when data loads
  useEffect(() => {
    if (productData) {
      setFormData({
        name: productData.name,
        category: productData.category,
        material: productData.material || '',
        description: productData.description || '',
        sizes: productData.sizes || [],
        image_url: productData.image_url || '',
      });
    }
  }, [productData]);

  // Populate images when they load
  useEffect(() => {
    if (existingImages && existingImages.length > 0) {
      setProductImages(existingImages.map(img => ({
        id: img.id,
        image_url: img.image_url,
        display_order: img.display_order,
        is_primary: img.is_primary,
      })));
    }
  }, [existingImages]);

  const handleImageAdd = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: ProductImage[] = [];
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

    // Reset input
    e.target.value = '';
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

  const uploadNewImages = async (productId: string): Promise<void> => {
    for (const image of productImages) {
      if (image.isNew && image.file) {
        const fileExt = image.file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const filePath = `products/${productId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, image.file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        // Insert into product_images table
        const { error: insertError } = await supabase
          .from('product_images')
          .insert({
            product_id: productId,
            image_url: data.publicUrl,
            display_order: image.display_order,
            is_primary: image.is_primary,
          });

        if (insertError) throw insertError;
      } else if (image.id) {
        // Update existing image's order and primary status
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

    // Delete removed images
    for (const imageId of imagesToDelete) {
      const { error } = await supabase
        .from('product_images')
        .delete()
        .eq('id', imageId);
      if (error) console.error('Failed to delete image:', error);
    }
  };

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      setIsUploading(true);
      
      // Get primary image URL for backward compatibility
      const primaryImage = productImages.find(img => img.is_primary);
      const imageUrl = primaryImage?.isNew ? '' : (primaryImage?.image_url || '');

      let productId = id;

      if (isEditing && id) {
        const { error } = await supabase
          .from('products')
          .update({ ...data, image_url: imageUrl })
          .eq('id', id);
        if (error) throw error;
      } else {
        const { data: newProduct, error } = await supabase
          .from('products')
          .insert([{ ...data, image_url: imageUrl }])
          .select('id')
          .single();
        if (error) throw error;
        productId = newProduct.id;
      }

      // Handle images
      await uploadNewImages(productId!);

      // Update the primary image URL after upload
      if (primaryImage?.isNew) {
        const { data: images } = await supabase
          .from('product_images')
          .select('image_url')
          .eq('product_id', productId!)
          .eq('is_primary', true)
          .maybeSingle();

        if (images?.image_url) {
          await supabase
            .from('products')
            .update({ image_url: images.image_url })
            .eq('id', productId!);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product-images'] });
      toast.success(isEditing ? 'Product updated!' : 'Product created!');
      navigate('/admin/products');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to save product');
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category) {
      toast.error('Please fill in required fields');
      return;
    }

    mutation.mutate(formData);
  };

  const handleSizeToggle = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size],
    }));
  };

  if (isEditing && isFetching) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/products')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 font-sans text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </button>
          <h1 className="font-serif text-3xl text-foreground">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-card rounded-xl shadow-luxury p-6 md:p-8 space-y-6">
          {/* Multi-Image Upload */}
          <div className="space-y-3">
            <Label className="font-sans font-medium">
              Product Images
              <span className="text-muted-foreground font-normal ml-2">
                (Drag to reorder, star to set as primary)
              </span>
            </Label>
            
            {/* Image Grid */}
            {productImages.length > 0 && (
              <Reorder.Group
                axis="x"
                values={productImages}
                onReorder={handleReorder}
                className="flex flex-wrap gap-4"
              >
                {productImages.map((image, index) => (
                  <Reorder.Item
                    key={image.id || image.image_url}
                    value={image}
                    className="relative group"
                  >
                    <div className={`
                      relative w-28 h-28 rounded-lg overflow-hidden border-2 cursor-grab active:cursor-grabbing
                      ${image.is_primary ? 'border-primary' : 'border-border'}
                    `}>
                      <img
                        src={image.image_url}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                      
                      {/* Drag Handle */}
                      <div className="absolute top-1 left-1 p-1 bg-black/50 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical className="w-3 h-3" />
                      </div>
                      
                      {/* Primary Badge */}
                      {image.is_primary && (
                        <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-primary text-primary-foreground text-[10px] font-sans font-semibold rounded">
                          Primary
                        </div>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="absolute bottom-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!image.is_primary && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimary(index)}
                            className="p-1.5 bg-black/70 hover:bg-primary text-white rounded transition-colors"
                            title="Set as primary"
                          >
                            <Star className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleImageRemove(index)}
                          className="p-1.5 bg-black/70 hover:bg-destructive text-white rounded transition-colors"
                          title="Remove"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            )}
            
            {/* Add More Button */}
            <label className="cursor-pointer">
              <div className={`
                border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary hover:bg-primary/5 transition-colors
                ${productImages.length === 0 ? 'py-12' : 'py-4'}
              `}>
                <div className="flex flex-col items-center gap-2">
                  {productImages.length === 0 ? (
                    <>
                      <Upload className="w-10 h-10 text-muted-foreground" />
                      <p className="text-muted-foreground font-sans">
                        Drag & drop or click to upload images
                      </p>
                      <p className="text-xs text-muted-foreground">
                        You can select multiple images
                      </p>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Plus className="w-5 h-5" />
                      <span className="font-sans text-sm">Add more images</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageAdd}
                  className="hidden"
                />
              </div>
            </label>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="font-sans font-medium">
              Product Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Royal Silk Saree"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="font-sans font-medium">Category *</Label>
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

          {/* Material */}
          <div className="space-y-2">
            <Label htmlFor="material" className="font-sans font-medium">
              Material
            </Label>
            <Input
              id="material"
              value={formData.material}
              onChange={(e) => setFormData({ ...formData, material: e.target.value })}
              placeholder="e.g., Pure Mulberry Silk"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="font-sans font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the product..."
              rows={4}
            />
          </div>

          {/* Sizes */}
          <div className="space-y-2">
            <Label className="font-sans font-medium">Available Sizes</Label>
            <div className="flex flex-wrap gap-3">
              {sizes.map((size) => (
                <label
                  key={size}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors
                    ${formData.sizes.includes(size)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border hover:border-primary'
                    }
                  `}
                >
                  <Checkbox
                    checked={formData.sizes.includes(size)}
                    onCheckedChange={() => handleSizeToggle(size)}
                    className="hidden"
                  />
                  <span className="font-sans text-sm">{size}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/products')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 btn-gold"
              disabled={mutation.isPending || isUploading}
            >
              {(mutation.isPending || isUploading) ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                isEditing ? 'Update Product' : 'Create Product'
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
