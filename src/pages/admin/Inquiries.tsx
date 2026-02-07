import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Clock, Trash2, CheckCircle, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface Inquiry {
  id: string;
  customer_name: string | null;
  phone?: string | null;
  message: string;
  status: string;
  created_at: string;
}

export default function Inquiries() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // --- NEW: Helper function to format date to Indian Standard Time (IST) ---
  const formatIndianDate = (dateString: string) => {
    const date = new Date(dateString);
    
    // 1. Get Date Parts in IST
    const day = date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit' });
    const month = date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', month: '2-digit' });
    const year = date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', year: 'numeric' });
    
    // 2. Get Time Parts in IST
    const time = date.toLocaleString('en-IN', { 
      timeZone: 'Asia/Kolkata', 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });

    // 3. Combine in dd-mm-yyyy format
    return `${day}-${month}-${year} at ${time}`; 
  };
  // -------------------------------------------------------------------------

  // 1. Fetch Inquiries
  const { data: inquiries, isLoading } = useQuery({
    queryKey: ['inquiries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inquiries' as any)
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data as unknown as Inquiry[]) || [];
    },
  });

  // 2. Delete Inquiry
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('inquiries' as any).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
      queryClient.invalidateQueries({ queryKey: ['inquiries-count'] });
      toast.success('Message deleted');
    },
  });

  // 3. Mark as Read
  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('inquiries' as any)
        .update({ status: 'read' })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    },
  });

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        
        {/* Header */}
        <div className="flex items-center mb-8 gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-serif text-foreground">Customer Inquiries</h1>
            <p className="text-muted-foreground">Read messages from your customers</p>
          </div>
        </div>

        {/* Inbox List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading messages...</div>
          ) : inquiries?.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-xl border border-dashed border-border">
              <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
              <p className="text-lg font-medium text-foreground">No messages yet</p>
              <p className="text-muted-foreground text-sm">When customers contact you, they will appear here.</p>
            </div>
          ) : (
            inquiries?.map((msg) => (
              <div 
                key={msg.id} 
                className={`bg-card p-6 rounded-xl shadow-sm border border-border transition-all hover:shadow-md ${msg.status === 'unread' ? 'border-l-4 border-l-primary' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-foreground">{msg.customer_name || 'Anonymous'}</span>
                    {msg.status === 'unread' && (
                      <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">New</span>
                    )}
                  </div>
                  {/* UPDATED DATE DISPLAY */}
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatIndianDate(msg.created_at)}
                  </div>
                </div>

                {/* Phone Number Section */}
                {msg.phone && (
                  <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4 text-primary/70" />
                    <a 
                      href={`tel:${msg.phone}`} 
                      className="hover:text-primary hover:underline transition-colors font-medium"
                    >
                      {msg.phone}
                    </a>
                  </div>
                )}

                <p className="text-foreground bg-muted/30 p-4 rounded-lg text-sm leading-relaxed mb-4">
                  {msg.message}
                </p>

                <div className="flex justify-end gap-2">
                  {msg.status === 'unread' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => markReadMutation.mutate(msg.id)}
                      className="text-green-600 border-green-200 hover:bg-green-50"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" /> Mark Read
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteMutation.mutate(msg.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

      </motion.div>
    </div>
  );
}
