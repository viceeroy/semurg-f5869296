-- Add language preference to profiles table
ALTER TABLE public.profiles 
ADD COLUMN language_preference text DEFAULT 'english' CHECK (language_preference IN ('english', 'uzbek'));