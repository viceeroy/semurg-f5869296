import { useState, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";

import PostList from "./PostList";
import DetailedPostView from "./DetailedPostView";
import EditCaptionModal from "./EditCaptionModal";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import PostInfoModal from "./PostInfoModal";
import { usePosts } from "@/hooks/usePosts";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const HomeFeed = () => {
  const { user } = useAuth();
  const { posts, loading, handleLike, handleSave, handleComment, handleEditPost, handleDeletePost } = usePosts();
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set());

  const editingPost = editingPostId ? posts.find(p => p.id === editingPostId) : null;

  // Fetch saved posts for current user
  useEffect(() => {
    const fetchSavedPosts = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('saved_posts')
          .select('post_id')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching saved posts:', error);
          return;
        }

        const savedIds = new Set(data?.map(item => item.post_id) || []);
        setSavedPostIds(savedIds);
      } catch (error) {
        console.error('Error fetching saved posts:', error);
      }
    };

    fetchSavedPosts();
  }, [user, posts]); // Re-fetch when posts change

  const handleEdit = (postId: string) => {
    setEditingPostId(postId);
    setEditModalOpen(true);
  };

  const handleSaveWithRefresh = async (postId: string) => {
    await handleSave(postId);
    // Refresh saved posts after saving/unsaving
    if (user) {
      try {
        const { data, error } = await supabase
          .from('saved_posts')
          .select('post_id')
          .eq('user_id', user.id);

        if (!error) {
          const savedIds = new Set(data?.map(item => item.post_id) || []);
          setSavedPostIds(savedIds);
        }
      } catch (error) {
        console.error('Error refreshing saved posts:', error);
      }
    }
  };

  const handleSaveEdit = async (caption: string, hashtags: string) => {
    if (editingPost) {
      await handleEditPost(editingPost.id, caption, hashtags);
      setEditModalOpen(false);
      setEditingPostId(null);
    }
  };

  const handleDelete = (postId: string) => {
    setEditingPostId(postId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (editingPost) {
      await handleDeletePost(editingPost.id);
      setDeleteDialogOpen(false);
      setEditingPostId(null);
      // Close detailed view if we're deleting the currently viewed post
      if (selectedPostId === editingPost.id) {
        setSelectedPostId(null);
      }
    }
  };

  const handleInfo = (postId: string) => {
    setEditingPostId(postId);
    setInfoModalOpen(true);
  };

  const selectedPost = selectedPostId ? posts.find(p => p.id === selectedPostId) : null;

  if (loading) {
    return <LoadingSpinner text="Loading posts..." />;
  }

  if (selectedPost) {
    return (
      <DetailedPostView
        post={{
          id: selectedPost.id,
          image: selectedPost.image_url,
          speciesName: selectedPost.title,
          aiInfo: selectedPost.description || '',
          userNotes: selectedPost.caption || '', // Use caption field for user notes
          userName: selectedPost.profiles?.username || 'Anonymous',
          userAvatar: selectedPost.profiles?.avatar_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
          likes: selectedPost.likes.length,
          isLiked: selectedPost.likes.some(like => like.user_id === user?.id),
          isSaved: savedPostIds.has(selectedPost.id),
          tags: [`#${selectedPost.title.replace(/\s+/g, '')}`, '#Wildlife'],
          comments: selectedPost.comments || [],
          uploadDate: selectedPost.created_at
        }}
        onClose={() => setSelectedPostId(null)}
        onLike={handleLike}
        onSave={handleSaveWithRefresh}
        onComment={handleComment}
        onShare={() => {}}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onInfo={handleInfo}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <PostList
        posts={posts.map(post => ({
          ...post,
          isSaved: savedPostIds.has(post.id)
        }))}
        onLike={handleLike}
        onSave={handleSaveWithRefresh}
        onComment={handleComment}
        onShare={() => {}}
        onPostClick={setSelectedPostId}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onInfo={handleInfo}
      />
      
      {/* Edit Caption Modal */}
      <EditCaptionModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingPostId(null);
        }}
        onSave={handleSaveEdit}
        currentCaption={editingPost?.caption || ''}
        currentHashtags={`#${editingPost?.title.replace(/\s+/g, '')} #Wildlife`}
        postTitle={editingPost?.title || ''}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setEditingPostId(null);
        }}
        onConfirm={handleConfirmDelete}
        postTitle={editingPost?.title || ''}
      />

      {/* Post Info Modal */}
      <PostInfoModal
        isOpen={infoModalOpen}
        onClose={() => {
          setInfoModalOpen(false);
          setEditingPostId(null);
        }}
        post={{
          id: editingPost?.id || '',
          title: editingPost?.title || '',
          userName: editingPost?.profiles?.username || 'Anonymous',
          userAvatar: editingPost?.profiles?.avatar_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
          uploadDate: editingPost?.created_at || '',
          aiSource: 'OpenAI Vision API'
        }}
      />
    </div>
  );
};

export default HomeFeed;