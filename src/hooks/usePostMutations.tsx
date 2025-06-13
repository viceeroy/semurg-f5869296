import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Post } from "@/types/post";

export const usePostMutations = (
  user: any,
  posts: Post[],
  setPosts: (posts: Post[]) => void
) => {
  const handleEditPost = async (postId: string, caption: string, hashtags: string) => {
    if (!user) {
      toast.error('Please sign in to edit posts');
      return;
    }

    try {
      // Update the caption field, not the description (AI identification)
      const { error } = await supabase
        .from('posts')
        .update({ caption: caption })
        .eq('id', postId)
        .eq('user_id', user.id);

      if (error) {
        toast.error('Error updating post');
        return;
      }

      // Update local state
      setPosts(
        posts.map(post => 
          post.id === postId 
            ? { ...post, caption: caption }
            : post
        )
      );
      
      toast.success('Post updated successfully!');
    } catch (error) {
      toast.error('Error updating post');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!user) {
      toast.error('Please sign in to delete posts');
      return;
    }

    try {
      // Delete from database
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user.id);

      if (error) {
        toast.error('Error deleting post');
        return;
      }

      // Update local state
      setPosts(posts.filter(post => post.id !== postId));
      toast.success('Post deleted successfully!');
    } catch (error) {
      toast.error('Error deleting post');
    }
  };

  return {
    handleEditPost,
    handleDeletePost
  };
};