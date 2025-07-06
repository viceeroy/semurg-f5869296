-- Fix Function Search Path Mutable warnings by setting search_path for functions

-- Update update_leaderboard_stats function to set search_path
CREATE OR REPLACE FUNCTION public.update_leaderboard_stats()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Update species count for the user who created the post
  INSERT INTO public.leaderboard_stats (user_id, date, species_count)
  VALUES (NEW.user_id, CURRENT_DATE, 1)
  ON CONFLICT (user_id, date)
  DO UPDATE SET species_count = leaderboard_stats.species_count + 1;
  
  RETURN NEW;
END;
$function$;

-- Update get_leaderboard function to set search_path
CREATE OR REPLACE FUNCTION public.get_leaderboard(period_type text)
 RETURNS TABLE(user_id uuid, username text, first_name text, last_name text, avatar_url text, species_count bigint, rank bigint)
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
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
$function$;