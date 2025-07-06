
import { Home, Search, Trophy, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

interface DesktopSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onUploadClick: () => void;
}

const DesktopSidebar = ({ activeTab, onTabChange, onUploadClick }: DesktopSidebarProps) => {
  const { t, language } = useLanguage();

  const tabs = [
    {
      id: 'home',
      icon: Home,
      label: language === 'uz' ? 'Bosh sahifa [Home]' : 'Home'
    },
    {
      id: 'search',
      icon: Search,
      label: language === 'uz' ? 'Qidirish [Search]' : 'Search'
    },
    {
      id: 'leaderboard',
      icon: Trophy,
      label: language === 'uz' ? 'Reyting [Leaderboard]' : 'Leaderboard'
    },
    {
      id: 'profile',
      icon: User,
      label: language === 'uz' ? 'Foydalanuvchi [Profile]' : 'Profile'
    }
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-8">
        <img src="/lovable-uploads/94913908-fc5c-4311-ac7b-1d044c8d6ed7.png" alt="Semurg" className="w-10 h-10 object-contain" />
        <span className="text-xl font-bold text-emerald-600">Semurg</span>
      </div>

      <nav className="space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start gap-3 ${
                isActive 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                  : 'hover:bg-emerald-50 text-gray-700'
              }`}
              onClick={() => onTabChange(tab.id)}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
            </Button>
          );
        })}
        
        <Button
          onClick={onUploadClick}
          className="w-full justify-start gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white mt-4"
        >
          <Sparkles className="w-5 h-5" />
          {language === 'uz' ? 'Yuklash [Identifying Species]' : t.upload.identifyWildlife}
        </Button>
      </nav>
    </div>
  );
};

export default DesktopSidebar;
