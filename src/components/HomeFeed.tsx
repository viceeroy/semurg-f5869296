import LoadingSpinner from "./LoadingSpinner";
import FeedHeader from "./FeedHeader";
import PostList from "./PostList";
import { usePosts } from "@/hooks/usePosts";

const HomeFeed = () => {
  const { posts, loading, handleLike, handleSave, handleComment } = usePosts();

  if (loading) {
    return <LoadingSpinner text="Loading posts..." />;
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
      />
    </div>
  );
};

export default HomeFeed;