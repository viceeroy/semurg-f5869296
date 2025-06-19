import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostEngagement from "./PostEngagement";
import PostComments from "./PostComments";
import { handleShare } from "@/utils/postUtils";
import { DetailedPost } from "@/types/detailedPost";

interface DetailedPostViewProps {
  post: DetailedPost;
  onClose: () => void;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  onShare: (postId: string) => void;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onInfo?: (postId: string) => void;
}

const DetailedPostView = ({ 
  post, 
  onClose, 
  onLike, 
  onSave, 
  onComment, 
  onShare, 
  onEdit, 
  onDelete, 
  onInfo 
}: DetailedPostViewProps) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);

  const handleShareClick = () => {
    handleShare(post.speciesName, post.aiInfo, post.id, onShare);
  };

  return (
    <div className="w-full max-w-sm mx-auto mb-6 bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-gray-200 overflow-hidden">
      {/* Header with Background Image */}
      <div 
        className="relative h-[300px] bg-cover bg-center"
        style={{ backgroundImage: `url(${post.image})` }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent" />
        
        {/* Keep existing header with username placement */}
        <div className="absolute top-0 left-0 right-0">
          <PostHeader
            onClose={onClose}
            onEdit={onEdit}
            onDelete={onDelete}
            onInfo={onInfo}
            postId={post.id}
            postUserId={post.userId}
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="py-4 bg-white">
        <PostContent post={post} />
      </div>

      <PostEngagement
        postId={post.id}
        likes={post.likes}
        isLiked={post.isLiked}
        isSaved={post.isSaved}
        commentsCount={post.comments.length}
        onLike={onLike}
        onSave={onSave}
        onShare={handleShareClick}
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

export default DetailedPostView;