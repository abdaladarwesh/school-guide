-- Add new columns for tracking streaks and badges
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS current_streak integer default 0,
ADD COLUMN IF NOT EXISTS last_interaction_date date,
ADD COLUMN IF NOT EXISTS points integer default 0,
ADD COLUMN IF NOT EXISTS unlocked_badges text[] default '{}';

-- Function to grant a badge safely
CREATE OR REPLACE FUNCTION public.grant_badge(badge_id text)
RETURNS void AS $$
BEGIN
  -- We assume auth.uid() is the user to grant to
  IF auth.uid() IS NULL THEN
    RETURN;
  END IF;
  
  UPDATE public.profiles
  SET unlocked_badges = array_append(unlocked_badges, badge_id)
  WHERE id = auth.uid() AND NOT (badge_id = ANY(unlocked_badges));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record a daily interaction and update streak
CREATE OR REPLACE FUNCTION public.record_interaction()
RETURNS void AS $$
DECLARE
  profile_rec record;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN;
  END IF;

  SELECT * INTO profile_rec FROM public.profiles WHERE id = auth.uid();
  
  IF profile_rec.last_interaction_date = CURRENT_DATE THEN
    -- Already interacted today, do nothing for streak
  ELSIF profile_rec.last_interaction_date = CURRENT_DATE - 1 THEN
    -- Incremented streak yesterday, so today we increment it by 1
    UPDATE public.profiles 
    SET current_streak = current_streak + 1, last_interaction_date = CURRENT_DATE, points = points + 10
    WHERE id = auth.uid();
  ELSE
    -- Reset streak to 1 because missed at least one day
    UPDATE public.profiles 
    SET current_streak = 1, last_interaction_date = CURRENT_DATE, points = points + 10
    WHERE id = auth.uid();
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
