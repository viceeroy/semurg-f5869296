
import { Heart, MessageCircle, Bookmark, Share2, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

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
}

const PostCard = ({ post, onLike, onSave, onComment, onShare }: PostCardProps) => {
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
    <div className="bg-emerald-50/80 rounded-2xl p-4 mb-6 shadow-lg border border-emerald-100">
      {/* User Info Row */}
      <div className="flex items-center mb-4">
        <img 
          src={post.userAvatar} 
          alt={post.userName}
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{post.userName}</h3>
          <p className="text-xs text-emerald-600 font-medium">Species Identified</p>
        </div>
        {post.badge && (
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs px-2 py-1">
            {post.badge}
          </Badge>
        )}
      </div>

      {/* Image Section */}
      <div className="bg-blue-50 rounded-xl p-4 mb-4">
        <img
          src={post.image}
          alt={post.speciesName}
          className="w-full h-64 object-cover rounded-lg"
        />
      </div>

      {/* Description Section */}
      <div className="mb-4">
        <h4 className="font-bold text-foreground mb-2">AI Identification</h4>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          {post.aiInfo}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map((tag, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="bg-blue-100 border-blue-200 text-blue-700 hover:bg-blue-200 rounded-full px-3 py-1 text-xs"
            >
              {tag}
            </Button>
          ))}
        </div>

        {/* User Notes */}
        {post.userNotes && (
          <p className="text-sm text-foreground">
            <span className="font-semibold mr-2">{post.userName}</span>
            {post.userNotes}
          </p>
        )}
      </div>

      {/* Interaction Row */}
      <div className="flex items-center justify-between pt-3 border-t border-emerald-100">
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLike(post.id)}
            className={`p-2 ${post.isLiked ? 'text-red-500' : 'text-muted-foreground'} hover:text-red-500`}
          >
            <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
            <span className="ml-1 text-sm">{post.likes}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="p-2 text-muted-foreground hover:text-foreground"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="ml-1 text-sm">{post.comments.length}</span>
          </Button>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSave(post.id)}
            className={`p-2 ${post.isSaved ? 'text-emerald-600' : 'text-muted-foreground'} hover:text-emerald-600`}
          >
            <Bookmark className={`w-5 h-5 ${post.isSaved ? 'fill-current' : ''}`} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="p-2 text-muted-foreground hover:text-emerald-600"
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-3 border-t border-emerald-100">
          <div className="space-y-2 mb-3">
            {post.comments.map((comment) => (
              <div key={comment.id} className="text-sm">
                <span className="font-semibold text-foreground">{comment.profiles.username}:</span>{" "}
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
              className="flex-1 px-3 py-2 text-sm bg-white border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && newComment.trim()) {
                  onComment(post.id, newComment.trim());
                  setNewComment('');
                }
              }}
            />
            <Button 
              size="sm" 
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => {
                if (newComment.trim()) {
                  onComment(post.id, newComment.trim());
                  setNewComment('');
                }
              }}
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
