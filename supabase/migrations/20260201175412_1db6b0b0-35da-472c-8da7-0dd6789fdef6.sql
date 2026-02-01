
-- 1. Fix RLS: Drop restrictive SELECT policies and create permissive ones for products
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
CREATE POLICY "Products are viewable by everyone" 
ON public.products FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Product images are viewable by everyone" ON public.product_images;
CREATE POLICY "Product images are viewable by everyone" 
ON public.product_images FOR SELECT 
USING (true);

-- 2. Create store_stats table for analytics
CREATE TABLE IF NOT EXISTS public.store_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  views_count integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Insert initial row
INSERT INTO public.store_stats (id, views_count) VALUES (gen_random_uuid(), 0)
ON CONFLICT DO NOTHING;

ALTER TABLE public.store_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read store stats" ON public.store_stats FOR SELECT USING (true);
CREATE POLICY "Admins can update store stats" ON public.store_stats FOR UPDATE USING (has_role(auth.uid(), 'admin'));

-- 3. Create increment_views function
CREATE OR REPLACE FUNCTION public.increment_views()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.store_stats SET views_count = views_count + 1;
END;
$$;

-- 4. Create inquiries table for customer messages
CREATE TABLE IF NOT EXISTS public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'unread',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read inquiries" ON public.inquiries FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update inquiries" ON public.inquiries FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete inquiries" ON public.inquiries FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- 5. Create content_videos table for video showcase
CREATE TABLE IF NOT EXISTS public.content_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  video_url text NOT NULL,
  thumbnail_url text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.content_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Videos are viewable by everyone" ON public.content_videos FOR SELECT USING (true);
CREATE POLICY "Admins can insert videos" ON public.content_videos FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update videos" ON public.content_videos FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete videos" ON public.content_videos FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- 6. Create storage bucket for videos
INSERT INTO storage.buckets (id, name, public) VALUES ('content-videos', 'content-videos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Video files are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'content-videos');
CREATE POLICY "Admins can upload videos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'content-videos' AND auth.role() = 'authenticated');
CREATE POLICY "Admins can delete videos" ON storage.objects FOR DELETE USING (bucket_id = 'content-videos' AND auth.role() = 'authenticated');
