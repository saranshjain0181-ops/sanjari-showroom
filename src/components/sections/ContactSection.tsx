import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';

const contactInfo = [
  {
    icon: MapPin,
    label: 'Address',
    value: '123 MG Road, Indore, Madhya Pradesh 452001',
    link: 'https://maps.google.com/?q=Indore,India'
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 96696 00574',
    link: 'tel:+919669600574'
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@sanjarifashion.com',
    link: 'mailto:hello@sanjarifashion.com'
  },
  {
    icon: Clock,
    label: 'Hours',
    value: 'Mon - Sat: 10:00 AM - 9:00 PM',
    link: null
  },
];

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-sans text-sm font-semibold tracking-[0.3em] uppercase">
            Experience Luxury In Person
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mt-2">
            VISIT OUR STORE IN INDORE
          </h2>
          <div className="divider-warm w-24 mx-auto mt-4" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {contactInfo.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-4 p-4 bg-background rounded-lg shadow-luxury"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm font-sans uppercase tracking-wider">
                      {item.label}
                    </span>
                    {item.link ? (
                      <a
                        href={item.link}
                        target={item.link.startsWith('http') ? '_blank' : undefined}
                        rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="block font-serif text-lg text-foreground hover:text-primary transition-colors mt-1"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="font-serif text-lg text-foreground mt-1">
                        {item.value}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* WhatsApp CTA */}
            <motion.a
              href="https://wa.me/919669600574?text=Hi,%20I%20am%20interested%20in%20learning%20more%20about%20Sanjari%20Fashion%20Store"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="flex items-center gap-3 w-full btn-gold justify-center text-lg mt-8"
            >
              <MessageCircle className="w-6 h-6" />
              Chat on WhatsApp
            </motion.a>
          </motion.div>

          {/* Map Link */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center rounded-2xl bg-background shadow-luxury-lg h-[400px] lg:h-full min-h-[400px]"
          >
            <a
              href="https://www.google.com/maps/search/?api=1&query=123MGRoad,Indore,MadhyaPradesh452001"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 btn-gold text-lg px-8 py-4"
            >
              <MapPin className="w-6 h-6" />
              View on Google Maps
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
