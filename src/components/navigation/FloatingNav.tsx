import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, ShoppingBag, MapPin, User, Info } from 'lucide-react';

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Collections', path: '/collections', icon: ShoppingBag },
  { name: 'Visit Store', path: '#contact', icon: MapPin, isAnchor: true },
  { name: 'Admin', path: '/admin', icon: User },
];

export default function FloatingNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (item: typeof navItems[0], e: React.MouseEvent) => {
    if (item.isAnchor) {
      e.preventDefault();
      
      // If not on home page, navigate there first
      if (location.pathname !== '/') {
        navigate('/');
        // Wait for navigation then scroll
        setTimeout(() => {
          const element = document.getElementById('contact');
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        // Already on home page, just scroll
        const element = document.getElementById('contact');
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      {/* 1. TOP-LEFT 'ABOUT US' BUTTON */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="fixed top-6 left-6 z-50"
      >
        <Link 
          to="/about"
          className="flex items-center gap-2 px-5 py-2.5 bg-black/80 hover:bg-black text-white text-xs font-semibold tracking-widest uppercase rounded-full transition-all duration-300 shadow-lg hover:scale-105 border border-white/10"
        >
          <Info size={14} />
          About Us
        </Link>
      </motion.div>

      {/* 2. BOTTOM NAVIGATION (Fixed Centering) */}
      <motion.nav
        // FIX: Force x to -50% in the animation so it stays centered
        initial={{ y: 100, x: "-50%", opacity: 0 }}
        animate={{ y: 0, x: "-50%", opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        // Removed '-translate-x-1/2' from className because we handle it in 'animate' above
        className="fixed bottom-6 left-1/2 z-50"
      >
        <div className="glass-nav px-2 py-2 rounded-full shadow-luxury-lg">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              if (item.isAnchor) {
                return (
                  <li key={item.name}>
                    <a
                      href={item.path}
                      onClick={(e) => handleNavClick(item, e)}
                      className={`
                        flex items-center gap-2 px-4 py-2.5 rounded-full
                        font-sans text-sm font-medium transition-all duration-300
                        text-foreground hover:bg-muted cursor-pointer
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden md:inline">{item.name}</span>
                    </a>
                  </li>
                );
              }
              
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center gap-2 px-4 py-2.5 rounded-full
                      font-sans text-sm font-medium transition-all duration-300
                      ${isActive 
                        ? 'bg-primary text-primary-foreground shadow-gold' 
                        : 'text-foreground hover:bg-muted'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden md:inline">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </motion.nav>
    </>
  );
}
