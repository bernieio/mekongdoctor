-- Drop overly permissive policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Service role can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Service role can delete profiles" ON public.profiles;
DROP POLICY IF EXISTS "User roles are viewable by everyone" ON public.user_roles;
DROP POLICY IF EXISTS "Service role can manage user roles" ON public.user_roles;

-- Create restrictive policies for profiles
-- Only allow reading own profile (for authenticated Supabase users) or none for anonymous
CREATE POLICY "Profiles are not publicly readable"
ON public.profiles FOR SELECT
USING (false);

-- Service role (used by edge functions) bypasses RLS, so no INSERT/UPDATE/DELETE policies needed
-- But we add explicit deny for safety
CREATE POLICY "No direct insert to profiles"
ON public.profiles FOR INSERT
WITH CHECK (false);

CREATE POLICY "No direct update to profiles"
ON public.profiles FOR UPDATE
USING (false);

CREATE POLICY "No direct delete from profiles"
ON public.profiles FOR DELETE
USING (false);

-- Same for user_roles
CREATE POLICY "User roles are not publicly readable"
ON public.user_roles FOR SELECT
USING (false);

CREATE POLICY "No direct insert to user_roles"
ON public.user_roles FOR INSERT
WITH CHECK (false);

CREATE POLICY "No direct update to user_roles"
ON public.user_roles FOR UPDATE
USING (false);

CREATE POLICY "No direct delete from user_roles"
ON public.user_roles FOR DELETE
USING (false);

-- Create a public view with only non-sensitive fields for display purposes
CREATE VIEW public.profiles_public
WITH (security_invoker = on) AS
SELECT 
  id,
  clerk_user_id,
  full_name,
  avatar_url,
  province,
  created_at
FROM public.profiles;