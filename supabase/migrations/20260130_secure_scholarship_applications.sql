-- Secure scholarship_applications table by restricting public read access
-- Only users with specific permissions (handled by other policies) should be able to read

DROP POLICY IF EXISTS "Restrict public read access" ON "public"."scholarship_applications";
CREATE POLICY "Restrict public read access"
ON "public"."scholarship_applications"
FOR SELECT
USING (false);
