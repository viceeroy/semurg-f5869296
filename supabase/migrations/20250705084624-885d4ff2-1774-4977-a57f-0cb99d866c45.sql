
-- Create badges table
CREATE TABLE public.badges (
  id TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_uz TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_uz TEXT NOT NULL,
  icon_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_badges table to track which badges users have earned
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Create leaderboard_stats table to track user statistics
CREATE TABLE public.leaderboard_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  species_count INTEGER DEFAULT 0,
  total_likes INTEGER DEFAULT 0,
  UNIQUE(user_id, date)
);

-- Enable RLS on all tables
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_stats ENABLE ROW LEVEL SECURITY;

-- RLS policies for badges (public read)
CREATE POLICY "Anyone can view badges" ON public.badges FOR SELECT USING (true);

-- RLS policies for user_badges
CREATE POLICY "Anyone can view user badges" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "System can insert user badges" ON public.user_badges FOR INSERT WITH CHECK (true);

-- RLS policies for leaderboard_stats
CREATE POLICY "Anyone can view leaderboard stats" ON public.leaderboard_stats FOR SELECT USING (true);
CREATE POLICY "System can insert leaderboard stats" ON public.leaderboard_stats FOR INSERT WITH CHECK (true);
CREATE POLICY "System can update leaderboard stats" ON public.leaderboard_stats FOR UPDATE USING (true);

-- Insert initial badges
INSERT INTO public.badges (id, name_en, name_uz, description_en, description_uz) VALUES
('top_day', 'Top Explorer Today', 'Bugungi Top Izlovchi', 'Ranked #1 in today''s leaderboard', 'Bugungi reytingda birinchi o''rinni egallagan'),
('top_week', 'Weekly Champion', 'Haftaning G''olibi', 'Ranked #1 in weekly leaderboard', 'Haftalik reytingda birinchi o''rin'),
('monthly_master', 'Monthly Master', 'Oyning Ustasi', 'Ranked #1 in monthly leaderboard', 'Oylik reytingda birinchi o''rin'),
('consistent_hunter', 'Consistent Hunter', 'Doimiy Faol Izlovchi', 'Top 10 in 5 or more days', '5 kun davomida top 10 ichida bo''lgan'),
('species_collector', 'Species Collector', 'Tabiat Kolleksioneri', 'Discovered 50+ unique species', '50 dan ortiq turdagi jonivor topgan'),
('eco_ambassador', 'Eco Ambassador', 'Eko-Elchi', 'Received 100+ total likes', 'Postlarida 100+ layk olgan foydalanuvchi');

-- Function to update daily leaderboard stats
CREATE OR REPLACE FUNCTION update_leaderboard_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update species count for the user who created the post
  INSERT INTO public.leaderboard_stats (user_id, date, species_count)
  VALUES (NEW.user_id, CURRENT_DATE, 1)
  ON CONFLICT (user_id, date)
  DO UPDATE SET species_count = leaderboard_stats.species_count + 1;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update stats when new post is created
CREATE TRIGGER update_leaderboard_on_post_insert
  AFTER INSERT ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION update_leaderboard_stats();

-- Function to get leaderboard data
CREATE OR REPLACE FUNCTION get_leaderboard(period_type TEXT)
RETURNS TABLE (
  user_id UUID,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  species_count BIGINT,
  rank BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH date_filter AS (
    SELECT 
      CASE 
        WHEN period_type = 'today' THEN CURRENT_DATE
        WHEN period_type = 'week' THEN CURRENT_DATE - INTERVAL '7 days'
        WHEN period_type = 'month' THEN CURRENT_DATE - INTERVAL '30 days'
      END as start_date
  ),
  user_stats AS (
    SELECT 
      ls.user_id,
      SUM(ls.species_count) as total_species
    FROM public.leaderboard_stats ls, date_filter df
    WHERE 
      (period_type = 'today' AND ls.date = df.start_date) OR
      (period_type != 'today' AND ls.date >= df.start_date)
    GROUP BY ls.user_id
  )
  SELECT 
    us.user_id,
    p.username,
    p.first_name,
    p.last_name,
    p.avatar_url,
    us.total_species,
    ROW_NUMBER() OVER (ORDER BY us.total_species DESC) as rank
  FROM user_stats us
  JOIN public.profiles p ON us.user_id = p.id
  ORDER BY us.total_species DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;
