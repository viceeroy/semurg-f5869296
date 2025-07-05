
import { useState } from "react";
import { useAuth, AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider, useLanguage } from "@/hooks/useLanguage";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePosts } from "@/hooks/usePosts";
import { useProfile } from "@/hooks/useProfile";
import { useSearch } from "@/hooks/useSearch";
import BottomNavigation from "@/components/BottomNavigation";
import DesktopSidebar from "@/components/DesktopSidebar";
import HomeFeed from "@/components/HomeFeed";
import LeaderboardPage from "@/components/LeaderboardPage";
import { LazySearchPage, LazyProfilePage, LazyUploadFlow } from "@/components/LazyComponents";
import AuthPage from "@/components/AuthPage";
import ProfileEditPage from "@/components/ProfileEditPage";
import { Suspense } from "react";

const MainApp = () => {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const postsData = usePosts();
  const profileData = useProfile();
  const searchData = useSearch(postsData.posts);
  const [activeTab, setActiveTab] = useState("home");
  const [showUploadFlow, setShowUploadFlow] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);

  const renderContent = () => {
    if (showProfileEdit) {
      return <ProfileEditPage onBack={() => setShowProfileEdit(false)} />;
    }

    switch (activeTab) {
      case "home":
        return <HomeFeed postsData={postsData} onProfileClick={() => setActiveTab("profile")} />;
      case "search":
        return (
          <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          }>
            <LazySearchPage searchData={searchData} />
          </Suspense>
        );
      case "leaderboard":
        return <LeaderboardPage />;
      case "profile":
        return (
          <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          }>
            <LazyProfilePage profileData={profileData} onEditProfile={() => setShowProfileEdit(true)} />
          </Suspense>
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

  // Mobile layout
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
          <Suspense fallback={<div>Loading...</div>}>
            <LazyUploadFlow 
              onClose={() => setShowUploadFlow(false)} 
              onPostCreated={handlePostCreated}
            />
          </Suspense>
        )}
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <DesktopSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onUploadClick={() => setShowUploadFlow(true)}
      />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <div className="max-w-2xl mx-auto">
          {!showProfileEdit && renderContent()}
          {showProfileEdit && renderContent()}
        </div>
      </div>

      {showUploadFlow && (
        <Suspense fallback={<div>Loading...</div>}>
          <LazyUploadFlow 
            onClose={() => setShowUploadFlow(false)} 
            onPostCreated={handlePostCreated}
          />
        </Suspense>
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
