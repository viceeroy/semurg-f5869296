import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Post } from "@/types/post";
import { createNotification } from "@/services/notificationService";

export const usePostActions = (
  user: any,
  posts: Post[],
  refreshPosts: () => Promise<void>
) => {
  const handleLike = async (postId: string) => {
    if (!user) {
      toast.error('Please sign in to like posts');
      return;
    }

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const isLiked = post.likes.some(like => like.user_id === user.id);

    try {
      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (error) {
          toast.error('Error unliking post');
          return;
        }
      } else {
        // Like
        const { error } = await supabase
          .from('likes')
          .insert({ post_id: postId, user_id: user.id });

        if (error) {
          toast.error('Error liking post');
          return;
        }

        // Create notification for the post owner
        if (!isLiked && post.user_id !== user.id) {
          await createNotification(
            post.user_id,
            'like',
            'New Like',
            `Someone liked your post`,
            postId,
            user.id
          );
        }
      }

      // Refresh posts
      await refreshPosts();
    } catch (error) {
      toast.error('Error updating like');
    }
  };

  const handleSave = async (postId: string) => {
    if (!user) {
      toast.error('Please sign in to save posts');
      return;
    }

    try {
      // Check if post is already saved
      const { data: existingSave } = await supabase
        .from('saved_posts')
        .select('id')
        .eq('user_id', user.id)
        .eq('post_id', postId)
        .single();

      if (existingSave) {
        // Unsave the post
        const { error } = await supabase
          .from('saved_posts')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', postId);

        if (error) {
          toast.error('Error removing from saved posts');
          return;
        }
        toast.success('Post removed from saved');
      } else {
        // Save the post
        const { error } = await supabase
          .from('saved_posts')
          .insert({ user_id: user.id, post_id: postId });

        if (error) {
          toast.error('Error saving post');
          return;
        }
        toast.success('Post saved to your collection!');
      }
    } catch (error) {
      toast.error('Error updating saved posts');
    }
  };

  const handleComment = async (postId: string, content: string) => {
    if (!user) {
      toast.error('Please sign in to comment');
      return;
    }

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content: content
        });

      if (error) {
        toast.error('Error adding comment');
        return;
      }

      // Create notification for the post owner
      const post = posts.find(p => p.id === postId);
      if (post && post.user_id !== user.id) {
        await createNotification(
          post.user_id,
          'comment',
          'New Comment',
          `Someone commented on your post: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`,
          postId,
          user.id
        );
      }

      // Refresh posts to show new comment
      await refreshPosts();
      toast.success('Comment added!');
    } catch (error) {
      toast.error('Error adding comment');
    }
  };

  return {
    handleLike,
    handleSave,
    handleComment
  };
};