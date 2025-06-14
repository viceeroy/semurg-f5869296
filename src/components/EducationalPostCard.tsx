import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EducationalPost } from "@/services/educationalPostService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface EducationalPostCardProps {
  post: EducationalPost;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
}

const EducationalPostCard = ({ post, onLike, onComment, onShare }: EducationalPostCardProps) => {
  const { user } = useAuth();

  const handleLike = () => {
    if (!user) {
      toast.error('Please sign in to like posts');
      return;
    }
    onLike(post.id);
  };

  const handleComment = () => {
    if (!user) {
      toast.error('Please sign in to comment');
      return;
    }
    onComment(post.id);
  };

  const handleShare = () => {
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
    <div className="bg-card rounded-lg border border-border mb-4 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-full">
            {getCategoryEmoji(post.category)} {getPostTypeLabel(post.post_type)}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(post.created_at).toLocaleDateString()}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{post.title}</h3>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {post.content}
        </p>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="bg-secondary/50 border-border text-secondary-foreground hover:bg-secondary rounded-full px-3 py-1 text-xs"
              >
                #{tag}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Engagement Bar */}
      <div className="px-4 py-3 border-t border-border bg-secondary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Like button */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`p-2 rounded-full transition-all duration-200 hover:scale-105 hover:bg-red-50 ${
                  post.is_liked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
                }`}
              >
                <Heart className={`w-4 h-4 stroke-[1.5] ${post.is_liked ? 'fill-current' : ''}`} />
              </Button>
              <span className="text-sm font-medium text-muted-foreground">{post.likes_count}</span>
            </div>

            {/* Comment button */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleComment}
                className="p-2 rounded-full transition-all duration-200 hover:scale-105 hover:bg-blue-50 text-muted-foreground hover:text-blue-500"
              >
                <MessageCircle className="w-4 h-4 stroke-[1.5]" />
              </Button>
              <span className="text-sm font-medium text-muted-foreground">{post.comments_count}</span>
            </div>

            {/* Share button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="p-2 rounded-full transition-all duration-200 hover:scale-105 hover:bg-green-50 text-muted-foreground hover:text-green-500"
            >
              <Share2 className="w-4 h-4 stroke-[1.5]" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationalPostCard;