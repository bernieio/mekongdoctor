-- profiles_public is a VIEW, not a table. Views don't have RLS directly.
-- We need to ensure the base profiles table has proper RLS and the view uses security_invoker.
-- First, drop and recreate the view with security_invoker=on to inherit RLS from base table

DROP VIEW IF EXISTS public.profiles_public;

CREATE VIEW public.profiles_public
WITH (security_invoker = on) AS
SELECT 
  id,
  full_name,
  avatar_url,
  province,
  created_at
FROM public.profiles;

-- Grant select on the view to authenticated users only
REVOKE ALL ON public.profiles_public FROM anon;
GRANT SELECT ON public.profiles_public TO authenticated;