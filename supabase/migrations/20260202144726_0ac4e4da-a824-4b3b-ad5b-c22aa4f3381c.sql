-- Fix content-videos storage policies to require admin role
DROP POLICY IF EXISTS "Admins can upload videos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete videos" ON storage.objects;

CREATE POLICY "Admins can upload videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'content-videos' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete videos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'content-videos' AND has_role(auth.uid(), 'admin'::app_role));