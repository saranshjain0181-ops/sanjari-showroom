import { useEffect, useState } from 'react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { LayoutDashboard, Package, Plus, LogOut, Menu, X, MessageSquare, Video } from 'lucide-react';
import { toast } from 'sonner';
import type { User, Session } from '@supabase/supabase-js';

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ROBUST ADMIN CHECK
  const checkAdminRole = async (session: Session | null) => {
    if (!session?.user) return false;

    // Check 1: User Metadata (Fastest & Most Reliable)
    // We set this in the SQL script earlier
    const metaRole = session.user.user_metadata?.role || session.user.app_metadata?.role;
    if (metaRole === 'admin') {
      console.log('Admin confirmed via Metadata');
      setIsAdmin(true);
      return true;
    }

    // Check 2: user_roles Table (Database Backup)
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (roleData) {
      console.log('Admin confirmed via user_roles table');
      setIsAdmin(true);
      return true;
    }

    // If all checks fail:
    console.error('Admin check failed. Metadata:', metaRole);
    toast.error('Admin access required');
    await supabase.auth.signOut();
    navigate('/admin/login');
    return false;
  };

  useEffect(() => {
    // Initial Session Check
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) {
        setLoading(false);
        navigate('/admin/login');
        return;
      }
      
      setUser(session.user);
      await checkAdminRole(session);
      setLoading(false);
    });

    // Listen for Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session?.user) {
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
          navigate('/admin/login');
          return;
        }
        
        setUser(session.user);
        // Only re-check if we aren't already confirmed as admin
        if (!isAdmin) {
          await checkAdminRole(session);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Require both authentication AND admin role
  if (!user || !isAdmin) {
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
