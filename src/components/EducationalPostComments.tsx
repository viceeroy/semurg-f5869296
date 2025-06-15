import { useState, useEffect } from "react";
import { Send, MessageCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles?: {
    username: string;
    avatar_url?: string;
  };
}

interface EducationalPostCommentsProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
}

const EducationalPostComments = ({ postId, isOpen, onClose }: EducationalPostCommentsProps) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadComments();
    }
  }, [postId, isOpen]);

  const loadComments = async () => {
    setLoading(true);
    try {
      // First get comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('educational_post_comments')
        .select('id, content, created_at, user_id')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;

      // Then get profile info for each comment
      const commentsWithProfiles = await Promise.all(
        (commentsData || []).map(async (comment) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', comment.user_id)
            .single();

          return {
            ...comment,
            profiles: profile || { username: 'Anonymous', avatar_url: null }
          };
        })
      );

      setComments(commentsWithProfiles);
    } catch (error) {
      console.error('Error loading comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!user) {
      toast.error('Please sign in to comment');
      return;
    }

    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('educational_post_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content: newComment.trim()
        })
        .select('id, content, created_at, user_id')
        .single();

      if (error) throw error;
      
      // Get profile info for the new comment
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.id)
        .single();

      const newCommentWithProfile = {
        ...data,
        profiles: profile || { username: 'Anonymous', avatar_url: null }
      };
      
      setComments(prev => [...prev, newCommentWithProfile]);
      setNewComment("");
      toast.success('Comment added!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
      <div className="w-full max-w-md mx-auto bg-background rounded-t-3xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Comments</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading comments...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No comments yet</p>
              <p className="text-sm text-muted-foreground">Be the first to comment!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <div className="flex-shrink-0">
                  {comment.profiles?.avatar_url ? (
                    <img
                      src={comment.profiles.avatar_url}
                      alt={comment.profiles.username || 'User'}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm font-medium text-foreground">
                      {comment.profiles?.username || 'Anonymous'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment Input */}
        {user ? (
          <div className="p-4 border-t border-border">
            <div className="flex space-x-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 min-h-[40px] max-h-[100px] resize-none"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitComment();
                  }
                }}
              />
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || submitting}
                size="icon"
                className="flex-shrink-0"
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-background"></div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-4 border-t border-border text-center">
            <p className="text-muted-foreground">Please sign in to comment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationalPostComments;