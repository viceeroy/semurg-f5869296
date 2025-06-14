import PostCard from "./PostCard";
import { useAuth } from "@/hooks/useAuth";
import { Post } from "@/types/post";

interface PostListProps {
  posts: Post[];
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

  return (
    <div className="max-w-md mx-auto px-4 py-6 pb-32">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={{
            id: post.id,
            image: post.image_url,
            speciesName: post.title,
            aiInfo: post.description || '',
            userNotes: post.caption || '', // Use caption field for user notes
            userName: post.profiles?.username || 'Anonymous',
            userAvatar: post.profiles?.avatar_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
            likes: post.likes.length,
            isLiked: post.likes.some(like => like.user_id === user?.id),
            isSaved: false, // This will be updated when we fetch saved posts
            tags: [`#${post.title.replace(/\s+/g, '')}`, '#Wildlife'],
            comments: post.comments || []
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