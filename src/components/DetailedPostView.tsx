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
    <div className="mb-6 shadow-lg border border-gray-200 overflow-hidden relative rounded-xl bg-slate-200">
      <PostHeader
        onClose={onClose}
        onEdit={onEdit}
        onDelete={onDelete}
        onInfo={onInfo}
        postId={post.id}
        postUserId={post.userId}
      />

      {/* Post Image */}
      <div className="w-full">
        <img
          src={post.image}
          alt={post.speciesName}
          className="w-full max-h-96 object-contain bg-gray-100"
        />
      </div>

      <PostContent post={post} />

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