
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
      {/* Semurg Brand */}
      <div className="absolute top-4 left-4 z-10">
        <h1 className="text-lg font-bold text-gray-900">Semurg</h1>
      </div>

      {/* User Info Row */}
      <div className="flex items-center mb-4 px-4 pt-4">
        <img 
          src={post.userAvatar} 
          alt={post.userName}
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{post.userName}</h3>
          <p className="text-xs text-emerald-600 font-medium">{post.speciesName}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-[60] min-w-[150px]"
            sideOffset={5}
          >
            <DropdownMenuItem 
              onClick={(e) => { e.stopPropagation(); onEdit?.(post.id); }}
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2"
            >
              Edit Post
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => { e.stopPropagation(); onDelete?.(post.id); }}
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 text-red-600"
            >
              Delete Post
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => { e.stopPropagation(); onInfo?.(post.id); }}
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2"
            >
              Info
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Image Section */}
      <div className="mb-4 -mx-0">
        <img
          src={post.image}
          alt={post.speciesName}
          className="w-full h-80 object-cover"
        />
      </div>

      {/* Description Section */}
      <div className="mb-4 px-4">
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

        {/* User Caption */}
        {post.userNotes && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-foreground">
              <span className="font-semibold mr-2">{post.userName}:</span>
              {post.userNotes}
            </p>
          </div>
        )}
      </div>

      {/* Floating Interaction Row */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onLike(post.id);
                }}
                className={`p-2 rounded-full ${post.isLiked ? 'text-red-500 bg-red-50' : 'text-gray-600'} hover:text-red-500 hover:bg-red-50`}
              >
                <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
              </Button>
              <span className="text-sm font-medium text-gray-600">{post.likes}</span>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowComments(!showComments);
                }}
                className="p-2 rounded-full text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
              >
                <MessageCircle className="w-5 h-5" />
              </Button>
              <span className="text-sm font-medium text-gray-600">{post.comments.length}</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare();
                }}
                className="p-2 rounded-full text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
              >
                <Share2 className="w-5 h-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onSave(post.id);
                }}
                className={`p-2 rounded-full ${post.isSaved ? 'text-emerald-600 bg-emerald-50' : 'text-gray-600'} hover:text-emerald-600 hover:bg-emerald-50`}
              >
                <Bookmark className={`w-5 h-5 ${post.isSaved ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-3 border-t border-gray-200 px-4 pb-20">
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
              className="flex-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              onClick={(e) => {
                e.stopPropagation();
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
