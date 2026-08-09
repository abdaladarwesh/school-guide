-- Create a table for schools
CREATE TABLE public.schools (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    location TEXT NOT NULL,
    image TEXT,
    rating NUMERIC,
    partner TEXT,
    partner_rating NUMERIC,
    students TEXT,
    established TEXT,
    hired TEXT,
    prime BOOLEAN DEFAULT false,
    about TEXT,
    specializations JSONB,
    careers JSONB,
    admission JSONB
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access on schools"
ON public.schools
FOR SELECT
TO public
USING (true);

-- Insert initial data
INSERT INTO public.schools (id, name, city, location, rating, partner, partner_rating, students, established, hired, prime, about, specializations, careers, admission)
VALUES
(
    'ats-new-cairo',
    'ATS New Cairo',
    'Cairo',
    'New Cairo, Cairo Governorate',
    4.8,
    'Valeo Egypt',
    4.9,
    '420+',
    '2019',
    '310',
    true,
    'ATS New Cairo is a flagship Applied Technology School focused on software, data and cloud engineering. Students split their week between classroom learning and paid on-site training at partner facilities, graduating with a dual Egyptian–German certification.',
    '[{"name": "Software Engineering", "detail": "3-year program • Dual certification", "emoji": "💻"}, {"name": "AI & Data Science", "detail": "3-year program • Dual certification", "emoji": "🤖"}, {"name": "Cybersecurity", "detail": "3-year program • Industry certificate", "emoji": "🛡️"}, {"name": "Cloud Computing", "detail": "3-year program • AWS pathway", "emoji": "☁️"}]'::jsonb,
    '[{"role": "Software Developer", "salary": "EGP 14k – 26k / mo", "from": "Software Engineering"}, {"role": "Data Analyst", "salary": "EGP 12k – 22k / mo", "from": "AI & Data Science"}, {"role": "Cloud Engineer", "salary": "EGP 16k – 30k / mo", "from": "Cloud Computing"}, {"role": "SOC Analyst", "salary": "EGP 13k – 24k / mo", "from": "Cybersecurity"}]'::jsonb,
    '{"minGrade": "85% in preparatory certificate", "background": "STEM / science track preferred", "age": "15 – 18 years old", "interview": "Personal interview + aptitude test required"}'::jsonb
),
(
    'ats-alexandria',
    'ATS Alexandria Industrial',
    'Alexandria',
    'Smouha, Alexandria',
    4.6,
    'Schneider Electric',
    4.7,
    '380+',
    '2018',
    '265',
    true,
    'A mechatronics-first school built inside a working industrial district. Workshops are equipped by partner factories, and every student completes two rotations on a real production line.',
    '[{"name": "Mechatronics", "detail": "3-year program • Dual certification", "emoji": "⚙️"}, {"name": "Industrial Automation", "detail": "3-year program • PLC certification", "emoji": "🏭"}, {"name": "Electrical Maintenance", "detail": "3-year program • Field training", "emoji": "🔌"}]'::jsonb,
    '[{"role": "Automation Technician", "salary": "EGP 11k – 20k / mo", "from": "Industrial Automation"}, {"role": "Mechatronics Engineer Asst.", "salary": "EGP 12k – 22k / mo", "from": "Mechatronics"}, {"role": "Maintenance Specialist", "salary": "EGP 10k – 18k / mo", "from": "Electrical Maintenance"}]'::jsonb,
    '{"minGrade": "80% in preparatory certificate", "background": "Any track • strong maths", "age": "15 – 18 years old", "interview": "Workshop practical assessment required"}'::jsonb
);
