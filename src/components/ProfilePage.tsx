
import { Settings, Grid3X3, Bookmark, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProfilePage = () => {
  const userStats = {
    posts: 47,
    followers: 1234,
    following: 567,
    collections: 8,
  };

  const userPosts = [
    { id: 1, image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300", species: "Red-winged Blackbird" },
    { id: 2, image: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=300", species: "Monarch Butterfly" },
    { id: 3, image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300", species: "Eastern Gray Squirrel" },
    { id: 4, image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300", species: "Wild Rose" },
    { id: 5, image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300", species: "Blue Jay" },
    { id: 6, image: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=300", species: "Painted Lady" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">NatureLover22</h1>
            <Button variant="ghost" size="sm">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 pb-24">
        {/* Profile Info */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <div className="flex items-start space-x-4 mb-4">
            <img
              src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100"
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Sarah Johnson</h2>
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span>Portland, Oregon</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Joined March 2024</span>
              </div>
            </div>
          </div>

          <p className="text-gray-700 text-sm mb-4">
            Wildlife enthusiast and nature photographer. Passionate about bird watching and conservation. 
            🦅 Sharing my backyard discoveries and hiking adventures!
          </p>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-gray-900">{userStats.posts}</div>
              <div className="text-xs text-gray-600">Posts</div>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{userStats.followers.toLocaleString()}</div>
              <div className="text-xs text-gray-600">Followers</div>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{userStats.following}</div>
              <div className="text-xs text-gray-600">Following</div>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{userStats.collections}</div>
              <div className="text-xs text-gray-600">Collections</div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="glass-card rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Recent Achievements</h3>
          <div className="flex space-x-3">
            <div className="bg-nature-green/10 rounded-full p-3">
              <span className="text-2xl">🏆</span>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <span className="text-2xl">🦅</span>
            </div>
            <div className="bg-orange-100 rounded-full p-3">
              <span className="text-2xl">📸</span>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-2 glass-card">
            <TabsTrigger value="posts" className="flex items-center">
              <Grid3X3 className="w-4 h-4 mr-2" />
              Posts
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center">
              <Bookmark className="w-4 h-4 mr-2" />
              Saved
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-4">
            <div className="grid grid-cols-3 gap-1">
              {userPosts.map((post) => (
                <div
                  key={post.id}
                  className="aspect-square bg-white rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <img
                    src={post.image}
                    alt={post.species}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="saved" className="mt-4">
            <div className="text-center py-12">
              <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">No saved posts yet</h3>
              <p className="text-sm text-gray-600">
                Posts you save will appear here
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
