-- Drop existing view and recreate without sensitive clerk_user_id
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

-- Note: Views with security_invoker inherit RLS from the base table (profiles)
-- Since profiles has "USING (false)" for SELECT, this view is also protected