-- Create fields_of_study lookup table
CREATE TABLE IF NOT EXISTS public.fields_of_study (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.fields_of_study ENABLE ROW LEVEL SECURITY;

-- Allow read access to all users (including anonymous)
CREATE POLICY "Allow public read access to fields_of_study" ON public.fields_of_study FOR SELECT USING (true);

-- Allow insert to authenticated users (so admin can add them)
CREATE POLICY "Allow authenticated insert to fields_of_study" ON public.fields_of_study FOR INSERT TO authenticated WITH CHECK (true);

-- Add main_field_of_study to schools
ALTER TABLE public.schools 
ADD COLUMN IF NOT EXISTS main_field_of_study TEXT;
