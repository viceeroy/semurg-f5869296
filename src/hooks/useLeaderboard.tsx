
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";

interface LeaderboardEntry {
  user_id: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  species_count: number;
  rank: number;
}

export const useLeaderboard = () => {
  const { language } = useLanguage();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');

  const loadLeaderboard = async (period: 'today' | 'week' | 'month') => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_leaderboard', {
        period_type: period
      });

      if (error) {
        console.error('Error loading leaderboard:', error);
        setLeaderboard([]);
        return;
      }

      console.log('Leaderboard data for', period, ':', data);
      setLeaderboard(data || []);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard(selectedPeriod);
  }, [selectedPeriod]);

  const periodLabels = {
    today: language === 'uz' ? 'Bugun' : 'Today',
    week: language === 'uz' ? 'Bu hafta' : 'This Week',
    month: language === 'uz' ? 'Bu oy' : 'This Month'
  };

  return {
    leaderboard,
    loading,
    selectedPeriod,
    setSelectedPeriod,
    periodLabels,
    loadLeaderboard
  };
};
