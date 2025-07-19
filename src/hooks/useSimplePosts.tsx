import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Post } from "@/types/post";
import { supabase } from "@/integrations/supabase/client";
import { usePostActions } from "@/hooks/usePostActions";
import { usePostMutations } from "@/hooks/usePostMutations";

export const useSimplePosts = () => {
  const { user } = useAuth();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  // Fast, lightweight post fetching
  const fetchPosts = useCallback(async (page: number = 0, append: boolean = false) => {
    try {
      const from = page * pageSize;
      const to = from + pageSize - 1;
      
      // Super optimized query - minimal data
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          user_id,
          title,
          description,
          image_url,
          caption,
          category,
          created_at,
          profiles!inner (username, first_name, last_name, avatar_url),
          likes (user_id),
          comments (id, user_id, content, created_at, profiles (username, first_name, last_name))
        `)
        .eq('is_private', false)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      const transformedData = (data || []).map(post => ({
        ...post,
        likes: Array.isArray(post.likes) ? post.likes : [],
        comments: Array.isArray(post.comments) ? post.comments : []
      }));

      if (append) {
        setPosts(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const uniqueNewPosts = transformedData.filter(p => !existingIds.has(p.id));
          return [...prev, ...uniqueNewPosts];
        });
      } else {
        setPosts(transformedData);
      }

      setHasMore(transformedData.length === pageSize);
      return transformedData;
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  }, [pageSize]);

  const refreshPosts = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    
    try {
      await fetchPosts(0, false);
      setCurrentPage(0);
    } finally {
      if (showRefreshing) setRefreshing(false);
    }
  }, [fetchPosts]);

  const loadMorePosts = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    
    try {
      const nextPage = currentPage + 1;
      const newPosts = await fetchPosts(nextPage, true);
      
      if (newPosts.length > 0) {
        setCurrentPage(nextPage);
      } else {
        setHasMore(false);
      }
    } finally {
      setLoadingMore(false);
    }
  }, [currentPage, loadingMore, hasMore, fetchPosts]);

  // Initial load
  useEffect(() => {
    const loadInitialPosts = async () => {
      setLoading(true);
      await fetchPosts(0, false);
      setLoading(false);
    };

    loadInitialPosts();
  }, [fetchPosts]);

  const { handleLike, handleSave, handleComment } = usePostActions(user, posts, refreshPosts);
  const { handleEditPost, handleDeletePost } = usePostMutations(user, posts, setPosts);

  return {
    posts,
    loading,
    refreshing,
    loadingMore,
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