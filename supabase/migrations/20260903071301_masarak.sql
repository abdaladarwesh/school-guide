-- Drop existing schools table if it exists
DROP TABLE IF EXISTS public.schools CASCADE;

-- Create a table for opportunities (scholarships, internships, etc.)
CREATE TABLE public.opportunities (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    institution TEXT NOT NULL,
    location TEXT NOT NULL,
    image TEXT,
    badge TEXT,
    funding_type TEXT,
    deadline TEXT,
    category TEXT,
    about TEXT,
    requirements JSONB
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access on opportunities"
ON public.opportunities
FOR SELECT
TO public
USING (true);

-- Create policy to allow admin insert access
CREATE POLICY "Allow admin insert access on opportunities"
ON public.opportunities
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Create policy to allow admin update access
CREATE POLICY "Allow admin update access on opportunities"
ON public.opportunities
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Create policy to allow admin delete access
CREATE POLICY "Allow admin delete access on opportunities"
ON public.opportunities
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Insert initial data
INSERT INTO public.opportunities (id, title, institution, location, image, badge, funding_type, deadline, category, about, requirements)
VALUES
(
    'opp-tum-full',
    'Full Scholarship for Applied Technology Students in Germany',
    'Technical University of Munich',
    'Munich, Germany',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    'Available for Technical Diplomas',
    'Full Funding',
    '20 days left',
    'Full Funding',
    'A fully-funded bachelor program designed for exceptional ATS graduates. It includes language preparation, living stipends, and direct admission into the Mechatronics engineering program.',
    '{"minGrade": "90% in technical diploma", "language": "German B1 required before travel", "experience": "Minimum 3 months practical training"}'::jsonb
),
(
    'opp-siemens-vocational',
    'Mechatronics Vocational Training Program',
    'Siemens Academy',
    'Berlin, Germany',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    'Available for ATS Graduates',
    'Partial Funding',
    '5 days left',
    'Vocational',
    'An intensive 6-month hands-on training program inside Siemens facilities. Students will work with advanced robotics and automation systems.',
    '{"minGrade": "75% in technical diploma", "language": "English B2 or German A2", "experience": "Prior knowledge of PLC programming"}'::jsonb
);

-- Note: We are not removing the profiles table, but its gamification fields (current_streak, points, unlocked_badges) 
-- will be ignored by the UI. Future migrations can drop these columns if desired.
