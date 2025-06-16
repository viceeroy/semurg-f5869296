import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Comment } from "@/types/comment";

export const useEducationalPostComments = (postId: string, isOpen: boolean) => {
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

  return {
    comments,
    newComment,
    setNewComment,
    loading,
    submitting,
    handleSubmitComment,
    user
  };
};