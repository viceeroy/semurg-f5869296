import { Heart, MessageCircle, Bookmark, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PostCardActionsProps {
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

const PostCardActions = ({ 
  postId, 
  likes, 
  isLiked, 
  isSaved, 
  commentsCount,
  onLike, 
  onSave, 
  onShare, 
  onToggleComments 
}: PostCardActionsProps) => {
  return (
    <div className="absolute bottom-4 left-4 right-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onLike(postId);
              }}
              className={`p-1 rounded-full ${isLiked ? 'text-red-500' : 'text-gray-600'} hover:text-red-500`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
            <span className="text-sm font-medium text-gray-600 mr-3">{likes}</span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggleComments();
              }}
              className="p-1 rounded-full text-gray-600 hover:text-gray-800"
            >
              <MessageCircle className="w-5 h-5" />
            </Button>
            <span className="text-sm font-medium text-gray-600 mr-3">{commentsCount}</span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onShare();
              }}
              className="p-1 rounded-full text-gray-600 hover:text-gray-800"
            >
              <Share2 className="w-5 h-5" />
            </Button>
            <span className="text-sm font-medium text-gray-600">5</span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onSave(postId);
            }}
            className={`p-1 rounded-full ${isSaved ? 'text-gray-800' : 'text-gray-600'} hover:text-gray-800`}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostCardActions;