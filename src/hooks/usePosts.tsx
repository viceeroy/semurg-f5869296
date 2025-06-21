import { useState, useEffect } from "react";
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

  const refreshPosts = async (showRefreshing = false) => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    if (showRefreshing) {
      setRefreshing(true);
    }
    try {
      const data = await fetchPostsService();
      setPosts(data);
    } finally {
      if (showRefreshing) {
        setRefreshing(false);
      }
    }
  };

  const fetchPosts = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    console.log('fetchPosts called');
    setLoading(true);
    try {
      await refreshPosts();
      console.log('fetchPosts completed');
    } finally {
      setLoading(false);
    }
  };

  const { handleLike, handleSave, handleComment } = usePostActions(user, posts, refreshPosts);
  const { handleEditPost, handleDeletePost } = usePostMutations(user, posts, setPosts);

  useEffect(() => {
    fetchPosts();
  }, [user]); // Add user to dependency array

  return {
    posts,
    loading,
    refreshing,
    refreshPosts,
    handleLike,
    handleSave,
    handleComment,
    handleEditPost,
    handleDeletePost
  };
};