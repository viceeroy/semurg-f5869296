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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <div className="flex items-center justify-around px-4 py-3 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          if (tab.isSpecial) {
            return (
              <button
                key={tab.id}
                onClick={onUploadClick}
                className="p-2 transition-all duration-200 hover:scale-105"
              >
                <Icon className="w-6 h-6 text-foreground" />
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="p-2 transition-all duration-200"
            >
              <Icon 
                className={`w-6 h-6 transition-colors ${
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                }`} 
                fill={isActive ? 'currentColor' : 'none'}
                strokeWidth={isActive ? 0 : 1.5}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;