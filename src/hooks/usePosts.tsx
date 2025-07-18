
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Post } from "@/types/post";
import { fetchPosts as fetchPostsService, preloadNextPage } from "@/services/postService";
import { usePostActions } from "@/hooks/usePostActions";
import { usePostMutations } from "@/hooks/usePostMutations";
import { useAdvancedCache } from "@/hooks/useAdvancedCache";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";

export const usePosts = () => {
  const { user } = useAuth();
  const { trackApiCall, trackUserAction, logPerformanceReport } = usePerformanceMonitor('usePosts');
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 10;

  // Advanced caching for initial posts only
  const { 
    data: cachedPosts, 
    loading: cacheLoading, 
    refetch: refetchCached 
  } = useAdvancedCache(
    `posts-page-0`,
    () => fetchPostsService(0, pageSize),
    { 
      ttl: 300000, // 5 minutes
      staleWhileRevalidate: true 
    }
  );

  const refreshPosts = async (showRefreshing = false) => {
    const endTracking = trackUserAction('refresh-posts');
    
    if (showRefreshing) {
      setRefreshing(true);
    }
    
    setError(null);
    
    try {
      const data = await fetchPostsService(0, pageSize);
      setPosts(data);
      setCurrentPage(0);
      setHasMore(data.length === pageSize);
      
      // Preload next page for better UX
      if (data.length === pageSize) {
        preloadNextPage(0, pageSize);
      }
      
      console.log(`Refreshed ${data.length} posts`);
    } catch (err) {
      console.error('Error refreshing posts:', err);
      setError('Failed to refresh posts. Please try again.');
    } finally {
      if (showRefreshing) {
        setRefreshing(false);
      }
      endTracking();
    }
  };

  const fetchPosts = async () => {
    const endTracking = trackApiCall('initial-fetch');
    console.log('Initial posts fetch started');
    setLoading(true);
    setError(null);
    
    try {
      await refreshPosts();
      logPerformanceReport();
    } catch (err) {
      console.error('Error in initial fetch:', err);
      setError('Failed to load posts. Please refresh the page.');
    } finally {
      setLoading(false);
      endTracking();
    }
  };

  const loadMorePosts = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    
    const endTracking = trackApiCall('load-more');
    console.log('Loading more posts, current page:', currentPage);
    
    setLoadingMore(true);
    setError(null);
    
    try {
      const nextPage = currentPage + 1;
      const newPosts = await fetchPostsService(nextPage, pageSize);
      
      if (newPosts.length > 0) {
        setPosts(prev => {
          // Prevent duplicates
          const existingIds = new Set(prev.map(p => p.id));
          const uniqueNewPosts = newPosts.filter(p => !existingIds.has(p.id));
          return [...prev, ...uniqueNewPosts];
        });
        
        setCurrentPage(nextPage);
        setHasMore(newPosts.length === pageSize);
        
        // Preload next page
        if (newPosts.length === pageSize) {
          preloadNextPage(nextPage, pageSize);
        }
        
        console.log(`Loaded ${newPosts.length} more posts (page ${nextPage})`);
      } else {
        setHasMore(false);
        console.log('No more posts to load');
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
      setError('Failed to load more posts. Please try again.');
    } finally {
      setLoadingMore(false);
      endTracking();
    }
  }, [currentPage, loadingMore, hasMore, pageSize, trackApiCall]);

  const { handleLike, handleSave, handleComment } = usePostActions(user, posts, refreshPosts);
  const { handleEditPost, handleDeletePost } = usePostMutations(user, posts, setPosts);

  // Use cached data when available for initial load only
  useEffect(() => {
    if (cachedPosts && !cacheLoading && currentPage === 0 && posts.length === 0) {
      setPosts(cachedPosts);
      setHasMore(cachedPosts.length === pageSize);
      setLoading(false);
    }
  }, [cachedPosts, cacheLoading, currentPage, posts.length, pageSize]);

  useEffect(() => {
    let isMounted = true;
    
    const initializePosts = async () => {
      if (isMounted && posts.length === 0 && !loading) {
        await fetchPosts();
      }
    };
    
    // Only fetch if we don't have cached data
    if (!cachedPosts || cacheLoading) {
      initializePosts();
    }
    
    return () => {
      isMounted = false;
    };
  }, []); // Remove dependencies to prevent re-fetching

  // Performance optimization: throttled scroll detection
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Refresh stale data when user returns to tab
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          if (posts.length > 0) {
            refreshPosts(false);
          }
        }, 5000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimeout(timeout);
    };
  }, [posts.length]);

  return {
    posts,
    loading,
    refreshing,
    loadingMore,
    hasMore,
    error,
    refreshPosts,
    loadMorePosts,
    handleLike,
    handleSave,
    handleComment,
    handleEditPost,
    handleDeletePost
  };
};
