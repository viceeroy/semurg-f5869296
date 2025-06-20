import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useFollows = () => {
  const { user } = useAuth();
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFollowData = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Get followers
      const { data: followersData } = await supabase
        .from('follows')
        .select(`
          follower_id,
          profiles!follows_follower_id_fkey (
            id,
            username,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('following_id', user.id);

      // Get following
      const { data: followingData } = await supabase
        .from('follows')
        .select(`
          following_id,
          profiles!follows_following_id_fkey (
            id,
            username,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('follower_id', user.id);

      // Get suggested users (users not followed)
      const followingIds = followingData?.map(f => f.following_id) || [];
      const { data: suggestedData } = await supabase
        .from('profiles')
        .select('id, username, first_name, last_name, avatar_url')
        .not('id', 'in', `(${[user.id, ...followingIds].join(',')})`)
        .limit(5);

      setFollowers(followersData || []);
      setFollowing(followingData || []);
      setFollowerCount(followersData?.length || 0);
      setFollowingCount(followingData?.length || 0);
      setSuggestedUsers(suggestedData || []);

    } catch (error) {
      console.error('Error fetching follow data:', error);
    } finally {
      setLoading(false);
    }
  };

  const followUser = async (userId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('follows')
        .insert({ follower_id: user.id, following_id: userId });

      if (error) {
        toast.error('Failed to follow user');
        return;
      }

      toast.success('User followed successfully!');
      fetchFollowData(); // Refresh data
    } catch (error) {
      toast.error('Error following user');
    }
  };

  const unfollowUser = async (userId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', userId);

      if (error) {
        toast.error('Failed to unfollow user');
        return;
      }

      toast.success('User unfollowed successfully!');
      fetchFollowData(); // Refresh data
    } catch (error) {
      toast.error('Error unfollowing user');
    }
  };

  const isFollowing = (userId: string) => {
    return following.some(f => f.following_id === userId);
  };

  useEffect(() => {
    if (user) {
      fetchFollowData();
    }
  }, [user]);

  return {
    followers,
    following,
    followerCount,
    followingCount,
    suggestedUsers,
    loading,
    followUser,
    unfollowUser,
    isFollowing,
    fetchFollowData
  };
};