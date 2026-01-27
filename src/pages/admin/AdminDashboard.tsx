import { motion } from 'framer-motion';
import { Package, Eye, TrendingUp, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function AdminDashboard() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products-count'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, category');
      if (error) throw error;
      return data;
    },
  });

  const stats = [
    { 
      name: 'Total Products', 
      value: isLoading ? '...' : products?.length || 0, 
      icon: Package,
      color: 'bg-primary/10 text-primary'
    },
    { 
      name: 'Categories', 
      value: isLoading ? '...' : new Set(products?.map(p => p.category)).size || 0, 
      icon: TrendingUp,
      color: 'bg-green-100 text-green-600'
    },
    { 
      name: 'Store Views', 
      value: '1.2K', 
      icon: Eye,
      color: 'bg-blue-100 text-blue-600'
    },
    { 
      name: 'Inquiries', 
      value: '24', 
      icon: Users,
      color: 'bg-purple-100 text-purple-600'
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-foreground mb-2">
            Dashboard
          </h1>
          <p className="text-muted-foreground font-sans">
            Welcome back! Here's an overview of your store.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl p-6 shadow-luxury"
              >
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-3xl font-serif font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-muted-foreground font-sans text-sm mt-1">
                  {stat.name}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-xl p-6 shadow-luxury">
          <h2 className="font-serif text-xl text-foreground mb-4">
            Quick Actions
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href="/admin/products/new"
              className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <Package className="w-5 h-5 text-primary" />
              <span className="font-sans font-medium">Add New Product</span>
            </a>
            <a
              href="/admin/products"
              className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <Eye className="w-5 h-5 text-primary" />
              <span className="font-sans font-medium">View All Products</span>
            </a>
            <a
              href="/"
              target="_blank"
              className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="font-sans font-medium">View Store</span>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
