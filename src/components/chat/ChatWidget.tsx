import { useState } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone.trim()) {
      toast({
        title: "Phone number required",
        description: "Please enter your phone number so we can contact you.",
        variant: "destructive"
      });
      return;
    }

    if (!message.trim()) return;

    setIsSubmitting(true);

    try {
      console.log("Submitting inquiry:", { name, phone, message });
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Message Sent!",
        description: "We'll get back to you shortly.",
      });

      setName('');
      setPhone('');
      setMessage('');
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* TOGGLE BUTTON - TOP RIGHT */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={() => setIsOpen(true)}
        className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2 font-medium tracking-wide ${
          isOpen 
            ? 'opacity-0 pointer-events-none scale-90' 
            : 'bg-[#D4AF37] text-white hover:bg-[#b5952f] hover:scale-105'
        }`}
      >
        <MessageCircle size={20} />
        {/* Text is visible on all screens, or you can use 'hidden md:inline' to hide text on mobile */}
        <span>Send Inquiry</span>
      </motion.button>

      {/* CHAT WINDOW - ANCHORED TOP RIGHT */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            // Animation: Slide down from top
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            // Position: Just below the top button (top-24)
            className="fixed top-24 right-6 z-50 w-[90vw] md:w-[350px] bg-background border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* HEADER */}
            <div className="bg-[#D4AF37] p-4 flex justify-between items-center text-white">
              <div>
                <h3 className="font-serif text-lg font-semibold">Send us a message</h3>
                <p className="text-xs text-white/90">We typically reply within a few hours</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <input
                type="text"
                placeholder="Your name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-transparent focus:border-[#D4AF37] focus:bg-background outline-none transition-all text-sm"
              />

              <input
                type="tel"
                placeholder="Phone Number (Required)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-transparent focus:border-[#D4AF37] focus:bg-background outline-none transition-all text-sm"
              />

              <textarea
                placeholder="How can we help you?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-transparent focus:border-[#D4AF37] focus:bg-background outline-none transition-all text-sm resize-none"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#D4AF37] hover:bg-[#b5952f] text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
