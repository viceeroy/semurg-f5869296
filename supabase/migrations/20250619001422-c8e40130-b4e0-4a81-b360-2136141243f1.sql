-- Add language column to educational_posts table
ALTER TABLE public.educational_posts 
ADD COLUMN language text DEFAULT 'english';

-- Add index for better performance on language filtering
CREATE INDEX idx_educational_posts_language ON public.educational_posts(language);