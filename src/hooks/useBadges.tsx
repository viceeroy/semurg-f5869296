
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";

interface Badge {
  id: string;
  name_en: string;
  name_uz: string;
  description_en: string;
  description_uz: string;
  icon_url?: string;
  earned_at?: string;
}

export const useBadges = (userId?: string) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(false);

  const loadUserBadges = async (targetUserId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select(`
          earned_at,
          badges:badge_id (
            id,
            name_en,
            name_uz,
            description_en,
            description_uz,
            icon_url
          )
        `)
        .eq('user_id', targetUserId)
        .order('earned_at', { ascending: false })
        .limit(5); // Show only top 5 badges

      if (error) {
        console.error('Error loading badges:', error);
        return;
      }

      const userBadges = data?.map(item => ({
        ...item.badges,
        earned_at: item.earned_at
      })) || [];

      setBadges(userBadges);
    } catch (error) {
      console.error('Error loading badges:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const targetUserId = userId || user?.id;
    if (targetUserId) {
      loadUserBadges(targetUserId);
    }
  }, [userId, user?.id]);

  const getBadgeName = (badge: Badge) => {
    return language === 'uz' ? badge.name_uz : badge.name_en;
  };

  const getBadgeDescription = (badge: Badge) => {
    return language === 'uz' ? badge.description_uz : badge.description_en;
  };

  return {
    badges,
    loading,
    getBadgeName,
    getBadgeDescription,
    loadUserBadges
  };
};
