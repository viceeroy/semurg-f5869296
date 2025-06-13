import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Post } from "@/types/post";
import { mockPosts } from "@/data/mockPosts";

export const usePosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (username, avatar_url),
          likes (user_id),
          comments (
            id,
            user_id,
            content,
            created_at,
            profiles (username)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        return;
      }

      setPosts(data && data.length > 0 ? data : mockPosts);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

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
      }

      // Refresh posts
      fetchPosts();
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

      // Refresh posts to show new comment
      fetchPosts();
      toast.success('Comment added!');
    } catch (error) {
      toast.error('Error adding comment');
    }
  };

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
      setPosts(prevPosts => 
        prevPosts.map(post => 
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
      // TODO: Implement actual delete API call
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      toast.success('Post deleted successfully!');
    } catch (error) {
      toast.error('Error deleting post');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    handleLike,
    handleSave,
    handleComment,
    handleEditPost,
    handleDeletePost
  };
};