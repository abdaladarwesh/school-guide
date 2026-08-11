-- Create RPC to decrement likes safely
CREATE OR REPLACE FUNCTION unlike_community_post(post_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.community_posts
    SET likes = GREATEST(likes - 1, 0)
    WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;
