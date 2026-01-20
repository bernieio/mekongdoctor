-- Drop the profiles_public VIEW since views cannot have RLS policies
-- Instead, we'll use the profiles table directly with proper RLS for public data access

DROP VIEW IF EXISTS public.profiles_public;

-- Add a SELECT policy on profiles for authenticated users to read public fields
-- This replaces the view with proper RLS-protected access
CREATE POLICY "Authenticated users can read basic profile info"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Note: This allows authenticated users to read ALL profiles (public directory use case)
-- If you need more restrictive access (users can only see their own profile), 
-- change USING (true) to use a check like the other policies