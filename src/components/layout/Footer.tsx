import { motion } from 'framer-motion';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Defined links
  const links = [
    { name: 'Home', path: '/' },
    { name: 'Collections', path: '/collections' },
    { name: 'About Us', path: '/about' },
    // Points to the ID 'contact' on the home page
    { name: 'Contact', path: '/#contact' } 
  ];

  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-serif text-3xl text-primary mb-4">
              Sanjari
            </h3>
            <p className="text-background/70 font-sans leading-relaxed">
              Indore's premier destination for luxury fashion. 
              Curating exquisite collections for the whole family since 2010.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-sans font-semibold text-lg mb-4 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-3 font-sans">
              {links.map((link) => (
                <li key={link.name}>
                  {/* LOGIC: If it's 'Contact', use standard <a> tag to force scroll to ID */}
                  {link.name === 'Contact' ? (
                    <a 
                      href={link.path}
                      className="text-background/70 hover:text-primary transition-colors cursor-pointer"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link 
                      to={link.path}
                      className="text-background/70 hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-sans font-semibold text-lg mb-4 uppercase tracking-wider">
              Follow Us
            </h4>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-12 h-12 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-foreground transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="divider-warm mb-8" />

        {/* Copyright */}
        <div className="text-center text-background/50 font-sans text-sm">
          <p>© {currentYear} Sanjari Fashion Store. All rights reserved.</p>
          <p className="mt-2">Crafted with ❤️ in Indore</p>
        </div>
      </div>
    </footer>
  );
}
