-- Create community_replies table
CREATE TABLE public.community_replies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    author TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.community_replies ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access on community_replies"
ON public.community_replies
FOR SELECT
TO public
USING (true);

-- Create policy to allow public insert access
CREATE POLICY "Allow public insert access on community_replies"
ON public.community_replies
FOR INSERT
TO public
WITH CHECK (true);

-- Create trigger to auto-increment replies count on the post
CREATE OR REPLACE FUNCTION increment_post_replies()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.community_posts
    SET replies = replies + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_reply_added
AFTER INSERT ON public.community_replies
FOR EACH ROW EXECUTE FUNCTION increment_post_replies();

-- Create RPC to increment likes safely
CREATE OR REPLACE FUNCTION like_community_post(post_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.community_posts
    SET likes = likes + 1
    WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- Also allow updates on community_posts in case we need to update things directly from frontend
CREATE POLICY "Allow public update access on community_posts"
ON public.community_posts
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);
