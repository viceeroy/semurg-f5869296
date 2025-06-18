import { useState } from "react";
import PostCardHeader from "./PostCardHeader";
import PostCardImage from "./PostCardImage";
import PostCardContent from "./PostCardContent";
import PostCardActions from "./PostCardActions";
import PostComments from "./PostComments";
interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles: {
    username: string;
  };
}
interface PostCardProps {
  post: {
    id: string;
    image: string;
    speciesName: string;
    aiInfo: string;
    userNotes: string;
    userName: string;
    userAvatar: string;
    likes: number;
    isLiked: boolean;
    isSaved?: boolean;
    tags: string[];
    badge?: string;
    comments: Comment[];
    userId: string;
  };
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  onShare: (postId: string) => void;
  onPostClick?: (postId: string) => void;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onInfo?: (postId: string) => void;
}
const PostCard = ({
  post,
  onLike,
  onSave,
  onComment,
  onShare,
  onPostClick,
  onEdit,
  onDelete,
  onInfo
}: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const handleShare = async () => {
    const shareData = {
      title: `Check out this ${post.speciesName} on Semurg`,
      text: `${post.aiInfo.slice(0, 100)}${post.aiInfo.length > 100 ? '...' : ''}`,
      url: `${window.location.origin}/?post=${post.id}`,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        // Show toast notification
        const event = new CustomEvent('share-fallback', { 
          detail: { message: 'Link copied to clipboard!' } 
        });
        window.dispatchEvent(event);
      }
      onShare(post.id);
    } catch (error) {
      console.error('Error sharing:', error);
      try {
        await navigator.clipboard.writeText(shareData.url);
        const event = new CustomEvent('share-fallback', { 
          detail: { message: 'Link copied to clipboard!' } 
        });
        window.dispatchEvent(event);
        onShare(post.id);
      } catch (clipboardError) {
        console.error('Clipboard also failed:', clipboardError);
      }
    }
  };
  return <div className="mb-6 shadow-lg border border-gray-200 overflow-hidden relative rounded-xl bg-slate-200">
      <PostCardHeader userName={post.userName} userAvatar={post.userAvatar} speciesName={post.speciesName} postId={post.id} postUserId={post.userId} onEdit={onEdit} onDelete={onDelete} onInfo={onInfo} />

      <div 
        onClick={() => onPostClick?.(post.id)} 
        className={`${onPostClick ? 'cursor-pointer hover:bg-secondary/30 transition-colors' : ''}`}
      >
        <PostCardImage image={post.image} speciesName={post.speciesName} />

        <PostCardContent aiInfo={post.aiInfo} tags={post.tags} userNotes={post.userNotes} userName={post.userName} />

        {onPostClick && (
          <div className="px-4 pb-2">
            <div className="text-xs text-emerald-600 font-medium">
              Click to read more →
            </div>
          </div>
        )}
      </div>

      <PostCardActions postId={post.id} likes={post.likes} isLiked={post.isLiked} isSaved={post.isSaved} commentsCount={post.comments.length} onLike={onLike} onSave={onSave} onShare={handleShare} onToggleComments={() => setShowComments(!showComments)} />

      <PostComments
        postId={post.id}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        isEducationalPost={false}
      />
    </div>;
};
export default PostCard;