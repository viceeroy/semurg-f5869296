import { Bell, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import NotificationPanel from "./NotificationPanel";
import LanguageSelector from "./LanguageSelector";
interface AppHeaderProps {
  onRefresh?: () => Promise<void>;
  refreshing?: boolean;
  onProfileClick?: () => void;
}
const AppHeader = ({
  onRefresh,
  refreshing = false,
  onProfileClick
}: AppHeaderProps) => {
  const {
    user
  } = useAuth();
  const {
    t
  } = useLanguage();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Fetch unread notifications count
  useEffect(() => {
    if (!user) return;
    const fetchUserProfile = async () => {
      const {
        data,
        error
      } = await supabase.from('profiles').select('avatar_url, username').eq('id', user.id).single();
      if (!error && data) {
        setUserProfile(data);
      }
    };
    const fetchUnreadCount = async () => {
      const {
        data,
        error
      } = await supabase.from('notifications').select('id', {
        count: 'exact'
      }).eq('user_id', user.id).eq('is_read', false);
      if (!error && data) {
        setUnreadCount(data.length || 0);
      }
    };
    fetchUserProfile();
    fetchUnreadCount();

    // Set up realtime subscription for new notifications
    const channel = supabase.channel('header_notifications').on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${user.id}`
    }, () => {
      setUnreadCount(prev => prev + 1);
    }).on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${user.id}`
    }, payload => {
      const notification = payload.new as any;
      if (notification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  return <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-20">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Semurg Brand */}
          <h1 className="text-xl font-bold text-gray-900 text-left">Semurg</h1>
          
          {/* Language Selector */}
          <LanguageSelector />
          
          {/* Right side - Discovery, Notification and Profile */}
          <div className="flex items-center space-x-2 px-[12px]">
            {/* Discovery/Refresh Button */}
            {onRefresh && <Button variant="ghost" size="icon" onClick={onRefresh} disabled={refreshing} className="relative p-2" title={t.feed.refreshFeed}>
                <RotateCcw className={`w-5 h-5 text-emerald-600 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>}
            
            {/* Notification Icon */}
            <Button variant="ghost" size="icon" onClick={() => navigate('/notifications')} className="relative p-2">
              <Bell className="w-5 h-5 text-gray-700" />
              {unreadCount > 0 && <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </div>}
            </Button>
            
            {/* User Profile Picture */}
            {user && <button onClick={onProfileClick} className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 hover:ring-2 hover:ring-emerald-500 transition-all">
                <img src={userProfile?.avatar_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100'} alt="Profile" className="w-full h-full object-cover" />
              </button>}
          </div>
        </div>
      </div>
      
      {/* Notification Panel */}
      {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)} />}
    </div>;
};
export default AppHeader;