-- Add caption field to posts table to separate user captions from AI identification
ALTER TABLE public.posts 
ADD COLUMN caption TEXT;