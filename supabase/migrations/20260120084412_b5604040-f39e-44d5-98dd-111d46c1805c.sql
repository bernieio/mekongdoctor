-- Create diagnoses table to store diagnosis history
CREATE TABLE public.diagnoses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  province TEXT NOT NULL,
  district TEXT,
  crop_type TEXT NOT NULL,
  salinity_level NUMERIC NOT NULL,
  symptoms TEXT,
  image_urls TEXT[],
  diagnosis_status TEXT NOT NULL CHECK (diagnosis_status IN ('safe', 'warning', 'danger')),
  diagnosis_message TEXT NOT NULL,
  solutions TEXT[],
  policy_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.diagnoses ENABLE ROW LEVEL SECURITY;

-- Users can view their own diagnoses
CREATE POLICY "Users can view their own diagnoses" 
ON public.diagnoses 
FOR SELECT 
USING (
  user_id IN (
    SELECT id FROM public.profiles WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  )
);

-- Users can create their own diagnoses
CREATE POLICY "Users can create their own diagnoses" 
ON public.diagnoses 
FOR INSERT 
WITH CHECK (
  user_id IN (
    SELECT id FROM public.profiles WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  )
);

-- Users can delete their own diagnoses
CREATE POLICY "Users can delete their own diagnoses" 
ON public.diagnoses 
FOR DELETE 
USING (
  user_id IN (
    SELECT id FROM public.profiles WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  )
);

-- Create index for faster queries
CREATE INDEX idx_diagnoses_user_id ON public.diagnoses(user_id);
CREATE INDEX idx_diagnoses_created_at ON public.diagnoses(created_at DESC);