-- Drop the overly permissive public read policy on store_stats
DROP POLICY IF EXISTS "Anyone can read store stats" ON public.store_stats;

-- Create a new policy that only allows admins to read store stats
CREATE POLICY "Only admins can read store stats"
ON public.store_stats
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));