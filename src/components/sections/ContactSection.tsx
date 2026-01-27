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
    value: '+91 731 123 4567',
    link: 'tel:+917311234567'
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
              href="https://wa.me/917311234567?text=Hi,%20I%20am%20interested%20in%20learning%20more%20about%20Sanjari%20Fashion%20Store"
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

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl overflow-hidden shadow-luxury-lg h-[400px] lg:h-full min-h-[400px]"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d235013.70716843014!2d75.69906574999999!3d22.7240968!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fcad1b410ddb%3A0x96ec4da356240f4!2sIndore%2C%20Madhya%20Pradesh%2C%20India!5e0!3m2!1sen!2sus!4v1706886400000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Sanjari Fashion Store Location"
              className="grayscale-[30%] hover:grayscale-0 transition-all duration-500"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
