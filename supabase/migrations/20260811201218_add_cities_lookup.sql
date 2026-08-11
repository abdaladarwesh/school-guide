-- Create cities lookup table
CREATE TABLE IF NOT EXISTS public.cities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

-- Allow read access to all users (including anonymous)
CREATE POLICY "Allow public read access to cities" ON public.cities FOR SELECT USING (true);

-- Allow insert to authenticated users (so admin can add them)
CREATE POLICY "Allow authenticated insert to cities" ON public.cities FOR INSERT TO authenticated WITH CHECK (true);
