
-- Drop the existing function first
DROP FUNCTION IF EXISTS get_leaderboard(TEXT);

-- Create updated function that uses existing posts data
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
        ELSE CURRENT_DATE
      END as start_date
  ),
  user_post_stats AS (
    SELECT 
      p.user_id,
      COUNT(p.id) as total_posts
    FROM public.posts p, date_filter df
    WHERE 
      p.is_private = false AND
      (
        (period_type = 'today' AND DATE(p.created_at) = df.start_date) OR
        (period_type = 'week' AND p.created_at >= df.start_date) OR
        (period_type = 'month' AND p.created_at >= df.start_date)
      )
    GROUP BY p.user_id
    HAVING COUNT(p.id) > 0
  )
  SELECT 
    ups.user_id,
    prof.username,
    prof.first_name,
    prof.last_name,
    prof.avatar_url,
    ups.total_posts as species_count,
    ROW_NUMBER() OVER (ORDER BY ups.total_posts DESC, prof.username ASC) as rank
  FROM user_post_stats ups
  JOIN public.profiles prof ON ups.user_id = prof.id
  ORDER BY ups.total_posts DESC, prof.username ASC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- Populate leaderboard_stats with historical data
INSERT INTO public.leaderboard_stats (user_id, date, species_count)
SELECT 
  user_id,
  DATE(created_at) as post_date,
  COUNT(*) as daily_count
FROM public.posts 
WHERE is_private = false
GROUP BY user_id, DATE(created_at)
ON CONFLICT (user_id, date) DO UPDATE SET
  species_count = EXCLUDED.species_count;
