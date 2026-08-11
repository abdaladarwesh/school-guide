-- Create badges lookup table
CREATE TABLE IF NOT EXISTS public.badges (
  id text PRIMARY KEY,
  name text NOT NULL,
  emoji text NOT NULL,
  description text NOT NULL,
  is_premium boolean DEFAULT false
);

-- Enable RLS for badges
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

-- Allow public read access to badges
CREATE POLICY "Allow public read access on badges" 
  ON public.badges FOR SELECT 
  USING (true);

-- Insert initial badges
INSERT INTO public.badges (id, name, emoji, description, is_premium) VALUES
  ('plus_member', 'Plus Member', '✨', 'Subscribed to the Plus plan.', true),
  ('max_member', 'Max Member', '💎', 'Subscribed to the Max plan.', true),
  ('helper', 'Helper', '🤝', 'Helped out by replying to a post in the school community.', false),
  ('week_warrior', 'Week Warrior', '🔥', 'Maintained a 7-day interaction streak.', false),
  ('quiz_master', 'Quiz Master', '📚', 'Aced the weekly quiz.', false),
  ('top_100', 'Top 100', '🏅', 'Ranked in the top 100 on the leaderboard.', false),
  ('30_day_club', '30-Day Club', '🚀', 'Maintained an incredible 30-day interaction streak.', false),
  ('legend', 'Legend', '👑', 'Reached the absolute highest rank and respect in the community.', false),
  ('top_1', 'Top 1', '🥇', 'Reached #1 on your school leaderboard.', false)
ON CONFLICT (id) DO UPDATE 
SET 
  name = EXCLUDED.name,
  emoji = EXCLUDED.emoji,
  description = EXCLUDED.description,
  is_premium = EXCLUDED.is_premium;

-- Replace record_interaction to also grant top_1 badge
CREATE OR REPLACE FUNCTION public.record_interaction()
RETURNS void AS $$
DECLARE
  profile_rec record;
  new_streak integer;
  max_streak integer;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN;
  END IF;

  SELECT * INTO profile_rec FROM public.profiles WHERE id = auth.uid();
  
  IF profile_rec.last_interaction_date = CURRENT_DATE THEN
    -- Already interacted today, do nothing for streak
    new_streak := profile_rec.current_streak;
  ELSIF profile_rec.last_interaction_date = CURRENT_DATE - 1 THEN
    -- Incremented streak yesterday, so today we increment it by 1
    new_streak := profile_rec.current_streak + 1;
    UPDATE public.profiles 
    SET current_streak = new_streak, last_interaction_date = CURRENT_DATE, points = points + 10
    WHERE id = auth.uid();
  ELSE
    -- Reset streak to 1 because missed at least one day
    new_streak := 1;
    UPDATE public.profiles 
    SET current_streak = new_streak, last_interaction_date = CURRENT_DATE, points = points + 10
    WHERE id = auth.uid();
  END IF;

  -- Check if they are now the top 1 in their school
  IF profile_rec.school_id IS NOT NULL AND new_streak > 0 THEN
    -- Find max streak in the school
    SELECT COALESCE(MAX(current_streak), 0) INTO max_streak FROM public.profiles WHERE school_id = profile_rec.school_id;
    
    -- If their new streak is at least the max streak of the school, they get the top_1 badge
    IF new_streak >= max_streak THEN
      UPDATE public.profiles
      SET unlocked_badges = array_append(unlocked_badges, 'top_1')
      WHERE id = auth.uid() AND NOT ('top_1' = ANY(unlocked_badges));
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
