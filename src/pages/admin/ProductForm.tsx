import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
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
import { Upload, X, ArrowLeft } from 'lucide-react';

const categories = ['Women', 'Men', 'Kids', 'Accessories'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch existing product if editing
  const { isLoading: isFetching } = useQuery({
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
    meta: {
      onSuccess: (data: any) => {
        if (data) {
          setFormData({
            name: data.name,
            category: data.category,
            material: data.material || '',
            description: data.description || '',
            sizes: data.sizes || [],
            image_url: data.image_url || '',
          });
          if (data.image_url) {
            setImagePreview(data.image_url);
          }
        }
      },
    },
  });

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return formData.image_url || null;

    setIsUploading(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error: any) {
      toast.error('Failed to upload image: ' + error.message);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const mutation = useMutation({
    mutationFn: async (data: typeof formData & { image_url: string | null }) => {
      if (isEditing && id) {
        const { error } = await supabase
          .from('products')
          .update(data)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(isEditing ? 'Product updated!' : 'Product created!');
      navigate('/admin/products');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to save product');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category) {
      toast.error('Please fill in required fields');
      return;
    }

    const imageUrl = await uploadImage();
    mutation.mutate({ ...formData, image_url: imageUrl });
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
          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="font-sans font-medium">Product Image</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              {imagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-48 rounded-lg mx-auto"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                      setFormData(prev => ({ ...prev, image_url: '' }));
                    }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-destructive text-white rounded-full flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-10 h-10 text-muted-foreground" />
                    <p className="text-muted-foreground font-sans">
                      Drag & drop or click to upload
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
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
              {mutation.isPending || isUploading ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
