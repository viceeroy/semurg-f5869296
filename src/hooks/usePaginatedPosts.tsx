
import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Post } from "@/types/post";
import { fetchPostsPaginated, PostsPage } from "@/services/paginatedPostService";
import { usePostActions } from "@/hooks/usePostActions";
import { usePostMutations } from "@/hooks/usePostMutations";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

export const usePaginatedPosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  const loadInitialPosts = useCallback(async () => {
    console.log('loadInitialPosts called');
    setLoading(true);
    try {
      const result = await fetchPostsPaginated(null, 15); // Load 15 posts initially
      setPosts(result.posts);
      setNextCursor(result.nextCursor);
      setHasMore(result.hasMore);
      console.log('Initial posts loaded:', result.posts.length);
    } catch (error) {
      console.error('Error loading initial posts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMorePosts = useCallback(async () => {
    if (!hasMore || isFetchingNextPage) return;
    
    console.log('loadMorePosts called with cursor:', nextCursor);
    setIsFetchingNextPage(true);
    try {
      const result = await fetchPostsPaginated(nextCursor, 10); // Load 10 more posts
      setPosts(prevPosts => [...prevPosts, ...result.posts]);
      setNextCursor(result.nextCursor);
      setHasMore(result.hasMore);
      console.log('More posts loaded:', result.posts.length);
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setIsFetchingNextPage(false);
    }
  }, [nextCursor, hasMore, isFetchingNextPage]);

  const refreshPosts = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    }
    try {
      const result = await fetchPostsPaginated(null, 15);
      setPosts(result.posts);
      setNextCursor(result.nextCursor);
      setHasMore(result.hasMore);
      console.log('Posts refreshed:', result.posts.length);
    } catch (error) {
      console.error('Error refreshing posts:', error);
    } finally {
      if (showRefreshing) {
        setRefreshing(false);
      }
    }
  }, []);

  const { loadingElementRef } = useInfiniteScroll({
    hasNextPage: hasMore,
    isFetchingNextPage,
    fetchNextPage: loadMorePosts,
    threshold: 500 // Start loading 500px before reaching the bottom
  });

  const { handleLike, handleSave, handleComment } = usePostActions(user, posts, refreshPosts);
  const { handleEditPost, handleDeletePost } = usePostMutations(user, posts, setPosts);

  useEffect(() => {
    loadInitialPosts();
  }, [loadInitialPosts]);

  return {
    posts,
    loading,
    refreshing,
    hasMore,
    isFetchingNextPage,
    loadingElementRef,
    refreshPosts,
    loadMorePosts,
    handleLike,
    handleSave,
    handleComment,
    handleEditPost,
    handleDeletePost
  };
};
