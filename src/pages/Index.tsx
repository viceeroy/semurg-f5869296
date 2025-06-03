
import { useState } from "react";
import BottomNavigation from "@/components/BottomNavigation";
import HomeFeed from "@/components/HomeFeed";
import SearchPage from "@/components/SearchPage";
import CollectionsPage from "@/components/CollectionsPage";
import ProfilePage from "@/components/ProfilePage";
import UploadFlow from "@/components/UploadFlow";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [showUploadFlow, setShowUploadFlow] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeFeed />;
      case "search":
        return <SearchPage />;
      case "collections":
        return <CollectionsPage />;
      case "profile":
        return <ProfilePage />;
      default:
        return <HomeFeed />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {renderContent()}
      
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onUploadClick={() => setShowUploadFlow(true)}
      />

      {showUploadFlow && (
        <UploadFlow onClose={() => setShowUploadFlow(false)} />
      )}
    </div>
  );
};

export default Index;
