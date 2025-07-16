import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Post } from "@/types/post";
import { fetchPosts as fetchPostsService } from "@/services/postService";
import { usePostActions } from "@/hooks/usePostActions";
import { usePostMutations } from "@/hooks/usePostMutations";

export const usePosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const refreshPosts = async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    }
    try {
      const data = await fetchPostsService(0, pageSize);
      setPosts(data);
      setCurrentPage(0);
      setHasMore(data.length === pageSize);
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
      await refreshPosts();
      console.log('fetchPosts completed');
    } finally {
      setLoading(false);
    }
  };

  const loadMorePosts = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const newPosts = await fetchPostsService(nextPage, pageSize);
      
      if (newPosts.length > 0) {
        setPosts(prev => [...prev, ...newPosts]);
        setCurrentPage(nextPage);
        setHasMore(newPosts.length === pageSize);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [currentPage, loadingMore, hasMore, pageSize]);

  const { handleLike, handleSave, handleComment } = usePostActions(user, posts, refreshPosts);
  const { handleEditPost, handleDeletePost } = usePostMutations(user, posts, setPosts);

  useEffect(() => {
    let isMounted = true;
    
    const initializePosts = async () => {
      if (isMounted) {
        await fetchPosts();
      }
    };
    
    initializePosts();
    
    return () => {
      isMounted = false;
    };
  }, []);

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