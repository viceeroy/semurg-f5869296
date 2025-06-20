import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedLoading, setSavedLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("posts");

  const fetchProfile = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }
      setProfile(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchUserPosts = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (username, first_name, last_name, avatar_url),
          likes (user_id),
          comments (
            id,
            user_id,
            content,
            created_at,
            profiles (username, first_name, last_name)
          )
        `)
        .eq('user_id', user.id)
        .eq('is_private', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        return;
      }
      setUserPosts(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedPosts = async () => {
    if (!user) return;
    setSavedLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_posts')
        .select(`
          posts (
            *,
            profiles (username, first_name, last_name, avatar_url),
            likes (user_id),
            comments (
              id,
              user_id,
              content,
              created_at,
              profiles (username, first_name, last_name)
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching saved posts:', error);
        return;
      }

      // Extract posts from the nested structure
      const posts = data?.map(item => item.posts).filter(Boolean) || [];
      setSavedPosts(posts);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSavedLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
      if (activeTab === "posts") {
        fetchUserPosts();
      } else if (activeTab === "saved") {
        fetchSavedPosts();
      }
    }
  }, [user, activeTab]);

  return {
    profile,
    userPosts,
    savedPosts,
    loading,
    savedLoading,
    activeTab,
    setActiveTab,
    fetchProfile,
    fetchUserPosts,
    fetchSavedPosts
  };
};