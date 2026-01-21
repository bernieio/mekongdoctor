-- Make user_id nullable for anonymous users
ALTER TABLE public.diagnoses ALTER COLUMN user_id DROP NOT NULL;

-- Drop existing restrictive policies if necessary (optional, but cleaner)
-- DROP POLICY IF EXISTS "Users can create their own diagnoses" ON public.diagnoses;

-- Create policy to allow anonymous inserts (if not using Service Role) based on checks
-- However, since we use Service Role in Edge Function, we just need the column to be nullable.

-- Grant access to anonymous users for reading (if we want public results)
GRANT SELECT ON public.diagnoses TO anon;

-- Explicitly allow service_role everything
GRANT ALL ON public.diagnoses TO service_role;
