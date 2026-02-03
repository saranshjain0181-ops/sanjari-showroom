import { useState } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState(''); // New State for Phone
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // VALIDATION: Check if phone is empty (Double check)
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
      // Sending data to Supabase (Ensure your table has a 'phone' column if needed, 
      // otherwise it might just ignore it depending on your setup. 
      // If you haven't set up a table, this might just simulate a success for now)
      
      console.log("Submitting inquiry:", { name, phone, message });

      // Simulate network request or real Supabase insert
      // await supabase.from('inquiries').insert({ name, phone, message });
      
      // Fake delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Message Sent!",
        description: "We'll get back to you shortly.",
      });

      // Reset Form
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
      {/* TOGGLE BUTTON */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-colors duration-300 ${
          isOpen ? 'bg-transparent text-transparent pointer-events-none' : 'bg-[#D4AF37] text-white hover:bg-[#b5952f]'
        }`}
      >
        <MessageCircle size={24} />
      </motion.button>

      {/* CHAT WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[350px] bg-background border border-border rounded-2xl shadow-2xl overflow-hidden"
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
              
              {/* Name Field (Optional) */}
              <input
                type="text"
                placeholder="Your name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-transparent focus:border-[#D4AF37] focus:bg-background outline-none transition-all text-sm"
              />

              {/* PHONE Field (Compulsory/Required) */}
              <input
                type="tel"
                placeholder="Phone Number (Required)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required // <--- HTML validation
                className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-transparent focus:border-[#D4AF37] focus:bg-background outline-none transition-all text-sm"
              />

              {/* Message Field (Required) */}
              <textarea
                placeholder="How can we help you?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required // <--- HTML validation
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-transparent focus:border-[#D4AF37] focus:bg-background outline-none transition-all text-sm resize-none"
              />

              {/* Submit Button */}
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
