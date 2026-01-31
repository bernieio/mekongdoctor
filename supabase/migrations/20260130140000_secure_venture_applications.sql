-- Secure venture_applications table by restricting public read access
-- Explicitly add a "false" policy to ensure no public access (redundant but safe)
DROP POLICY IF EXISTS "Restrict public read access" ON "public"."venture_applications";
CREATE POLICY "Restrict public read access"
ON "public"."venture_applications"
FOR SELECT
USING (false);

-- Allow Admins (Business Development Staff) to view all venture applications
DROP POLICY IF EXISTS "Admins can view all venture applications" ON "public"."venture_applications";
CREATE POLICY "Admins can view all venture applications"
ON "public"."venture_applications"
FOR SELECT
USING (
  public.has_role(
    (current_setting('request.jwt.claims', true)::json->>'sub'), 
    'admin'::public.app_role
  )
);
