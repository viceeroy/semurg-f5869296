import { useState } from "react";
import PostCardHeader from "./PostCardHeader";
import PostCardImage from "./PostCardImage";
import PostCardContent from "./PostCardContent";
import PostCardActions from "./PostCardActions";
import PostComments from "./PostComments";
import OptimizedPostImage from "./OptimizedPostImage";
import AvatarFallback from "./ui/avatar-fallback";
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
  return (
    <div className="w-full max-w-sm mx-auto mb-6 bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-gray-200 overflow-hidden">
      {/* Header with Optimized Image and Profile Overlay */}
      <div 
        className="relative h-[300px] cursor-pointer overflow-hidden"
        onClick={() => onPostClick?.(post.id)}
      >
        <OptimizedPostImage 
          src={post.image}
          alt={post.speciesName}
          className="w-full h-full"
          width={400}
          priority={false}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent" />
        
        {/* Profile Info - Top Left */}
        <div className="absolute top-3 left-3 flex items-center space-x-2">
          <AvatarFallback
            src={post.userAvatar}
            name={post.userName}
            size="sm"
            alt={post.userName}
            className="shadow-lg border-2 border-white"
          />
          <div>
            <h3 className="text-white font-medium text-sm drop-shadow-sm">{post.userName}</h3>
            <p className="text-white/90 text-xs drop-shadow-sm">{post.speciesName}</p>
          </div>
        </div>

        {/* Three Dots Menu - Top Right */}
        <div className="absolute top-3 right-3">
          <PostCardHeader 
            userName={post.userName} 
            userAvatar={post.userAvatar} 
            speciesName={post.speciesName} 
            postId={post.id} 
            postUserId={post.userId} 
            onEdit={onEdit} 
            onDelete={onDelete} 
            onInfo={onInfo}
            isOverlay={true}
          />
        </div>

      </div>

      {/* Content Section */}
      <div className="py-4 bg-white">
        <PostCardContent 
          aiInfo={post.aiInfo} 
          tags={post.tags} 
          userNotes={post.userNotes} 
          userName={post.userName} 
        />

        {onPostClick && (
          <div className="mt-3 px-6 text-xs text-emerald-600 font-medium">
            Click to read more →
          </div>
        )}
      </div>

      <PostCardActions 
        postId={post.id} 
        likes={post.likes} 
        isLiked={post.isLiked} 
        isSaved={post.isSaved} 
        commentsCount={post.comments.length} 
        onLike={onLike} 
        onSave={onSave} 
        onShare={handleShare} 
        onToggleComments={() => setShowComments(!showComments)} 
      />

      <PostComments
        postId={post.id}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        isEducationalPost={false}
      />
    </div>
  );
};
export default PostCard;