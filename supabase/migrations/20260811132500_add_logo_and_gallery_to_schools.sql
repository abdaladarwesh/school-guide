-- Add logo and gallery columns to schools table
ALTER TABLE schools 
ADD COLUMN IF NOT EXISTS logo TEXT,
ADD COLUMN IF NOT EXISTS gallery TEXT[];
