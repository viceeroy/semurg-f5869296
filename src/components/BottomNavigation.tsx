
import { User, Search, Trophy, Sparkles, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onUploadClick: () => void;
}

const BottomNavigation = ({ activeTab, onTabChange, onUploadClick }: BottomNavigationProps) => {
  const { t, language } = useLanguage();
  
  const tabs = [
    {
      id: 'home',
      icon: Home,
      label: language === 'uz' ? 'Bosh sahifa' : 'Home'
    },
    {
      id: 'search',
      icon: Search,
      label: language === 'uz' ? 'Qidirish' : 'Search'
    },
    {
      id: 'upload',
      icon: Sparkles,
      label: language === 'uz' ? 'Yuklash' : 'Upload',
      isSpecial: true
    },
    {
      id: 'leaderboard',
      icon: Trophy,
      label: language === 'uz' ? 'Reyting' : 'Leaderboard'
    },
    {
      id: 'profile',
      icon: User,
      label: language === 'uz' ? 'Foydalanuvchi' : 'Profile'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
      <div className="bg-white border-t border-gray-200 w-full max-w-md">
        <div className="flex items-center justify-around px-4 py-3 rounded">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            if (tab.isSpecial) {
              return (
                <button
                  key={tab.id}
                  onClick={onUploadClick}
                  className="p-3 transition-all duration-200 hover:scale-105"
                >
                  <Icon className="w-6 h-6 text-black" />
                </button>
              );
            }
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="p-3 transition-all duration-200"
              >
                <Icon 
                  className={`w-6 h-6 transition-colors ${
                    isActive ? 'text-emerald-600' : 'text-gray-500'
                  }`}
                  fill={isActive ? 'currentColor' : 'none'}
                  strokeWidth={isActive ? 0 : 1.5}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
