-- Add write protection policies to user_roles table
-- Only admins can INSERT new role assignments
CREATE POLICY "Only admins can assign roles"
ON public.user_roles
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can UPDATE role assignments
CREATE POLICY "Only admins can modify roles"
ON public.user_roles
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can DELETE role assignments
CREATE POLICY "Only admins can remove roles"
ON public.user_roles
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));