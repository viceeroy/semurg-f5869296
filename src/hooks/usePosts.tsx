
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Post } from "@/types/post";
import { fetchPosts as fetchPostsService, clearPostsCache } from "@/services/postService";
import { usePostActions } from "@/hooks/usePostActions";
import { usePostMutations } from "@/hooks/usePostMutations";

export const usePosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const refreshPosts = async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    }
    try {
      clearPostsCache(); // Clear cache on refresh
      const data = await fetchPostsService(10, 0); // Load only 10 posts initially
      setPosts(data);
      setHasMore(data.length === 10);
    } finally {
      if (showRefreshing) {
        setRefreshing(false);
      }
    }
  };

  const fetchPosts = async () => {
    console.log('fetchPosts called');
    setLoading(true);
    try {
      const data = await fetchPostsService(8, 0); // Reduce to 8 for faster initial load
      setPosts(data);
      setHasMore(data.length === 8);
      console.log('fetchPosts completed, loaded:', data.length, 'posts');
    } finally {
      setLoading(false);
    }
  };

  const loadMorePosts = async () => {
    if (!hasMore || loading) return;
    
    try {
      const newPosts = await fetchPostsService(6, posts.length); // Load 6 more at a time
      if (newPosts.length > 0) {
        setPosts(prev => [...prev, ...newPosts]);
        setHasMore(newPosts.length === 6);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
    }
  };

  const { handleLike, handleSave, handleComment } = usePostActions(user, posts, refreshPosts);
  const { handleEditPost, handleDeletePost } = usePostMutations(user, posts, setPosts);

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    refreshing,
    hasMore,
    refreshPosts,
    loadMorePosts,
    handleLike,
    handleSave,
    handleComment,
    handleEditPost,
    handleDeletePost
  };
};
