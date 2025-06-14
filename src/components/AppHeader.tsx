import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import NotificationPanel from "./NotificationPanel";

const AppHeader = () => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-20">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Semurg Brand */}
          <h1 className="text-xl font-bold text-gray-900">Semurg</h1>
          
          {/* Right side - Notification and Profile */}
          <div className="flex items-center space-x-3">
            {/* Notification Icon */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2"
            >
              <Bell className="w-5 h-5 text-gray-700" />
              {/* Notification badge - can be added later when we have unread count */}
            </Button>
            
            {/* User Profile Picture */}
            {user && (
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                <img 
                  src={user.user_metadata?.avatar_url || '/placeholder.svg'} 
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Notification Panel */}
      {showNotifications && (
        <NotificationPanel onClose={() => setShowNotifications(false)} />
      )}
    </div>
  );
};

export default AppHeader;