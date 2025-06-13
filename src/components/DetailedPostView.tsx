import { ArrowLeft, MoreHorizontal, Heart, MessageCircle, Bookmark, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles: {
    username: string;
  };
}

interface DetailedPost {
  id: string;
  image: string;
  speciesName: string;
  scientificName?: string;
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
  uploadDate: string;
  characteristics?: string[];
  habitat?: string;
  diet?: string;
  behavior?: string;
  conservationStatus?: string;
}

interface DetailedPostViewProps {
  post: DetailedPost;
  onClose: () => void;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  onShare: (postId: string) => void;
}

const DetailedPostView = ({ post, onClose, onLike, onSave, onComment, onShare }: DetailedPostViewProps) => {
  const { user } = useAuth();
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
      navigator.clipboard.writeText(window.location.href);
    }
    onShare(post.id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "1 day ago";
    return date.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      {/* Top Navigation */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-foreground hover:bg-accent"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground hover:bg-accent"
          >
            <MoreHorizontal className="w-6 h-6" />
          </Button>
        </div>
      </div>

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

        {/* Content Section */}
        <div className="p-6 space-y-6">
          {/* User Header */}
          <div className="flex items-center space-x-3">
            <img 
              src={post.userAvatar} 
              alt={post.userName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-foreground">{post.userName}</h3>
              <p className="text-sm text-muted-foreground">{formatDate(post.uploadDate)}</p>
            </div>
          </div>

          {/* AI Identification Section */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">{post.speciesName}</h2>
              {post.scientificName && (
                <p className="text-lg italic text-muted-foreground">{post.scientificName}</p>
              )}
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">AI Identification Details</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{post.aiInfo}</p>
            </div>

            {post.characteristics && post.characteristics.length > 0 && (
              <div>
                <h4 className="font-semibold text-foreground mb-2">Key Characteristics</h4>
                <ul className="space-y-1">
                  {post.characteristics.map((char, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0" />
                      {char}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {post.habitat && (
              <div>
                <h4 className="font-semibold text-foreground mb-1">Habitat</h4>
                <p className="text-sm text-muted-foreground">{post.habitat}</p>
              </div>
            )}

            {post.diet && (
              <div>
                <h4 className="font-semibold text-foreground mb-1">Diet</h4>
                <p className="text-sm text-muted-foreground">{post.diet}</p>
              </div>
            )}

            {post.behavior && (
              <div>
                <h4 className="font-semibold text-foreground mb-1">Behavior</h4>
                <p className="text-sm text-muted-foreground">{post.behavior}</p>
              </div>
            )}

            {post.conservationStatus && (
              <div>
                <h4 className="font-semibold text-foreground mb-1">Conservation Status</h4>
                <p className="text-sm text-muted-foreground">{post.conservationStatus}</p>
              </div>
            )}
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="bg-secondary/50 border-border text-secondary-foreground hover:bg-secondary rounded-full px-3 py-1 text-xs"
                >
                  {tag}
                </Button>
              ))}
            </div>
          )}

          {/* User Caption */}
          {post.userNotes && (
            <div>
              <h4 className="font-semibold text-foreground mb-2">Caption</h4>
              <p className="text-sm text-foreground">{post.userNotes}</p>
            </div>
          )}

          {/* Comments Section */}
          {showComments && (
            <div className="space-y-4 pt-4 border-t border-border">
              <h4 className="font-semibold text-foreground">Comments</h4>
              <div className="space-y-3">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="text-sm">
                    <span className="font-semibold text-foreground">{comment.profiles.username}: </span>
                    <span className="text-muted-foreground">{comment.content}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newComment.trim()) {
                      onComment(post.id, newComment.trim());
                      setNewComment('');
                    }
                  }}
                />
                <Button 
                  size="sm" 
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => {
                    if (newComment.trim()) {
                      onComment(post.id, newComment.trim());
                      setNewComment('');
                    }
                  }}
                >
                  Post
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Engagement Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike(post.id)}
              className={`p-2 ${post.isLiked ? 'text-red-500' : 'text-muted-foreground'} hover:text-red-500`}
            >
              <Heart className={`w-6 h-6 ${post.isLiked ? 'fill-current' : ''}`} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="p-2 text-muted-foreground hover:text-foreground"
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
          </div>
          
          <div className="text-sm font-medium text-muted-foreground">
            {post.likes} {post.likes === 1 ? 'Like' : 'Likes'}
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSave(post.id)}
              className={`p-2 ${post.isSaved ? 'text-primary' : 'text-muted-foreground'} hover:text-primary`}
            >
              <Bookmark className={`w-6 h-6 ${post.isSaved ? 'fill-current' : ''}`} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="p-2 text-muted-foreground hover:text-primary"
            >
              <Share2 className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedPostView;