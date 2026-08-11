-- Drop existing text column and add author_id foreign key for community_posts
ALTER TABLE public.community_posts
ADD COLUMN author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.community_posts
DROP COLUMN author;

-- Drop existing text column and add author_id foreign key for community_replies
ALTER TABLE public.community_replies
ADD COLUMN author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.community_replies
DROP COLUMN author;
