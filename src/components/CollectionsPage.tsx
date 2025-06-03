
import { useState, useEffect } from "react";
import { Heart, BookOpen, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import PostCard from "./PostCard";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface SavedPost {
  id: string;
  image: string;
  speciesName: string;
  aiInfo: string;
  userName: string;
  userAvatar: string;
  likes: number;
  isLiked: boolean;
  category: string;
}

const CollectionsPage = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeFilter, setActiveFilter] = useState("all");
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [loading, setLoading] = useState(true);

  const filters = [
    { id: "all", label: "All", count: savedPosts.length },
    { id: "birds", label: "Birds", count: savedPosts.filter(p => p.category === "bird").length },
    { id: "mammals", label: "Mammals", count: savedPosts.filter(p => p.category === "mammal").length },
    { id: "plants", label: "Plants", count: savedPosts.filter(p => p.category === "plant").length },
    { id: "insects", label: "Insects", count: savedPosts.filter(p => p.category === "insect").length },
  ];

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  const fetchSavedPosts = async () => {
    if (!user) return;

    try {
      // For now, we'll show the user's own posts as their "collection"
      // In a real app, you'd have a separate saved_posts table
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (username, avatar_url),
          likes (user_id)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching saved posts:', error);
        return;
      }

      const formattedPosts = data?.map(post => ({
        id: post.id,
        image: post.image_url,
        speciesName: post.title,
        aiInfo: post.description || '',
        userName: post.profiles?.username || 'You',
        userAvatar: post.profiles?.avatar_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
        likes: post.likes.length,
        isLiked: post.likes.some(like => like.user_id === user?.id),
        category: 'bird' // Default category, in real app this would come from AI identification
      })) || [];

      setSavedPosts(formattedPosts);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (postId: string) => {
    // Handle like logic
    console.log('Like post:', postId);
  };

  const handleSave = (postId: string) => {
    // Handle save logic
    console.log('Save post:', postId);
  };

  const filteredPosts = activeFilter === "all" 
    ? savedPosts 
    : savedPosts.filter(post => post.category === activeFilter.slice(0, -1)); // Remove 's' from 'birds' etc

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Collection</h1>
              <p className="text-sm text-gray-600">Your wildlife discoveries</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter.id)}
              className="whitespace-nowrap"
            >
              {filter.label} ({filter.count})
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 pb-24">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">No discoveries yet</h3>
            <p className="text-sm text-gray-600">
              Start exploring and save your favorite wildlife discoveries!
            </p>
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-2 gap-4" : "space-y-4"}>
            {filteredPosts.map((post) => (
              <div key={post.id} className={viewMode === "grid" ? "break-inside-avoid" : ""}>
                {viewMode === "list" ? (
                  <PostCard
                    post={post}
                    onLike={handleLike}
                    onSave={handleSave}
                  />
                ) : (
                  <div className="glass-card rounded-xl overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.speciesName}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-3">
                      <h4 className="font-semibold text-sm text-gray-900 truncate">
                        {post.speciesName}
                      </h4>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-600">{post.likes} likes</span>
                        <Button variant="ghost" size="sm" onClick={() => handleLike(post.id)}>
                          <Heart className={`w-4 h-4 ${post.isLiked ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionsPage;
