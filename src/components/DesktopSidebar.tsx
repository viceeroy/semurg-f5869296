import { User, Search, FolderOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";

interface DesktopSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onUploadClick: () => void;
}

// Custom icons based on the design (same as BottomNavigation)
const DiscoverIcon = ({
  className
}: {
  className?: string;
}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>;

const DesktopSidebar = ({ 
  activeTab, 
  onTabChange, 
  onUploadClick 
}: DesktopSidebarProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const menuItems = [
    {
      id: 'home',
      icon: DiscoverIcon,
      label: t.nav.home,
      onClick: () => onTabChange('home')
    },
    {
      id: 'search',
      icon: Search,
      label: 'Search',
      onClick: () => onTabChange('search')
    },
    {
      id: 'upload',
      icon: Sparkles,
      label: t.upload.identifyWildlife,
      onClick: onUploadClick,
      isSpecial: true
    },
    {
      id: 'collections',
      icon: FolderOpen,
      label: 'Collections',
      onClick: () => onTabChange('collections')
    },
    {
      id: 'profile',
      icon: User,
      label: t.nav.profile,
      onClick: () => onTabChange('profile')
    }
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-30">
      <div className="p-6">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-emerald-700">Semurg</h1>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {menuItems.slice(0, 2).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full justify-start gap-4 px-3 py-3 h-auto text-left ${
                  isActive 
                    ? 'bg-gray-100 text-black font-semibold' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={item.onClick}
              >
                <Icon 
                  className={`w-6 h-6 transition-colors ${isActive ? 'text-emerald-600 fill-current' : ''}`} 
                  strokeWidth={isActive ? 0 : 1.5}
                />
                <span className="text-base">{item.label}</span>
              </Button>
            );
          })}
          
          {/* Upload button */}
          <Button
            onClick={onUploadClick}
            variant="ghost"
            className="w-full justify-start gap-4 px-3 py-3 h-auto text-left text-gray-700 hover:bg-gray-50"
          >
            <Sparkles className="w-6 h-6" />
            <span className="text-base">{t.upload.identifyWildlife}</span>
          </Button>
          
          {menuItems.slice(3).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full justify-start gap-4 px-3 py-3 h-auto text-left ${
                  isActive 
                    ? 'bg-gray-100 text-black font-semibold' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={item.onClick}
              >
                <Icon 
                  className={`w-6 h-6 transition-colors ${isActive ? 'text-emerald-600 fill-current' : ''}`} 
                  strokeWidth={isActive ? 0 : 1.5}
                />
                <span className="text-base">{item.label}</span>
              </Button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default DesktopSidebar;