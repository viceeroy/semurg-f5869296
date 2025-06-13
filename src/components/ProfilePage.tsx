
import { Settings, Grid3X3, Bookmark, MapPin, Calendar, Edit, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import DetailedPostView from "./DetailedPostView";
import { usePosts } from "@/hooks/usePosts";

interface ProfilePageProps {
  onEditProfile: () => void;
}

const ProfilePage = ({ onEditProfile }: ProfilePageProps) => {
  const { user, signOut } = useAuth();
  const { handleLike, handleSave, handleComment } = usePosts();
  const [profile, setProfile] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchUserPosts();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (username, avatar_url),
          likes (user_id),
          comments (
            id,
            user_id,
            content,
            created_at,
            profiles (username)
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        return;
      }

      setUserPosts(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const selectedPost = selectedPostId ? userPosts.find(p => p.id === selectedPostId) : null;

  if (selectedPost) {
    return (
      <DetailedPostView
        post={{
          id: selectedPost.id,
          image: selectedPost.image_url,
          speciesName: selectedPost.title,
          aiInfo: selectedPost.description || '',
          userNotes: selectedPost.caption || '',
          userName: selectedPost.profiles?.username || profile?.username || 'Anonymous',
          userAvatar: selectedPost.profiles?.avatar_url || profile?.avatar_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
          likes: selectedPost.likes?.length || 0,
          isLiked: selectedPost.likes?.some(like => like.user_id === user?.id) || false,
          isSaved: false,
          tags: [`#${selectedPost.title.replace(/\s+/g, '')}`, '#Wildlife'],
          comments: selectedPost.comments || [],
          uploadDate: selectedPost.created_at
        }}
        onClose={() => setSelectedPostId(null)}
        onLike={handleLike}
        onSave={handleSave}
        onComment={handleComment}
        onShare={() => {}}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
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
            <img
              src={profile?.avatar_url || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100"}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-1">{profile?.username || 'User'}</h2>
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Joined {new Date(profile?.created_at || '').toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {profile?.bio && (
            <p className="text-gray-700 text-sm mb-4">{profile.bio}</p>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-gray-900">{userPosts.length}</div>
              <div className="text-xs text-gray-600">Posts</div>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">0</div>
              <div className="text-xs text-gray-600">Followers</div>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">0</div>
              <div className="text-xs text-gray-600">Following</div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/70 backdrop-blur-sm">
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
            {userPosts.length === 0 ? (
              <div className="text-center py-12">
                <Grid3X3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">No posts yet</h3>
                <p className="text-sm text-gray-600">
                  Share your first wildlife discovery!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {userPosts.map((post) => (
                  <div
                    key={post.id}
                    className="aspect-square bg-white rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setSelectedPostId(post.id)}
                  >
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
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
