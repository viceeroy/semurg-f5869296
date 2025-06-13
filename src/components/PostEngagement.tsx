import { Heart, MessageCircle, Bookmark, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PostEngagementProps {
  postId: string;
  likes: number;
  isLiked: boolean;
  isSaved?: boolean;
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
  onLike, 
  onSave, 
  onShare, 
  onToggleComments 
}: PostEngagementProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLike(postId)}
            className={`p-2 ${isLiked ? 'text-red-500' : 'text-muted-foreground'} hover:text-red-500`}
          >
            <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleComments}
            className="p-2 text-muted-foreground hover:text-foreground"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        </div>
        
        <div className="text-sm font-medium text-muted-foreground">
          {likes} {likes === 1 ? 'Like' : 'Likes'}
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSave(postId)}
            className={`p-2 ${isSaved ? 'text-primary' : 'text-muted-foreground'} hover:text-primary`}
          >
            <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onShare}
            className="p-2 text-muted-foreground hover:text-primary"
          >
            <Share2 className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostEngagement;