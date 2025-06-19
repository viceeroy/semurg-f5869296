
import { useState } from "react";
import { useAuth, AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider, useLanguage } from "@/hooks/useLanguage";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePosts } from "@/hooks/usePosts";
import { useProfile } from "@/hooks/useProfile";
import { useCollections } from "@/hooks/useCollections";
import { useSearch } from "@/hooks/useSearch";
import { useBackgroundPreload } from "@/hooks/useBackgroundPreload";
import BottomNavigation from "@/components/BottomNavigation";
import DesktopSidebar from "@/components/DesktopSidebar";
import RightSidebar from "@/components/RightSidebar";
import HomeFeed from "@/components/HomeFeed";
import { LazySearchPage, LazyCollectionsPage, LazyProfilePage, LazyUploadFlow } from "@/components/LazyComponents";
import AuthPage from "@/components/AuthPage";
import ProfileEditPage from "@/components/ProfileEditPage";

const MainApp = () => {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  // Always load home data immediately for fast initial render
  const postsData = usePosts();
  
  // Background preloading - start after home page loads
  const shouldPreload = user && !postsData.loading;
  const { shouldLoadProfile, shouldLoadCollections, shouldLoadSearch, isPreloaded } = useBackgroundPreload(shouldPreload);
  
  // Conditionally load other sections when preloading starts
  const profileData = shouldLoadProfile ? useProfile() : null;
  const collectionsData = shouldLoadCollections ? useCollections() : null;
  const searchData = shouldLoadSearch ? useSearch() : null;
  
  const [activeTab, setActiveTab] = useState("home");
  const [showUploadFlow, setShowUploadFlow] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Pass search query to right sidebar when on search page
  const currentSearchQuery = activeTab === 'search' ? searchQuery : '';

  const renderContent = () => {
    if (showProfileEdit) {
      return <ProfileEditPage onBack={() => setShowProfileEdit(false)} />;
    }

    switch (activeTab) {
      case "home":
        return <HomeFeed postsData={postsData} onProfileClick={() => setActiveTab("profile")} />;
      case "search":
        return searchData ? <LazySearchPage searchData={searchData} /> : (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        );
      case "collections":
        return collectionsData ? <LazyCollectionsPage collectionsData={collectionsData} /> : (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        );
      case "profile":
        return profileData ? <LazyProfilePage profileData={profileData} onEditProfile={() => setShowProfileEdit(true)} /> : (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        );
      default:
        return <HomeFeed postsData={postsData} onProfileClick={() => setActiveTab("profile")} />;
    }
  };

  const handlePostCreated = () => {
    setActiveTab("home");
    // Refresh the home feed would happen automatically when we switch tabs
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  // Mobile layout (unchanged)
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50 relative">
        {!showProfileEdit && renderContent()}
        {showProfileEdit && renderContent()}
        
        {!showProfileEdit && (
          <BottomNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onUploadClick={() => setShowUploadFlow(true)}
          />
        )}

        {showUploadFlow && (
          <LazyUploadFlow 
            onClose={() => setShowUploadFlow(false)} 
            onPostCreated={handlePostCreated}
          />
        )}
      </div>
    );
  }

  // Desktop layout (3-column on large screens, 2-column on tablets)
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <DesktopSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onUploadClick={() => setShowUploadFlow(true)}
      />

      {/* Main Content */}
      <div className="flex-1 ml-64 xl:mr-80">
        <div className="max-w-2xl mx-auto">
          {!showProfileEdit && renderContent()}
          {showProfileEdit && renderContent()}
        </div>
      </div>

      {/* Right Sidebar - Only visible on xl screens and above */}
      <div className="hidden xl:block">
        <RightSidebar 
          searchQuery={currentSearchQuery}
        />
      </div>

      {showUploadFlow && (
        <LazyUploadFlow 
          onClose={() => setShowUploadFlow(false)} 
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <MainApp />
      </LanguageProvider>
    </AuthProvider>
  );
};

export default Index;
