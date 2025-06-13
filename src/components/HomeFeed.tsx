import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import FeedHeader from "./FeedHeader";
import PostList from "./PostList";
import DetailedPostView from "./DetailedPostView";
import { usePosts } from "@/hooks/usePosts";

const HomeFeed = () => {
  const { posts, loading, handleLike, handleSave, handleComment } = usePosts();
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const handleEdit = (postId: string) => {
    console.log('Edit post:', postId);
    // TODO: Implement edit functionality
  };

  const handleDelete = (postId: string) => {
    console.log('Delete post:', postId);
    // TODO: Implement delete functionality with confirmation
  };

  const handleInfo = (postId: string) => {
    console.log('Show info for post:', postId);
    // TODO: Implement info modal
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
          userNotes: '',
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
    </div>
  );
};

export default HomeFeed;