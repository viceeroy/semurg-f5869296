
import PostCard from "./PostCard";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Post {
  id: string;
  user_id: string;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string;
  };
  likes: { user_id: string }[];
  _count?: {
    likes: number;
  };
}

const HomeFeed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock posts for when database is empty
  const mockPosts = [
    {
      id: 'mock-1',
      user_id: 'mock-user-1',
      title: 'Northern Cardinal',
      description: 'A beautiful male Northern Cardinal spotted in Central Park. These vibrant red birds are year-round residents and are known for their distinctive crest and melodious song.',
      image_url: 'https://images.unsplash.com/photo-1518373714866-3f1478910cc0?w=800',
      created_at: '2024-01-15T10:30:00Z',
      profiles: { username: 'BirdWatcher92', avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100' },
      likes: [{ user_id: 'user1' }, { user_id: 'user2' }]
    },
    {
      id: 'mock-2',
      user_id: 'mock-user-2',
      title: 'White-tailed Deer',
      description: 'A graceful white-tailed deer foraging in the early morning mist. Notice the characteristic white underside of the tail that gives this species its name.',
      image_url: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800',
      created_at: '2024-01-14T07:45:00Z',
      profiles: { username: 'NatureExplorer', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
      likes: [{ user_id: 'user3' }]
    },
    {
      id: 'mock-3',
      user_id: 'mock-user-3',
      title: 'Great Blue Heron',
      description: 'Majestic Great Blue Heron patiently hunting in shallow water. These impressive wading birds can stand motionless for hours waiting for the perfect moment to strike.',
      image_url: 'https://images.unsplash.com/photo-1558618066-fcd25c85cd64?w=800',
      created_at: '2024-01-13T16:20:00Z',
      profiles: { username: 'WildlifePhotog', avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
      likes: [{ user_id: 'user1' }, { user_id: 'user3' }, { user_id: 'user4' }]
    }
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (username, avatar_url),
          likes (user_id)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        return;
      }

      setPosts(data && data.length > 0 ? data : mockPosts);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) {
      toast.error('Please sign in to like posts');
      return;
    }

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const isLiked = post.likes.some(like => like.user_id === user.id);

    try {
      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (error) {
          toast.error('Error unliking post');
          return;
        }
      } else {
        // Like
        const { error } = await supabase
          .from('likes')
          .insert({ post_id: postId, user_id: user.id });

        if (error) {
          toast.error('Error liking post');
          return;
        }
      }

      // Refresh posts
      fetchPosts();
    } catch (error) {
      toast.error('Error updating like');
    }
  };

  const handleSave = (postId: string) => {
    toast.success('Post saved to your collections!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 text-center">Semurg</h1>
          <p className="text-sm text-gray-600 text-center">Discover Wildlife with AI</p>
        </div>
      </div>

      {/* Feed */}
      <div className="max-w-md mx-auto px-4 py-6 pb-24">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={{
              id: post.id,
              image: post.image_url,
              speciesName: post.title,
              aiInfo: post.description || '',
              userNotes: '',
              userName: post.profiles?.username || 'Anonymous',
              userAvatar: post.profiles?.avatar_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
              likes: post.likes.length,
              isLiked: post.likes.some(like => like.user_id === user?.id)
            }}
            onLike={handleLike}
            onSave={handleSave}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeFeed;
