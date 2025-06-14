
import { useState, useEffect } from "react";
import { Heart, BookOpen, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import PostCard from "./PostCard";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles: {
    username: string;
  };
}

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
  comments: Comment[];
  userId: string;
}

const CollectionsPage = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeFilter, setActiveFilter] = useState("all");
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock saved posts for when user has no posts
  const mockSavedPosts = [
    {
      id: 'saved-1',
      image: 'https://images.unsplash.com/photo-1518373714866-3f1478910cc0?w=800',
      speciesName: 'Northern Cardinal',
      aiInfo: 'The Northern Cardinal (Cardinalis cardinalis) is a beautiful songbird native to North America. Males are brilliant red with a black face mask, while females are warm brown with reddish tinges.',
      userNotes: 'Spotted this gorgeous male cardinal in my backyard this morning!',
      userName: 'You',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
      userId: user?.id || 'mock-user-id',
      likes: 12,
      isLiked: true,
      category: 'bird',
      tags: ['#NorthernCardinal', '#Backyard'],
      badge: 'Easy to spot',
      comments: []
    },
    {
      id: 'saved-2',
      image: 'https://images.unsplash.com/photo-1558618066-fcd25c85cd64?w=800',
      speciesName: 'Great Blue Heron',
      aiInfo: 'The Great Blue Heron (Ardea herodias) is the largest North American heron. These impressive wading birds are patient hunters, often standing motionless for long periods.',
      userNotes: 'Amazing patience watching this heron hunt for fish at the lake.',
      userName: 'You',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
      userId: user?.id || 'mock-user-id',
      likes: 8,
      isLiked: false,
      category: 'bird',
      tags: ['#GreatBlueHeron', '#Lake'],
      badge: 'Patient Hunter',
      comments: []
    },
    {
      id: 'saved-3',
      image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800',
      speciesName: 'White-tailed Deer',
      aiInfo: 'White-tailed deer (Odocoileus virginianus) are medium-sized deer native to North America. They are recognizable by the white underside of their tails.',
      userNotes: 'Family of deer spotted during early morning hike.',
      userName: 'You',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
      userId: user?.id || 'mock-user-id',
      likes: 15,
      isLiked: true,
      category: 'mammal',
      tags: ['#WhiteTailedDeer', '#Morning'],
      badge: 'Family Group',
      comments: []
    },
    {
      id: 'saved-4',
      image: 'https://images.unsplash.com/photo-1470509037663-253afd7f0f51?w=800',
      speciesName: 'Wild Sunflower',
      aiInfo: 'Wild Sunflowers (Helianthus) are native wildflowers that provide essential food for birds and pollinators. They can grow up to 10 feet tall and bloom from summer through fall.',
      userNotes: 'Beautiful field of sunflowers found during nature walk.',
      userName: 'You',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
      userId: user?.id || 'mock-user-id',
      likes: 23,
      isLiked: true,
      category: 'plant',
      tags: ['#Sunflower', '#Prairie'],
      badge: 'Pollinator Friendly',
      comments: []
    },
    {
      id: 'saved-5',
      image: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800',
      speciesName: 'Red Fox',
      aiInfo: 'The Red Fox (Vulpes vulpes) is the most widespread carnivore in the world. They are highly adaptable animals with excellent hearing and can detect small mammals under snow.',
      userNotes: 'Lucky to spot this beautiful fox at dawn in the forest.',
      userName: 'You',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
      userId: user?.id || 'mock-user-id',
      likes: 31,
      isLiked: false,
      category: 'mammal',
      tags: ['#RedFox', '#Dawn'],
      badge: 'Rare Sighting',
      comments: []
    },
    {
      id: 'saved-6',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
      speciesName: 'White Oak',
      aiInfo: 'The White Oak (Quercus alba) is a majestic tree that can live for centuries. It provides food for over 500 species of butterflies and moths, and its acorns feed many wildlife species.',
      userNotes: 'This ancient oak has been standing here for over 200 years.',
      userName: 'You',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
      userId: user?.id || 'mock-user-id',
      likes: 18,
      isLiked: true,
      category: 'plant',
      tags: ['#WhiteOak', '#Ancient'],
      badge: 'Historic Tree',
      comments: []
    }
  ];

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
        userNotes: '',
        userName: post.profiles?.username || 'You',
        userAvatar: post.profiles?.avatar_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
        userId: post.user_id,
        likes: post.likes.length,
        isLiked: post.likes.some(like => like.user_id === user?.id),
        category: 'bird', // Default category, in real app this would come from AI identification
        tags: [`#${post.title.replace(/\s+/g, '')}`, '#MyDiscovery'],
        badge: 'My Discovery',
        comments: []
      })) || [];

      setSavedPosts(formattedPosts.length > 0 ? formattedPosts : mockSavedPosts);
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
                    onComment={() => {}}
                    onShare={() => {}}
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
