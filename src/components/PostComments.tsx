import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Comment } from "@/types/detailedPost";

interface PostCommentsProps {
  postId: string;
  comments: Comment[];
  showComments: boolean;
  onComment: (postId: string, content: string) => void;
}

const PostComments = ({ postId, comments, showComments, onComment }: PostCommentsProps) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onComment(postId, newComment.trim());
      setNewComment('');
    }
  };

  if (!showComments) return null;

  return (
    <div className="space-y-4 pt-4 border-t border-border px-6">
      <h4 className="font-semibold text-foreground">Comments</h4>
      <div className="space-y-3">
        {comments.map((comment) => (
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
            if (e.key === 'Enter') {
              handleSubmitComment();
            }
          }}
        />
        <Button 
          size="sm" 
          className="bg-primary hover:bg-primary/90"
          onClick={handleSubmitComment}
        >
          Post
        </Button>
      </div>
    </div>
  );
};

export default PostComments;