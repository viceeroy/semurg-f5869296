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
      {/* Header */}
      <div className="relative">
        <PostHeader
          onClose={onClose}
          onEdit={onEdit}
          onDelete={onDelete}
          onInfo={onInfo}
          postId={post.id}
          postUserId={post.userId}
        />
      </div>

      {/* Post Image */}
      <div className="w-full">
        <img
          src={post.image}
          alt={post.speciesName}
          className="w-full max-h-96 object-contain bg-gray-100"
        />
      </div>

      {/* Profile Section */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          {post.userAvatar ? (
            <img 
              src={post.userAvatar} 
              alt={post.userName}
              className="w-10 h-10 rounded-full object-cover shadow-lg"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-emerald-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
              {post.userName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-foreground">{post.userName}</h3>
            <p className="text-sm text-emerald-600 font-medium">{post.speciesName}</p>
          </div>
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