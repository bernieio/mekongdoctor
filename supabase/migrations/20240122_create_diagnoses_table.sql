-- Create diagnoses table
create table if not exists public.diagnoses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid, -- Nullable for anonymous users
  province text not null,
  district text,
  crop_type text not null,
  salinity_level numeric not null,
  symptoms text,
  image_urls text[] default array[]::text[],
  diagnosis_status text not null check (diagnosis_status in ('safe', 'warning', 'danger')),
  diagnosis_message text not null,
  solutions text[] default array[]::text[],
  policy_info text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.diagnoses enable row level security;

-- Policy: Allow anonymous users to insert (if service role is used, this might not be strictly necessary for the Edge Function, but good practice for client-side)
-- However, since we use Service Role in the Edge Function, we bypass RLS.
-- We can add a policy for reading if needed later.

-- Optional: Create index on created_at for sorting
create index if not exists diagnoses_created_at_idx on public.diagnoses (created_at desc);

-- Optional: Grant access if specific roles need it (usually handled by Supabase default roles)
grant all on public.diagnoses to service_role;
grant select, insert on public.diagnoses to anon;
grant select, insert on public.diagnoses to authenticated;
