import { useState, useEffect } from "react";
import { Heart, BookOpen, Grid, List, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import PostCard from "./PostCard";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SavedPost {
  id: string;
  image: string;
  speciesName: string;
  aiInfo: string;
  userNotes: string;
  userName: string;
  userAvatar: string;
  likes: number;
  isLiked: boolean;
  category: string;
  tags: string[];
  badge?: string;
  comments: any[];
  userId: string;
  timestamp: string;
}

const CollectionsPage = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeFilter, setActiveFilter] = useState("all");
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [loading, setLoading] = useState(true);

  const filters = [
    {
      id: "all",
      label: "All",
      count: savedPosts.length
    },
    {
      id: "birds",
      label: "Birds",
      count: savedPosts.filter(p => p.category === "birds").length
    },
    {
      id: "mammals",
      label: "Mammals", 
      count: savedPosts.filter(p => p.category === "mammals").length
    },
    {
      id: "plants",
      label: "Plants",
      count: savedPosts.filter(p => p.category === "plants").length
    }
  ];

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  const fetchSavedPosts = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('saved_posts')
        .select(`
          id,
          created_at,
          posts (
            id,
            title,
            description,
            image_url,
            category,
            scientific_name,
            profiles (
              username,
              avatar_url
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching saved posts:', error);
        setSavedPosts([]);
        return;
      }

      const formattedPosts = (data || []).map(item => ({
        id: item.posts.id,
        image: item.posts.image_url,
        speciesName: item.posts.title,
        aiInfo: item.posts.description || `Species: ${item.posts.title}`,
        userNotes: '',
        userName: item.posts.profiles?.username || 'Unknown',
        userAvatar: item.posts.profiles?.avatar_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
        userId: user.id,
        likes: 0,
        isLiked: true,
        category: item.posts.category || 'wildlife',
        tags: [`#${item.posts.title.replace(/\s+/g, '')}`, `#saved`],
        badge: 'Saved',
        comments: [],
        timestamp: item.created_at
      }));

      setSavedPosts(formattedPosts);
    } catch (error) {
      console.error('Error fetching saved posts:', error);
      setSavedPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (postId: string) => {
    console.log('Like post:', postId);
  };

  const handleSave = (postId: string) => {
    console.log('Save post:', postId);
  };

  const handleEdit = (postId: string) => {
    console.log('Edit post:', postId);
  };

  const handleDelete = (postId: string) => {
    console.log('Delete post:', postId);
  };

  const handleInfo = (postId: string) => {
    console.log('Info for post:', postId);
  };

  const filteredPosts = activeFilter === "all" 
    ? savedPosts 
    : savedPosts.filter(post => post.category === activeFilter);

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
              <p className="text-sm text-gray-600">Your saved wildlife discoveries</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")}>
                <Grid className="w-4 h-4" />
              </Button>
              <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}>
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {filters.map(filter => (
            <Button 
              key={filter.id} 
              variant={activeFilter === filter.id ? "default" : "outline"} 
              size="sm" 
              onClick={() => setActiveFilter(filter.id)} 
              className="whitespace-nowrap text-slate-700 text-sm bg-green-600 hover:bg-green-500 rounded"
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
              <Bookmark className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">No saved posts yet</h3>
            <p className="text-sm text-gray-600">
              Start saving wildlife discoveries to build your collection!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredPosts.map(post => (
              <div key={post.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
                <img src={post.image} alt={post.speciesName} className="w-full h-32 object-cover" />
                <div className="p-3">
                  <h4 className="font-semibold text-sm text-gray-900 truncate mb-1">
                    {post.speciesName}
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{post.likes} likes</span>
                    <Button variant="ghost" size="sm" onClick={() => handleLike(post.id)} className="p-1">
                      <Heart className={`w-4 h-4 ${post.isLiked ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionsPage;