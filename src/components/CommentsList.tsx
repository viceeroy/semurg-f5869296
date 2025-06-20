import { User, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import AvatarFallback from "./ui/avatar-fallback";
import { Comment } from "@/types/comment";

interface CommentsListProps {
  comments: Comment[];
  loading: boolean;
}

const CommentsList = ({ comments, loading }: CommentsListProps) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground mt-2">Loading comments...</p>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground">No comments yet</p>
        <p className="text-sm text-muted-foreground">Be the first to comment!</p>
      </div>
    );
  }

  return (
    <>
      {comments.map((comment) => (
        <motion.div 
          key={comment.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex space-x-3 py-2"
        >
          <div className="flex-shrink-0">
            <AvatarFallback
              src={comment.profiles?.avatar_url}
              name={comment.profiles?.username || 'User'}
              size="sm"
              alt={comment.profiles?.username || 'User'}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <p className="text-sm font-semibold text-foreground">
                {comment.profiles?.username || 'Anonymous'}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(comment.created_at).toLocaleDateString()}
              </p>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {comment.content}
            </p>
          </div>
        </motion.div>
      ))}
    </>
  );
};

export default CommentsList;