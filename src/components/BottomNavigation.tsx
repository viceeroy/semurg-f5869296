import { User, Search, FolderOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onUploadClick: () => void;
}

// Custom icons based on the design
const DiscoverIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 6v6l4 2"/>
  </svg>
);

const BottomNavigation = ({ activeTab, onTabChange, onUploadClick }: BottomNavigationProps) => {
  const { t } = useLanguage();
  const tabs = [
    { id: 'home', icon: DiscoverIcon, label: t.nav.home },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'upload', icon: Sparkles, label: t.upload.identifyWildlife, isSpecial: true },
    { id: 'collections', icon: FolderOpen, label: 'Collections' },
    { id: 'profile', icon: User, label: t.nav.profile },
  ];

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 max-w-xs mx-auto">
        <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          if (tab.isSpecial) {
            return (
              <Button
                key={tab.id}
                onClick={onUploadClick}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                size="sm"
              >
                <Icon className="w-5 h-5" />
              </Button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 ${
                isActive ? 'text-[#22C55E]' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-2' : 'stroke-1.5'}`} />
            </button>
          );
        })}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;