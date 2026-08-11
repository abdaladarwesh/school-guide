-- Create community_posts table
CREATE TABLE public.community_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id TEXT REFERENCES public.schools(id) ON DELETE CASCADE,
    author TEXT NOT NULL,
    tag TEXT NOT NULL,
    time TEXT NOT NULL,
    body TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    replies INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access on community_posts"
ON public.community_posts
FOR SELECT
TO public
USING (true);

-- Create policy to allow public insert access
CREATE POLICY "Allow public insert access on community_posts"
ON public.community_posts
FOR INSERT
TO public
WITH CHECK (true);

-- Insert initial data
INSERT INTO public.community_posts (school_id, author, tag, time, body, likes, replies)
VALUES
(
    'ats-new-cairo',
    'Youssef A.',
    'ATS New Cairo',
    '2h',
    'Finished my first Valeo rotation this week — the PLC lab is nothing like the videos, way more hands-on. Ask me anything!',
    128,
    24
),
(
    'ats-new-cairo',
    'Mariam H.',
    'Admissions',
    '5h',
    'Does the 85% minimum include the practical subjects? My prep certificate is 84.6% and I''m nervous about the cutoff.',
    61,
    39
),
(
    'ats-new-cairo',
    'Kareem S.',
    'Careers',
    '1d',
    'Graduated from Alexandria Industrial in 2023, now an automation technician at 17k/month. The dual certificate really does open doors.',
    245,
    52
);
