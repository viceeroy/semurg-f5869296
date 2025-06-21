-- Fix Function Search Path Mutable warnings by setting search_path for all functions

-- Update get_follower_count function
CREATE OR REPLACE FUNCTION public.get_follower_count(user_id uuid)
 RETURNS integer
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  SELECT count(*)::integer
  FROM public.follows
  WHERE following_id = user_id;
$function$;

-- Update get_following_count function
CREATE OR REPLACE FUNCTION public.get_following_count(user_id uuid)
 RETURNS integer
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  SELECT count(*)::integer
  FROM public.follows
  WHERE follower_id = user_id;
$function$;

-- Update update_educational_post_likes_count function
CREATE OR REPLACE FUNCTION public.update_educational_post_likes_count()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.educational_posts 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.educational_posts 
    SET likes_count = likes_count - 1 
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$;

-- Update update_educational_post_comments_count function
CREATE OR REPLACE FUNCTION public.update_educational_post_comments_count()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.educational_posts 
    SET comments_count = comments_count + 1 
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.educational_posts 
    SET comments_count = comments_count - 1 
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$;