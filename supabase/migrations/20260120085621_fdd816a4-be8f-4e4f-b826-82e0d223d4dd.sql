-- Create scholarship_applications table
CREATE TABLE public.scholarship_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create loan_applications table
CREATE TABLE public.loan_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create venture_applications table
CREATE TABLE public.venture_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.scholarship_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venture_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for scholarship_applications
CREATE POLICY "Users can view their own scholarship applications"
ON public.scholarship_applications FOR SELECT
USING (user_id IN (
  SELECT id FROM public.profiles 
  WHERE clerk_user_id = ((current_setting('request.jwt.claims', true))::json ->> 'sub')
));

CREATE POLICY "Users can create their own scholarship applications"
ON public.scholarship_applications FOR INSERT
WITH CHECK (user_id IN (
  SELECT id FROM public.profiles 
  WHERE clerk_user_id = ((current_setting('request.jwt.claims', true))::json ->> 'sub')
));

-- RLS Policies for loan_applications
CREATE POLICY "Users can view their own loan applications"
ON public.loan_applications FOR SELECT
USING (user_id IN (
  SELECT id FROM public.profiles 
  WHERE clerk_user_id = ((current_setting('request.jwt.claims', true))::json ->> 'sub')
));

CREATE POLICY "Users can create their own loan applications"
ON public.loan_applications FOR INSERT
WITH CHECK (user_id IN (
  SELECT id FROM public.profiles 
  WHERE clerk_user_id = ((current_setting('request.jwt.claims', true))::json ->> 'sub')
));

-- RLS Policies for venture_applications
CREATE POLICY "Users can view their own venture applications"
ON public.venture_applications FOR SELECT
USING (user_id IN (
  SELECT id FROM public.profiles 
  WHERE clerk_user_id = ((current_setting('request.jwt.claims', true))::json ->> 'sub')
));

CREATE POLICY "Users can create their own venture applications"
ON public.venture_applications FOR INSERT
WITH CHECK (user_id IN (
  SELECT id FROM public.profiles 
  WHERE clerk_user_id = ((current_setting('request.jwt.claims', true))::json ->> 'sub')
));