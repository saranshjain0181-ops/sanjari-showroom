import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, MapPin, User } from 'lucide-react';

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Collections', path: '/collections', icon: ShoppingBag },
  { name: 'Visit Store', path: '/#contact', icon: MapPin },
  { name: 'Admin', path: '/admin', icon: User },
];

export default function FloatingNav() {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="glass-nav px-2 py-2 rounded-full shadow-luxury-lg">
        <ul className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
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
  );
}
