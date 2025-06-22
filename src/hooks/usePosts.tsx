
import { useState, useEffect, useRef } from "react";
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
  const [backgroundLoading, setBackgroundLoading] = useState(false);
  const [allPostsLoaded, setAllPostsLoaded] = useState(false);
  
  // Track how many posts user has viewed
  const viewedPostsCount = useRef(0);
  const backgroundLoadTriggered = useRef(false);

  const refreshPosts = async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    }
    try {
      clearPostsCache();
      const data = await fetchPostsService(8, 0); // Load only 8 posts initially
      setPosts(data);
      setHasMore(data.length === 8);
      setAllPostsLoaded(false);
      backgroundLoadTriggered.current = false;
      viewedPostsCount.current = 0;
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
      const data = await fetchPostsService(8, 0); // Load 8 posts initially for fast loading
      setPosts(data);
      setHasMore(data.length === 8);
      console.log('fetchPosts completed, loaded:', data.length, 'posts');
    } finally {
      setLoading(false);
    }
  };

  const loadMorePosts = async () => {
    if (!hasMore || loading || allPostsLoaded) return;
    
    try {
      const newPosts = await fetchPostsService(6, posts.length); // Load 6 more at a time
      if (newPosts.length > 0) {
        setPosts(prev => [...prev, ...newPosts]);
        setHasMore(newPosts.length === 6);
      } else {
        setHasMore(false);
        setAllPostsLoaded(true);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
    }
  };

  // Background loading function to fetch all remaining posts
  const loadAllPostsInBackground = async () => {
    if (backgroundLoadTriggered.current || allPostsLoaded || backgroundLoading) return;
    
    backgroundLoadTriggered.current = true;
    setBackgroundLoading(true);
    console.log('Starting background loading of all posts...');
    
    try {
      // Fetch all posts in chunks to avoid overwhelming the system
      let allNewPosts: Post[] = [];
      let offset = posts.length;
      let hasMoreToLoad = true;
      
      while (hasMoreToLoad) {
        const chunk = await fetchPostsService(20, offset); // Load in chunks of 20
        if (chunk.length > 0) {
          allNewPosts = [...allNewPosts, ...chunk];
          offset += chunk.length;
          hasMoreToLoad = chunk.length === 20;
          
          // Add a small delay to prevent overwhelming the system
          await new Promise(resolve => setTimeout(resolve, 100));
        } else {
          hasMoreToLoad = false;
        }
      }
      
      if (allNewPosts.length > 0) {
        setPosts(prev => [...prev, ...allNewPosts]);
        console.log(`Background loaded ${allNewPosts.length} additional posts`);
      }
      
      setAllPostsLoaded(true);
      setHasMore(false);
    } catch (error) {
      console.error('Error in background loading:', error);
    } finally {
      setBackgroundLoading(false);
    }
  };

  // Track post views and trigger background loading
  const trackPostView = () => {
    viewedPostsCount.current += 1;
    
    // Trigger background loading when user has viewed around 20 posts
    if (viewedPostsCount.current >= 20 && !backgroundLoadTriggered.current && !allPostsLoaded) {
      loadAllPostsInBackground();
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
    backgroundLoading,
    allPostsLoaded,
    refreshPosts,
    loadMorePosts,
    trackPostView,
    handleLike,
    handleSave,
    handleComment,
    handleEditPost,
    handleDeletePost
  };
};
