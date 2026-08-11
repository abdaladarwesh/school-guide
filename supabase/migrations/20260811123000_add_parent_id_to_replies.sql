ALTER TABLE public.community_replies
ADD COLUMN parent_id UUID REFERENCES public.community_replies(id) ON DELETE CASCADE;
