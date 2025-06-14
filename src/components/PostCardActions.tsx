import { Heart, MessageCircle, Bookmark, Send } from "lucide-react";
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
    <div className="px-4 pb-4">
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center space-x-6">
          <div className="flex flex-col items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onLike(postId);
              }}
              className={`p-2.5 rounded-full ${isLiked ? 'text-red-500' : 'text-gray-600'} hover:text-red-500`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
            <span className="text-xs font-medium text-gray-600 mt-1">{likes}</span>
          </div>
          
          <div className="flex flex-col items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggleComments();
              }}
              className="p-2.5 rounded-full text-gray-600 hover:text-gray-800"
            >
              <MessageCircle className="w-5 h-5" />
            </Button>
            <span className="text-xs font-medium text-gray-600 mt-1">{commentsCount}</span>
          </div>
          
          <div className="flex flex-col items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onShare();
              }}
              className="p-2.5 rounded-full text-gray-600 hover:text-gray-800"
            >
              <Send className="w-5 h-5" />
            </Button>
            <span className="text-xs font-medium text-gray-600 mt-1">0</span>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onSave(postId);
          }}
          className={`p-2.5 rounded-full ${isSaved ? 'text-gray-800' : 'text-gray-600'} hover:text-gray-800`}
        >
          <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
        </Button>
      </div>
    </div>
  );
};

export default PostCardActions;