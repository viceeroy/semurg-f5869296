
import { useState } from "react";
import PostCardHeader from "./PostCardHeader";
import PostCardImage from "./PostCardImage";
import PostCardContent from "./PostCardContent";
import PostCardActions from "./PostCardActions";
import PostCardComments from "./PostCardComments";

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

const PostCard = ({ post, onLike, onSave, onComment, onShare, onPostClick, onEdit, onDelete, onInfo }: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Check out this ${post.speciesName}`,
        text: post.aiInfo,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers without native sharing
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast here
    }
    onShare(post.id);
  };

  return (
    <div 
      className="bg-white rounded-2xl mb-6 shadow-lg border border-gray-200 cursor-pointer overflow-hidden relative"
      onClick={() => onPostClick?.(post.id)}
    >
      <PostCardHeader
        userName={post.userName}
        userAvatar={post.userAvatar}
        speciesName={post.speciesName}
        postId={post.id}
        onEdit={onEdit}
        onDelete={onDelete}
        onInfo={onInfo}
      />

      <PostCardImage
        image={post.image}
        speciesName={post.speciesName}
      />

      <PostCardContent
        aiInfo={post.aiInfo}
        tags={post.tags}
        userNotes={post.userNotes}
        userName={post.userName}
      />

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

      <PostCardComments
        postId={post.id}
        comments={post.comments}
        showComments={showComments}
        newComment={newComment}
        onNewCommentChange={setNewComment}
        onComment={onComment}
      />
    </div>
  );
};

export default PostCard;
