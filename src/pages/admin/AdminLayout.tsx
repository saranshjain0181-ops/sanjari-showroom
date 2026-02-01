import { useEffect, useState } from 'react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { LayoutDashboard, Package, Plus, LogOut, Menu, X, MessageSquare, Video } from 'lucide-react';
import { toast } from 'sonner';
import type { User } from '@supabase/supabase-js';

const navItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'All Products', path: '/admin/products', icon: Package },
  { name: 'Add Product', path: '/admin/products/new', icon: Plus },
  { name: 'Videos', path: '/admin/videos', icon: Video },
  { name: 'Inquiries', path: '/admin/inquiries', icon: MessageSquare }, 
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      // 👇 FIX: Redirect to /admin/login (NOT /auth or /admin)
      if (!session?.user) {
        navigate('/admin/login'); 
      }
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (!session?.user) {
          navigate('/admin/login'); // 👈 FIX: Redirect to /admin/login here too
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
    navigate('/admin/login'); // 👈 FIX: Redirect to login after logout
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If we are finished loading and still have no user, return null (the useEffect will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-secondary flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card rounded-lg shadow-luxury border border-border"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative z-40
          w-[280px] h-screen bg-card border-r border-border
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link to="/" className="font-serif text-2xl text-primary">
            Sanjari
          </Link>
          <p className="text-muted-foreground text-sm font-sans mt-1">
            Admin Dashboard
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
                           (item.path === '/admin/dashboard' && location.pathname === '/admin');
            
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg font-sans text-sm font-medium
                  transition-all duration-200
                  ${isActive 
                    ? 'bg-primary text-primary-foreground shadow-gold' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div className="p-4 border-t border-border">
          <div className="mb-4 px-4">
            <p className="text-sm font-sans text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg font-sans text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 overflow-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}
