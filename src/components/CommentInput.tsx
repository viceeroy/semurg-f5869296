import { Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { User as AuthUser } from '@supabase/supabase-js';

interface CommentInputProps {
  user: AuthUser | null;
  newComment: string;
  setNewComment: (value: string) => void;
  submitting: boolean;
  onSubmit: () => void;
}

const CommentInput = ({ 
  user, 
  newComment, 
  setNewComment, 
  submitting, 
  onSubmit 
}: CommentInputProps) => {
  if (!user) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">Please sign in to comment</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <User className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
        <div className="flex-1 flex space-x-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 min-h-[40px] max-h-[80px] resize-none border-0 bg-secondary/50 focus:bg-secondary rounded-2xl px-4 py-2"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSubmit();
              }
            }}
          />
          <Button
            onClick={onSubmit}
            disabled={!newComment.trim() || submitting}
            size="icon"
            className="flex-shrink-0 rounded-full h-10 w-10"
            variant={newComment.trim() ? "default" : "ghost"}
          >
            {submitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-background"></div>
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentInput;