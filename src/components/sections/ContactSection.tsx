import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';

const STORE_ADDRESS = "SANJARI, 567, Mahatma Gandhi Rd, Opposite High Court, Nehru Park 2, Dhenu Market, Indore, Madhya Pradesh 452003";
const GOOGLE_MAPS_LINK = `https://maps.google.com/?q=${encodeURIComponent(STORE_ADDRESS)}`;

const contactInfo = [
  {
    icon: MapPin,
    label: 'Address',
    value: STORE_ADDRESS,
    link: GOOGLE_MAPS_LINK
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
              href="https://wa.me/9669600574?text=Hi,%20I%20am%20interested%20in%20learning%20more%20about%20Sanjari%20Fashion%20Store"
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

          {/* Satellite Google Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl overflow-hidden shadow-luxury-lg h-[400px] lg:h-full min-h-[400px]"
          >
            <a
              href={GOOGLE_MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full relative group"
            >
              <iframe
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3680.123!2d75.857!3d22.719!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s${encodeURIComponent(STORE_ADDRESS)}!5e1!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="pointer-events-none"
                title="Sanjari Fashion Store Location"
              />
              <div className="absolute inset-0 bg-transparent group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground px-4 py-2 rounded-full font-sans font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Open in Google Maps
                </span>
              </div>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
