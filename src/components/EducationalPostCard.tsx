import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EducationalPost } from "@/services/educationalPostService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useState } from "react";
import EducationalPostComments from "./EducationalPostComments";

interface EducationalPostCardProps {
  post: EducationalPost;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onClick?: () => void;
}

const EducationalPostCard = ({ post, onLike, onComment, onShare, onClick }: EducationalPostCardProps) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent post click when clicking action buttons
    if (!user) {
      toast.error('Please sign in to like posts');
      return;
    }
    onLike(post.id);
  };

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent post click when clicking action buttons
    setShowComments(true);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent post click when clicking action buttons
    onShare(post.id);
  };

  const getPostTypeLabel = (type: string) => {
    switch (type) {
      case 'did-you-know':
        return 'Did You Know?';
      case 'interesting-fact':
        return 'Interesting Fact';
      case 'how-to':
        return 'How To';
      case 'where-to-find':
        return 'Where To Find';
      default:
        return type;
    }
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'animals':
        return '🐾';
      case 'birds':
        return '🐦';
      case 'plants':
        return '🌱';
      default:
        return '📚';
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto mb-6 bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-gray-200 overflow-hidden animate-fade-in">
      {/* Header with Profile Info */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-emerald-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
              {getCategoryEmoji(post.category)}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Educational Content</h3>
              <p className="text-sm text-emerald-600 font-medium">{getPostTypeLabel(post.post_type)}</p>
            </div>
          </div>
          <span className="text-xs text-muted-foreground">
            {new Date(post.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div 
        className={`p-6 ${onClick ? 'cursor-pointer hover:bg-secondary/30 transition-colors' : ''}`}
        onClick={onClick}
      >
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground leading-tight">{post.title}</h2>
          
          <div>
            <h4 className="font-semibold text-foreground mb-2">AI Identification</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {post.content.length > 200 ? `${post.content.substring(0, 200)}...` : post.content}
            </p>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag, index) => (
                <button
                  key={index}
                  className="bg-blue-100 border border-blue-200 text-blue-700 hover:bg-blue-200 rounded-full px-3 py-1 text-xs font-medium transition-colors"
                >
                  #{tag}
                </button>
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs text-muted-foreground self-center">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {onClick && (
            <div className="text-sm text-emerald-600 font-medium hover:text-emerald-700 transition-colors">
              Click to read more →
            </div>
          )}
        </div>
      </div>

      {/* Engagement Bar */}
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Like button */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleLike}
                className={`p-2 rounded-full transition-all duration-200 hover:scale-105 hover:bg-red-50 ${
                  post.is_liked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 stroke-[1.5] ${post.is_liked ? 'fill-current' : ''}`} />
              </button>
              <span className="text-sm font-medium text-muted-foreground">{post.likes_count}</span>
            </div>

            {/* Comment button */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleComment}
                className="p-2 rounded-full transition-all duration-200 hover:scale-105 hover:bg-blue-50 text-muted-foreground hover:text-blue-500"
              >
                <MessageCircle className="w-5 h-5 stroke-[1.5]" />
              </button>
              <span className="text-sm font-medium text-muted-foreground">{post.comments_count}</span>
            </div>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="p-2 rounded-full transition-all duration-200 hover:scale-105 hover:bg-green-50 text-muted-foreground hover:text-green-500"
            >
              <Share2 className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Comments Modal */}
      <EducationalPostComments
        postId={post.id}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
      />
    </div>
  );
};

export default EducationalPostCard;