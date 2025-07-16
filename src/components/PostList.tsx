import React from "react";
import PostCard from "./PostCard";
import { useAuth } from "@/hooks/useAuth";
import { Post } from "@/types/post";

interface PostWithSaved extends Post {
  isSaved?: boolean;
}

interface PostListProps {
  posts: PostWithSaved[];
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  onShare: (postId: string) => void;
  onPostClick?: (postId: string) => void;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onInfo?: (postId: string) => void;
  loadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

const PostList = ({ posts, onLike, onSave, onComment, onShare, onPostClick, onEdit, onDelete, onInfo, loadingMore, hasMore, onLoadMore }: PostListProps) => {
  const { user } = useAuth();

  // Helper function to get display name
  const getDisplayName = (profile: any) => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return profile?.username || 'Anonymous';
  };

  // Intersection Observer for infinite scroll
  const lastPostRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    if (!hasMore || loadingMore || !onLoadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (lastPostRef.current) {
      observer.observe(lastPostRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadingMore, onLoadMore]);

  return (
    <div className="max-w-md mx-auto px-4 py-6 pb-32">
      {posts.map((post, index) => (
        <div
          key={post.id}
          ref={index === posts.length - 1 ? lastPostRef : null}
        >
          <PostCard
            post={{
              id: post.id,
              image: post.image_url,
              speciesName: post.title,
              aiInfo: (post.description || '').length > 120 ? 
                (post.description || '').substring(0, 120) + '...' : 
                (post.description || ''), // Show abbreviated description in feed
              userNotes: post.caption || '', // Use caption field for user notes
              userName: getDisplayName(post.profiles),
              userAvatar: post.profiles?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
              likes: post.likes.length,
              isLiked: post.likes.some(like => like.user_id === user?.id),
              isSaved: post.isSaved || false, // Use the passed isSaved value or default to false
              tags: [`#${post.title.replace(/\s+/g, '')}`, post.category ? `#${post.category}` : '#Wildlife'],
              comments: post.comments || [],
              userId: post.user_id // Pass the actual user_id
            }}
            onLike={onLike}
            onSave={onSave}
            onComment={onComment}
            onShare={onShare}
            onPostClick={onPostClick}
            onEdit={onEdit}
            onDelete={onDelete}
            onInfo={onInfo}
          />
        </div>
      ))}
      
      {loadingMore && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          <p>You've seen all posts</p>
        </div>
      )}
    </div>
  );
};

export default PostList;