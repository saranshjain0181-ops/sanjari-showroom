-- Create a new function for client-side role checks (only checks caller's own role)
CREATE OR REPLACE FUNCTION public.current_user_has_role(_role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = _role
  )
$$;

-- Revoke public execute on has_role() to prevent role enumeration
-- Only postgres (for RLS policy evaluation) and service_role can use it
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM authenticated;

-- Grant execute on the new safe function to authenticated users
GRANT EXECUTE ON FUNCTION public.current_user_has_role(app_role) TO authenticated;