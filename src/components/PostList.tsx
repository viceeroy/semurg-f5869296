import PostCard from "./PostCard";
import { useAuth } from "@/hooks/useAuth";
import { Post } from "@/types/post";
import LoadingSpinner from "./LoadingSpinner";

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
  loadingElementRef?: React.RefObject<HTMLDivElement>;
  hasMore?: boolean;
  isFetchingNextPage?: boolean;
}

const PostList = ({ 
  posts, 
  onLike, 
  onSave, 
  onComment, 
  onShare, 
  onPostClick, 
  onEdit, 
  onDelete, 
  onInfo,
  loadingElementRef,
  hasMore = false,
  isFetchingNextPage = false
}: PostListProps) => {
  const { user } = useAuth();

  // Helper function to get display name
  const getDisplayName = (profile: any) => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return profile?.username || 'Anonymous';
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 pb-32">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={{
            id: post.id,
            image: post.image_url,
            speciesName: post.title,
            aiInfo: (post.description || '').length > 120 ? 
              (post.description || '').substring(0, 120) + '...' : 
              (post.description || ''),
            userNotes: post.caption || '',
            userName: getDisplayName(post.profiles),
            userAvatar: post.profiles?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
            likes: post.likes.length,
            isLiked: post.likes.some(like => like.user_id === user?.id),
            isSaved: post.isSaved || false,
            tags: [`#${post.title.replace(/\s+/g, '')}`, post.category ? `#${post.category}` : '#Wildlife'],
            comments: post.comments || [],
            userId: post.user_id
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
      ))}
      
      {/* Infinite scroll loading trigger and indicator */}
      {hasMore && (
        <div 
          ref={loadingElementRef}
          className="flex justify-center py-8"
        >
          {isFetchingNextPage && (
            <LoadingSpinner text="Loading more posts..." />
          )}
        </div>
      )}
      
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">You've reached the end of the feed</p>
        </div>
      )}
    </div>
  );
};

export default PostList;
