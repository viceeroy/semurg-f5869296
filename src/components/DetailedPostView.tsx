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
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      <PostHeader
        onClose={onClose}
        onEdit={onEdit}
        onDelete={onDelete}
        onInfo={onInfo}
        postId={post.id}
        postUserId={post.userId}
      />

      {/* Main Content */}
      <div className="pb-20">
        {/* Dominant Image */}
        <div className="w-full">
          <img
            src={post.image}
            alt={post.speciesName}
            className="w-full h-80 sm:h-96 object-cover"
          />
        </div>

        <PostContent post={post} />

        <PostComments
          postId={post.id}
          comments={post.comments}
          showComments={showComments}
          onComment={onComment}
        />
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
    </div>
  );
};

export default DetailedPostView;