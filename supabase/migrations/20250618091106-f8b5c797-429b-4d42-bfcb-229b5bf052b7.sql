-- Check if trigger exists for educational_post_comments
-- If not, create the trigger to update comments count

-- Create trigger to automatically update educational_posts.comments_count when comments are added/removed
CREATE OR REPLACE TRIGGER update_educational_post_comments_count_trigger
  AFTER INSERT OR DELETE ON public.educational_post_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_educational_post_comments_count();

-- Also fix any existing posts that might have incorrect comment counts
UPDATE public.educational_posts 
SET comments_count = (
  SELECT COUNT(*) 
  FROM public.educational_post_comments 
  WHERE educational_post_comments.post_id = educational_posts.id
);