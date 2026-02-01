import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Upload, Trash2, Video, Loader2, GripVertical, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface ContentVideo {
  id: string;
  title: string;
  video_url: string;
  thumbnail_url: string | null;
  display_order: number;
  created_at: string;
}

export default function AdminVideos() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newVideoFile, setNewVideoFile] = useState<File | null>(null);
  const [newThumbnailFile, setNewThumbnailFile] = useState<File | null>(null);

  // Fetch videos
  const { data: videos, isLoading } = useQuery({
    queryKey: ['admin-content-videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_videos' as any)
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return (data as unknown as ContentVideo[]) || [];
    },
  });

  // Upload new video
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!newVideoFile || !newTitle.trim()) {
        throw new Error('Please provide a title and video file');
      }

      setIsUploading(true);

      // Upload video to storage
      const videoExt = newVideoFile.name.split('.').pop();
      const videoFileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${videoExt}`;
      
      const { error: videoUploadError } = await supabase.storage
        .from('content-videos')
        .upload(videoFileName, newVideoFile);

      if (videoUploadError) throw videoUploadError;

      const { data: videoUrl } = supabase.storage
        .from('content-videos')
        .getPublicUrl(videoFileName);

      // Upload thumbnail if provided
      let thumbnailUrl = null;
      if (newThumbnailFile) {
        const thumbExt = newThumbnailFile.name.split('.').pop();
        const thumbFileName = `thumb-${Date.now()}.${thumbExt}`;
        
        const { error: thumbError } = await supabase.storage
          .from('content-videos')
          .upload(thumbFileName, newThumbnailFile);

        if (!thumbError) {
          const { data: thumbUrl } = supabase.storage
            .from('content-videos')
            .getPublicUrl(thumbFileName);
          thumbnailUrl = thumbUrl.publicUrl;
        }
      }

      // Get max display order
      const maxOrder = videos?.reduce((max, v) => Math.max(max, v.display_order), -1) ?? -1;

      // Insert into database
      const { error: insertError } = await supabase
        .from('content_videos' as any)
        .insert({
          title: newTitle.trim(),
          video_url: videoUrl.publicUrl,
          thumbnail_url: thumbnailUrl,
          display_order: maxOrder + 1,
        });

      if (insertError) throw insertError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-content-videos'] });
      queryClient.invalidateQueries({ queryKey: ['content-videos'] });
      setNewTitle('');
      setNewVideoFile(null);
      setNewThumbnailFile(null);
      toast.success('Video uploaded successfully!');
    },
    onError: (error: any) => {
      console.error(error);
      toast.error(error.message || 'Failed to upload video');
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  // Delete video
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('content_videos' as any)
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-content-videos'] });
      queryClient.invalidateQueries({ queryKey: ['content-videos'] });
      toast.success('Video deleted');
    },
    onError: () => {
      toast.error('Failed to delete video');
    },
  });

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        toast.error('Video file must be under 100MB');
        return;
      }
      setNewVideoFile(file);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewThumbnailFile(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex items-center mb-8 gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-serif text-foreground">Video Showcase</h1>
            <p className="text-muted-foreground">Manage videos displayed on the homepage</p>
          </div>
        </div>

        {/* Upload Form */}
        <div className="bg-card rounded-xl p-6 shadow-luxury mb-8 border border-border">
          <h2 className="font-serif text-xl text-foreground mb-4">Upload New Video</h2>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g. Summer Collection"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Video File (mp4, webm)</Label>
                <label className="cursor-pointer">
                  <div className={`
                    border-2 border-dashed rounded-lg p-6 text-center transition-colors
                    ${newVideoFile ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
                  `}>
                    {newVideoFile ? (
                      <div className="flex items-center justify-center gap-2">
                        <Video className="w-5 h-5 text-primary" />
                        <span className="text-sm text-foreground truncate max-w-[150px]">
                          {newVideoFile.name}
                        </span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Click to select video</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="space-y-2">
                <Label>Thumbnail (optional)</Label>
                <label className="cursor-pointer">
                  <div className={`
                    border-2 border-dashed rounded-lg p-6 text-center transition-colors
                    ${newThumbnailFile ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
                  `}>
                    {newThumbnailFile ? (
                      <span className="text-sm text-foreground truncate">
                        {newThumbnailFile.name}
                      </span>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Click to select image</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <Button
              onClick={() => uploadMutation.mutate()}
              disabled={isUploading || !newVideoFile || !newTitle.trim()}
              className="btn-gold w-full md:w-auto"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Video
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Video List */}
        <div className="space-y-4">
          <h2 className="font-serif text-xl text-foreground">Current Videos</h2>
          
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            </div>
          ) : videos?.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-xl border border-dashed border-border">
              <Video className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
              <p className="text-lg font-medium text-foreground">No videos yet</p>
              <p className="text-muted-foreground text-sm">Upload your first video above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {videos?.map((video) => (
                <motion.div
                  key={video.id}
                  layout
                  className="bg-card rounded-xl p-4 shadow-sm border border-border flex items-center gap-4"
                >
                  {/* Thumbnail / Video Preview */}
                  <div className="w-24 h-14 bg-muted rounded-lg overflow-hidden flex-shrink-0 relative">
                    {video.thumbnail_url ? (
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={video.video_url}
                        className="w-full h-full object-cover"
                        muted
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Title */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">{video.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Order: {video.display_order + 1}
                    </p>
                  </div>

                  {/* Actions */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (confirm('Delete this video?')) {
                        deleteMutation.mutate(video.id);
                      }
                    }}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
