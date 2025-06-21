-- Update language preference default to uzbek
ALTER TABLE public.profiles 
ALTER COLUMN language_preference SET DEFAULT 'uzbek';

-- Update existing users who have the default 'english' to 'uzbek' 
UPDATE public.profiles 
SET language_preference = 'uzbek' 
WHERE language_preference = 'english';