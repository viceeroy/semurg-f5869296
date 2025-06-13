import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import FeedHeader from "./FeedHeader";
import PostList from "./PostList";
import DetailedPostView from "./DetailedPostView";
import EditCaptionModal from "./EditCaptionModal";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import PostInfoModal from "./PostInfoModal";
import { usePosts } from "@/hooks/usePosts";
import { toast } from "sonner";

const HomeFeed = () => {
  const { posts, loading, handleLike, handleSave, handleComment, handleEditPost, handleDeletePost } = usePosts();
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  const editingPost = editingPostId ? posts.find(p => p.id === editingPostId) : null;

  const handleEdit = (postId: string) => {
    setEditingPostId(postId);
    setEditModalOpen(true);
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
          isLiked: selectedPost.likes.some(like => like.user_id === selectedPost.user_id),
          isSaved: false,
          tags: [`#${selectedPost.title.replace(/\s+/g, '')}`, '#Wildlife'],
          comments: selectedPost.comments || [],
          uploadDate: selectedPost.created_at
        }}
        onClose={() => setSelectedPostId(null)}
        onLike={handleLike}
        onSave={handleSave}
        onComment={handleComment}
        onShare={() => {}}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onInfo={handleInfo}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <FeedHeader />
      <PostList
        posts={posts}
        onLike={handleLike}
        onSave={handleSave}
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