import { EducationalPost, fetchEducationalPosts, likeEducationalPost, unlikeEducationalPost, fetchEducationalPostLikes } from "@/services/educationalPostService";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const useEducationalPosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<EducationalPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);

  const loadPosts = async (searchQuery?: string, category?: string) => {
    setLoading(true);
    try {
      const data = await fetchEducationalPosts(searchQuery, category);
      
      // Get user's liked posts if logged in
      let userLikes: string[] = [];
      if (user) {
        userLikes = await fetchEducationalPostLikes(user.id);
        setLikedPosts(userLikes);
      }

      // Add is_liked property to posts
      const postsWithLikes = data.map(post => ({
        ...post,
        is_liked: userLikes.includes(post.id)
      }));

      setPosts(postsWithLikes);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Failed to load posts');
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

    const isCurrentlyLiked = post.is_liked;

    try {
      if (isCurrentlyLiked) {
        await unlikeEducationalPost(postId, user.id);
      } else {
        await likeEducationalPost(postId, user.id);
      }

      // Update local state
      setPosts(prevPosts => 
        prevPosts.map(p => 
          p.id === postId 
            ? { 
                ...p, 
                is_liked: !isCurrentlyLiked,
                likes_count: isCurrentlyLiked ? p.likes_count - 1 : p.likes_count + 1
              }
            : p
        )
      );

      setLikedPosts(prev => 
        isCurrentlyLiked 
          ? prev.filter(id => id !== postId)
          : [...prev, postId]
      );

    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    }
  };

  const handleComment = (postId: string) => {
    // For now, just show a message - can be expanded later
    toast.info('Comments feature coming soon!');
  };

  const handleShare = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post && navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content.substring(0, 100) + '...',
        url: window.location.href
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return {
    posts,
    loading,
    loadPosts,
    handleLike,
    handleComment,
    handleShare
  };
};