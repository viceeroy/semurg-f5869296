import { useState, useEffect } from "react";
import { Heart, BookOpen, Grid, List, History, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import PostCard from "./PostCard";
import { useAuth } from "@/hooks/useAuth";
import { fetchUserHistory, clearUserHistory, HistoryItem } from "@/services/historyService";
import { toast } from "sonner";

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles: {
    username: string;
  };
}

interface HistoryPost {
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
  actionType: string;
  timestamp: string;
}

const HistoryPage = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeFilter, setActiveFilter] = useState("all");
  const [historyItems, setHistoryItems] = useState<HistoryPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock history data for demonstration
  const mockHistoryData = [
    {
      id: 'history-1',
      image: 'https://images.unsplash.com/photo-1518373714866-3f1478910cc0?w=800',
      speciesName: 'Northern Cardinal',
      aiInfo: 'Identified as Northern Cardinal with 95% confidence. Males are brilliant red with black face mask.',
      userNotes: 'Spotted this gorgeous male cardinal in my backyard this morning!',
      userName: 'You',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
      userId: user?.id || 'mock-user-id',
      likes: 12,
      isLiked: true,
      category: 'birds',
      tags: ['#NorthernCardinal', '#Identified'],
      badge: 'Identified',
      comments: [],
      actionType: 'identify',
      timestamp: new Date().toISOString()
    },
    {
      id: 'history-2',
      image: 'https://images.unsplash.com/photo-1558618066-fcd25c85cd64?w=800',
      speciesName: 'Great Blue Heron',
      aiInfo: 'Identified as Great Blue Heron. Large wading bird, excellent fishing skills.',
      userNotes: 'Amazing patience watching this heron hunt for fish at the lake.',
      userName: 'You',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
      userId: user?.id || 'mock-user-id',
      likes: 8,
      isLiked: false,
      category: 'birds',
      tags: ['#GreatBlueHeron', '#Viewed'],
      badge: 'Viewed',
      comments: [],
      actionType: 'view',
      timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
    },
    {
      id: 'history-3',
      image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800',
      speciesName: 'White-tailed Deer',
      aiInfo: 'Identified as White-tailed Deer. Medium-sized deer native to North America.',
      userNotes: 'Family of deer spotted during early morning hike.',
      userName: 'You',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
      userId: user?.id || 'mock-user-id',
      likes: 15,
      isLiked: true,
      category: 'mammals',
      tags: ['#WhiteTailedDeer', '#Identified'],
      badge: 'Identified',
      comments: [],
      actionType: 'identify',
      timestamp: new Date(Date.now() - 172800000).toISOString() // 2 days ago
    },
    {
      id: 'history-4',
      image: 'https://images.unsplash.com/photo-1470509037663-253afd7f0f51?w=800',
      speciesName: 'Wild Sunflower',
      aiInfo: 'Identified as Wild Sunflower. Native wildflower, important for pollinators.',
      userNotes: 'Beautiful field of sunflowers found during nature walk.',
      userName: 'You',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
      userId: user?.id || 'mock-user-id',
      likes: 23,
      isLiked: true,
      category: 'plants',
      tags: ['#Sunflower', '#Viewed'],
      badge: 'Viewed',
      comments: [],
      actionType: 'view',
      timestamp: new Date(Date.now() - 259200000).toISOString() // 3 days ago
    }
  ];

  const filters = [
    {
      id: "all",
      label: "All",
      count: historyItems.length
    },
    {
      id: "identify", 
      label: "Identified",
      count: historyItems.filter(p => p.actionType === "identify").length
    },
    {
      id: "view",
      label: "Viewed", 
      count: historyItems.filter(p => p.actionType === "view").length
    },
    {
      id: "birds",
      label: "Birds",
      count: historyItems.filter(p => p.category === "birds").length
    },
    {
      id: "mammals",
      label: "Mammals", 
      count: historyItems.filter(p => p.category === "mammals").length
    },
    {
      id: "plants",
      label: "Plants",
      count: historyItems.filter(p => p.category === "plants").length
    }
  ];

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const historyData = await fetchUserHistory(user.id);
      
      const formattedHistory = historyData.map(item => ({
        id: item.id,
        image: item.image_url || 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
        speciesName: item.title,
        aiInfo: item.description || `${item.action_type === 'identify' ? 'Identified' : 'Viewed'} ${item.title}`,
        userNotes: '',
        userName: 'You',
        userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
        userId: user.id,
        likes: 0,
        isLiked: false,
        category: item.category || 'wildlife',
        tags: [`#${item.title.replace(/\s+/g, '')}`, `#${item.action_type}`],
        badge: item.action_type === 'identify' ? 'Identified' : 'Viewed',
        comments: [],
        actionType: item.action_type,
        timestamp: item.created_at
      }));

      setHistoryItems(formattedHistory.length > 0 ? formattedHistory : mockHistoryData);
    } catch (error) {
      console.error('Error fetching history:', error);
      setHistoryItems(mockHistoryData);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!user) return;
    
    try {
      await clearUserHistory(user.id);
      setHistoryItems([]);
      toast.success('History cleared successfully');
    } catch (error) {
      console.error('Error clearing history:', error);
      toast.error('Failed to clear history');
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
    ? historyItems 
    : activeFilter === "identify" || activeFilter === "view"
    ? historyItems.filter(post => post.actionType === activeFilter)
    : historyItems.filter(post => post.category === activeFilter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your history...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">My History</h1>
              <p className="text-sm text-gray-600">Wildlife you've identified & viewed</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClearHistory}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
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
              <History className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">No history yet</h3>
            <p className="text-sm text-gray-600">
              Start identifying wildlife to build your history!
            </p>
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-2 gap-4" : "space-y-4"}>
            {filteredPosts.map(post => (
              <div key={post.id} className={viewMode === "grid" ? "break-inside-avoid" : ""}>
                {viewMode === "list" ? (
                  <PostCard 
                    post={post} 
                    onLike={handleLike} 
                    onSave={handleSave} 
                    onComment={() => {}} 
                    onShare={() => {}} 
                    onEdit={handleEdit} 
                    onDelete={handleDelete} 
                    onInfo={handleInfo} 
                  />
                ) : (
                  <div className="glass-card rounded-xl overflow-hidden">
                    <img src={post.image} alt={post.speciesName} className="w-full h-40 object-cover" />
                    <div className="p-3">
                      <h4 className="font-semibold text-sm text-gray-900 truncate">
                        {post.speciesName}
                      </h4>
                      <p className="text-xs text-gray-500 mb-1">{post.badge}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(post.timestamp).toLocaleDateString()}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-600">{post.actionType}</span>
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

export default HistoryPage;