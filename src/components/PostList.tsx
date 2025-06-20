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
}

const PostList = ({ posts, onLike, onSave, onComment, onShare, onPostClick, onEdit, onDelete, onInfo }: PostListProps) => {
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
              (post.description || ''), // Show abbreviated description in feed
            userNotes: post.caption || '', // Use caption field for user notes
            userName: getDisplayName(post.profiles),
            userAvatar: post.profiles?.avatar_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
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
      ))}
    </div>
  );
};

export default PostList;