import { Settings, Grid3X3, Bookmark, MapPin, Calendar, Edit, LogOut, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AvatarFallback from "@/components/ui/avatar-fallback";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import DetailedPostView from "./DetailedPostView";
import { usePosts } from "@/hooks/usePosts";
import { useProfile } from "@/hooks/useProfile";
import { useFollows } from "@/hooks/useFollows";
interface ProfilePageProps {
  profileData: ReturnType<typeof useProfile>;
  onEditProfile: () => void;
}

const ProfilePage = ({ profileData, onEditProfile }: ProfilePageProps) => {
  const { user, signOut } = useAuth();
  const { handleLike, handleSave, handleComment } = usePosts();
  const { 
    profile, 
    userPosts, 
    savedPosts, 
    loading, 
    savedLoading, 
    activeTab, 
    setActiveTab 
  } = profileData;
  
  const { 
    followerCount, 
    followingCount, 
    suggestedUsers, 
    followUser, 
    loading: followsLoading 
  } = useFollows();
  
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  
  const getDisplayName = (profile: any) => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return profile?.username || 'User';
  };
  const handleSignOut = async () => {
    await signOut();
  };
  const allPosts = [...userPosts, ...savedPosts];
  const selectedPost = selectedPostId ? allPosts.find(p => p.id === selectedPostId) : null;
  if (selectedPost) {
    return <DetailedPostView post={{
      id: selectedPost.id,
      image: selectedPost.image_url,
      speciesName: selectedPost.title,
      aiInfo: selectedPost.description || '',
      userNotes: selectedPost.caption || '',
      userName: getDisplayName(selectedPost.profiles) || getDisplayName(profile) || 'Anonymous',
      userAvatar: selectedPost.profiles?.avatar_url || profile?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      userId: selectedPost.user_id,
      likes: selectedPost.likes?.length || 0,
      isLiked: selectedPost.likes?.some(like => like.user_id === user?.id) || false,
      isSaved: false,
      tags: [`#${selectedPost.title.replace(/\s+/g, '')}`, '#Wildlife'],
      comments: selectedPost.comments || [],
      uploadDate: selectedPost.created_at
    }} onClose={() => setSelectedPostId(null)} onLike={handleLike} onSave={handleSave} onComment={handleComment} onShare={() => {}} />;
  }
  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">{profile?.username || 'Profile'}</h1>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" onClick={onEditProfile}>
                <Edit className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 pb-24">
        {/* Profile Info */}
        <div className="glass-card rounded-2xl p-6 mb-6 bg-white/70 backdrop-blur-sm">
          <div className="flex items-start space-x-4 mb-4">
            <AvatarFallback
              src={profile?.avatar_url}
              name={getDisplayName(profile)}
              size="xl"
              alt="Profile"
            />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-1">{getDisplayName(profile)}</h2>
              <p className="text-gray-600 text-sm mb-2">@{profile?.username || 'user'}</p>
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Joined {new Date(profile?.created_at || '').toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {profile?.bio && <p className="text-gray-700 text-sm mb-4">{profile.bio}</p>}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-gray-900">{userPosts.length}</div>
              <div className="text-xs text-gray-600">Posts</div>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{followerCount}</div>
              <div className="text-xs text-gray-600">Followers</div>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{followingCount}</div>
              <div className="text-xs text-gray-600">Following</div>
            </div>
          </div>
        </div>

        {/* Friends Suggestions */}
        {suggestedUsers.length > 0 && (
          <div className="glass-card rounded-2xl p-6 mb-6 bg-white/70 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-emerald-600" />
              <h3 className="font-semibold text-gray-900">Suggested for you</h3>
            </div>
            <div className="space-y-3">
              {suggestedUsers.slice(0, 3).map(suggestedUser => (
                <div key={suggestedUser.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AvatarFallback
                      src={suggestedUser.avatar_url}
                      name={suggestedUser.first_name && suggestedUser.last_name 
                        ? `${suggestedUser.first_name} ${suggestedUser.last_name}`
                        : suggestedUser.username}
                      size="md"
                      alt="User"
                    />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {suggestedUser.first_name && suggestedUser.last_name 
                          ? `${suggestedUser.first_name} ${suggestedUser.last_name}`
                          : suggestedUser.username
                        }
                      </p>
                      <p className="text-xs text-gray-600">@{suggestedUser.username}</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => followUser(suggestedUser.id)}
                    disabled={followsLoading}
                    className="text-xs"
                  >
                    <UserPlus className="w-3 h-3 mr-1" />
                    Follow
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Tabs */}
        <Tabs defaultValue="posts" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 backdrop-blur-sm bg-white/70 rounded-2xl p-1">
            <TabsTrigger 
              value="posts" 
              className="flex items-center justify-center text-gray-600 hover:text-emerald-600 hover:bg-white/50 data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm transition-all duration-200"
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              Posts
            </TabsTrigger>
            <TabsTrigger 
              value="saved" 
              className="flex items-center justify-center text-gray-600 hover:text-emerald-600 hover:bg-white/50 data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm transition-all duration-200"
            >
              <Bookmark className="w-4 h-4 mr-2" />
              Saved
            </TabsTrigger>
            <TabsTrigger 
              value="friends" 
              className="flex items-center justify-center text-gray-600 hover:text-emerald-600 hover:bg-white/50 data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm transition-all duration-200"
            >
              <Users className="w-4 h-4 mr-2" />
              Friends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-4">
            {userPosts.length === 0 ? <div className="text-center py-12">
                <Grid3X3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">No posts yet</h3>
                <p className="text-sm text-gray-600">
                  Share your first wildlife discovery!
                </p>
              </div> : <div className="grid grid-cols-3 gap-1">
                {userPosts.map(post => <div key={post.id} className="aspect-square bg-white rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setSelectedPostId(post.id)}>
                    <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                  </div>)}
              </div>}
          </TabsContent>

          <TabsContent value="saved" className="mt-4">
            {savedLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
              </div>
            ) : savedPosts.length === 0 ? (
              <div className="text-center py-12">
                <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">No saved posts yet</h3>
                <p className="text-sm text-gray-600">
                  Posts you save will appear here
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {savedPosts.map(post => (
                  <div key={post.id} className="aspect-square bg-white rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setSelectedPostId(post.id)}>
                    <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="friends" className="mt-4">
            <div className="space-y-4">
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Connect with friends</h3>
                <p className="text-sm text-gray-600">
                  Find and follow other wildlife enthusiasts
                </p>
              </div>
              
              {/* Show more suggested users */}
              {suggestedUsers.length > 0 && (
                <div className="space-y-3">
                  {suggestedUsers.map(suggestedUser => (
                    <div key={suggestedUser.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <AvatarFallback
                          src={suggestedUser.avatar_url}
                          name={suggestedUser.first_name && suggestedUser.last_name 
                            ? `${suggestedUser.first_name} ${suggestedUser.last_name}`
                            : suggestedUser.username}
                          size="lg"
                          alt="User"
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {suggestedUser.first_name && suggestedUser.last_name 
                              ? `${suggestedUser.first_name} ${suggestedUser.last_name}`
                              : suggestedUser.username
                            }
                          </p>
                          <p className="text-sm text-gray-600">@{suggestedUser.username}</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => followUser(suggestedUser.id)}
                        disabled={followsLoading}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Follow
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>;
};
export default ProfilePage;