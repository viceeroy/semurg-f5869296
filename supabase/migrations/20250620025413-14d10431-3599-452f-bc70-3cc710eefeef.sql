-- Add full name fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN first_name text,
ADD COLUMN last_name text;

-- Create follows table for following/followers relationships
CREATE TABLE public.follows (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id uuid NOT NULL,
  following_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

-- Enable RLS on follows table
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- Create policies for follows table
CREATE POLICY "Users can view all follows" 
ON public.follows 
FOR SELECT 
USING (true);

CREATE POLICY "Users can follow others" 
ON public.follows 
FOR INSERT 
WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow others" 
ON public.follows 
FOR DELETE 
USING (auth.uid() = follower_id);

-- Create function to get follower count
CREATE OR REPLACE FUNCTION public.get_follower_count(user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
AS $$
  SELECT count(*)::integer
  FROM public.follows
  WHERE following_id = user_id;
$$;

-- Create function to get following count
CREATE OR REPLACE FUNCTION public.get_following_count(user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
AS $$
  SELECT count(*)::integer
  FROM public.follows
  WHERE follower_id = user_id;
$$;