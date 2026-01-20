-- Fix profiles table RLS policy: owner-only access instead of USING(true)
DROP POLICY IF EXISTS "Authenticated users can read basic profile info" ON public.profiles;

-- Add owner-only policy for profiles
CREATE POLICY "Users can read own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  clerk_user_id = ((current_setting('request.jwt.claims', true))::json ->> 'sub')
);