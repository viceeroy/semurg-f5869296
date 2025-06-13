-- Add is_private field to posts table
ALTER TABLE public.posts 
ADD COLUMN is_private BOOLEAN NOT NULL DEFAULT false;

-- Update existing posts to be public
UPDATE public.posts SET is_private = false;