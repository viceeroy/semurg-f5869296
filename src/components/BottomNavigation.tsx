
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

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

const IdentifySpeciesIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="7.5,10 12,15 16.5,10"/>
  </svg>
);

const BottomNavigation = ({ activeTab, onTabChange, onUploadClick }: BottomNavigationProps) => {
  const tabs = [
    { id: 'home', icon: DiscoverIcon, label: 'Discovery' },
    { id: 'upload', icon: IdentifySpeciesIcon, label: 'Identify Species', isSpecial: true },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 max-w-md mx-auto">
        <div className="flex items-center justify-around px-4 py-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          if (tab.isSpecial) {
            return (
              <Button
                key={tab.id}
                onClick={onUploadClick}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                size="sm"
              >
                <Icon className="w-7 h-7" />
              </Button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center py-3 px-4 rounded-xl transition-all duration-200 ${
                isActive ? 'text-emerald-600 bg-emerald-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'stroke-2' : 'stroke-1.5'}`} />
              <span className="text-xs mt-1 font-medium">{tab.label}</span>
            </button>
          );
        })}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
