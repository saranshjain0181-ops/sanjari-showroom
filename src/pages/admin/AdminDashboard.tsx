import { motion } from 'framer-motion';
import { Package, Eye, TrendingUp, Users, LogOut } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Logout Logic
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/"); // Go to homepage after logout
  };

  // 1. Fetch Product Count
  const { data: products, isLoading: loadingProducts } = useQuery({
    queryKey: ['products-count'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, category');
      if (error) throw error;
      return data;
    },
  });

  // 2. Fetch Real View Count (From the 'store_stats' table)
  const { data: stats } = useQuery({
    queryKey: ['store-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_stats' as any)
        .select('views_count')
        .maybeSingle();
      
      if (error) return { views_count: 0 };
      return (data as unknown as { views_count: number }) || { views_count: 0 };
    },
  });

  // 3. Fetch Real Inquiries Count (From the 'inquiries' table)
  const { data: inquiriesCount } = useQuery({
    queryKey: ['inquiries-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('inquiries' as any)
        .select('*', { count: 'exact', head: true });
      
      if (error) return 0;
      return count;
    },
  });

  const statsList = [
    { 
      name: 'Total Products', 
      value: loadingProducts ? '...' : products?.length || 0, 
      icon: Package,
      color: 'bg-primary/10 text-primary',
      link: '/admin/products'
    },
    { 
      name: 'Categories', 
      value: loadingProducts ? '...' : new Set(products?.map(p => p.category)).size || 0, 
      icon: TrendingUp,
      color: 'bg-green-100 text-green-600',
      link: null
    },
    { 
      name: 'Store Views', 
      value: stats?.views_count || 0,
      icon: Eye,
      color: 'bg-blue-100 text-blue-600',
      link: '/'
    },
    { 
      name: 'Inquiries', 
      value: inquiriesCount || 0,
      icon: Users,
      color: 'bg-purple-100 text-purple-600',
      link: '/admin/inquiries'
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header with Logout Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-serif text-3xl text-foreground mb-2">
              Dashboard
            </h1>
            <p className="text-muted-foreground font-sans">
              Welcome back! Here's an overview of your store.
            </p>
          </div>
          <Button 
            onClick={handleLogout} 
            variant="outline" 
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsList.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => stat.link && navigate(stat.link)}
                className={`bg-card rounded-xl p-6 shadow-luxury transition-all ${
                  stat.link ? 'cursor-pointer hover:shadow-lg hover:scale-[1.02]' : ''
                }`}
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
            <Button
              variant="outline"
              className="h-auto p-4 justify-start border-border hover:border-primary hover:bg-primary/5"
              onClick={() => navigate('/admin/products/new')}
            >
              <Package className="w-5 h-5 text-primary mr-3" />
              <span className="font-sans font-medium">Add New Product</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 justify-start border-border hover:border-primary hover:bg-primary/5"
              onClick={() => navigate('/admin/products')}
            >
              <Eye className="w-5 h-5 text-primary mr-3" />
              <span className="font-sans font-medium">View All Products</span>
            </Button>
            
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center h-auto p-4 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <TrendingUp className="w-5 h-5 text-primary mr-3" />
              <span className="font-sans font-medium">View Store</span>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
