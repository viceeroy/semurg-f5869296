import { Heart, MessageCircle, Bookmark, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PostEngagementProps {
  postId: string;
  likes: number;
  isLiked: boolean;
  isSaved?: boolean;
  commentsCount: number;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onShare: () => void;
  onToggleComments: () => void;
}

const PostEngagement = ({ 
  postId, 
  likes, 
  isLiked, 
  isSaved, 
  commentsCount,
  onLike, 
  onSave, 
  onShare, 
  onToggleComments 
}: PostEngagementProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* Left side actions */}
        <div className="flex items-center">
          {/* Like button */}
          <div className="flex items-center mr-12">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike(postId)}
              className={`group p-2 rounded-full transition-all duration-200 hover:scale-105 hover:bg-red-50 ${
                isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
              }`}
            >
              <Heart className={`w-5 h-5 stroke-[1.5] ${isLiked ? 'fill-current' : ''}`} />
            </Button>
            <span className="text-sm font-medium text-muted-foreground ml-1">{likes}</span>
          </div>
          
          {/* Comment button */}
          <div className="flex items-center mr-12">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleComments}
              className="group p-2 rounded-full transition-all duration-200 hover:scale-105 hover:bg-blue-50 text-muted-foreground hover:text-blue-500"
            >
              <MessageCircle className="w-5 h-5 stroke-[1.5]" />
            </Button>
            <span className="text-sm font-medium text-muted-foreground ml-1">{commentsCount}</span>
          </div>
          
          {/* Share button */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onShare}
              className="group p-2 rounded-full transition-all duration-200 hover:scale-105 hover:bg-green-50 text-muted-foreground hover:text-green-500"
            >
              <Send className="w-5 h-5 stroke-[1.5]" />
            </Button>
          </div>
        </div>
        
        {/* Right side save button */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSave(postId)}
            className={`group p-2 rounded-full transition-all duration-200 hover:scale-105 hover:bg-blue-50 ${
              isSaved ? 'text-blue-500' : 'text-muted-foreground hover:text-blue-500'
            }`}
          >
            <Bookmark className={`w-5 h-5 stroke-[1.5] ${isSaved ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostEngagement;