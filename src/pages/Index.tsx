
import { useState } from "react";
import { useAuth, AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider, useLanguage } from "@/hooks/useLanguage";
import BottomNavigation from "@/components/BottomNavigation";
import HomeFeed from "@/components/HomeFeed";
import SearchPage from "@/components/SearchPage";
import CollectionsPage from "@/components/CollectionsPage";
import ProfilePage from "@/components/ProfilePage";
import UploadFlow from "@/components/UploadFlow";
import AuthPage from "@/components/AuthPage";
import ProfileEditPage from "@/components/ProfileEditPage";

const MainApp = () => {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("home");
  const [showUploadFlow, setShowUploadFlow] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);

  const renderContent = () => {
    if (showProfileEdit) {
      return <ProfileEditPage onBack={() => setShowProfileEdit(false)} />;
    }

    switch (activeTab) {
      case "home":
        return <HomeFeed />;
      case "search":
        return <SearchPage />;
      case "collections":
        return <CollectionsPage />;
      case "profile":
        return <ProfilePage onEditProfile={() => setShowProfileEdit(true)} />;
      default:
        return <HomeFeed />;
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
        <UploadFlow 
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
