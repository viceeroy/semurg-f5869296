import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles: {
    username: string;
  };
}

interface PostCardCommentsProps {
  postId: string;
  comments: Comment[];
  showComments: boolean;
  newComment: string;
  onNewCommentChange: (value: string) => void;
  onComment: (postId: string, content: string) => void;
}

const PostCardComments = ({ 
  postId, 
  comments, 
  showComments, 
  newComment, 
  onNewCommentChange, 
  onComment 
}: PostCardCommentsProps) => {
  if (!showComments) return null;

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onComment(postId, newComment.trim());
      onNewCommentChange('');
    }
  };

  return (
    <div className="mt-4 pt-3 border-t border-gray-200 px-4 pb-20">
      <div className="space-y-2 mb-3">
        {comments.map((comment) => (
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
          onChange={(e) => onNewCommentChange(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSubmitComment();
            }
          }}
        />
        <Button 
          size="sm" 
          className="bg-emerald-600 hover:bg-emerald-700"
          onClick={(e) => {
            e.stopPropagation();
            handleSubmitComment();
          }}
        >
          <Share2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default PostCardComments;