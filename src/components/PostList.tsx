
import { useEffect, useRef } from "react";
import PostCard from "./PostCard";
import { useAuth } from "@/hooks/useAuth";
import { Post } from "@/types/post";

interface PostWithSaved extends Post {
  isSaved?: boolean;
}

interface PostListProps {
  posts: PostWithSaved[];
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  onShare: (postId: string) => void;
  onPostClick?: (postId: string) => void;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onInfo?: (postId: string) => void;
  onPostView?: () => void; // New prop for tracking post views
}

const PostList = ({ 
  posts, 
  onLike, 
  onSave, 
  onComment, 
  onShare, 
  onPostClick, 
  onEdit, 
  onDelete, 
  onInfo,
  onPostView 
}: PostListProps) => {
  const { user } = useAuth();
  const observedPosts = useRef(new Set<string>());

  // Helper function to get display name
  const getDisplayName = (profile: any) => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return profile?.username || 'Anonymous';
  };

  // Set up intersection observer to track when posts come into view
  useEffect(() => {
    if (!onPostView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const postId = entry.target.getAttribute('data-post-id');
            if (postId && !observedPosts.current.has(postId)) {
              observedPosts.current.add(postId);
              onPostView();
            }
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% of the post is visible
    );

    // Observe all post elements
    const postElements = document.querySelectorAll('[data-post-id]');
    postElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [posts.length, onPostView]);

  return (
    <div className="max-w-md mx-auto px-4 py-6 pb-32">
      {posts.map((post) => (
        <div key={post.id} data-post-id={post.id}>
          <PostCard
            post={{
              id: post.id,
              image: post.image_url,
              speciesName: post.title,
              aiInfo: (post.description || '').length > 120 ? 
                (post.description || '').substring(0, 120) + '...' : 
                (post.description || ''), // Show abbreviated description in feed
              userNotes: post.caption || '', // Use caption field for user notes
              userName: getDisplayName(post.profiles),
              userAvatar: post.profiles?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
              likes: post.likes.length,
              isLiked: post.likes.some(like => like.user_id === user?.id),
              isSaved: post.isSaved || false, // Use the passed isSaved value or default to false
              tags: [`#${post.title.replace(/\s+/g, '')}`, post.category ? `#${post.category}` : '#Wildlife'],
              comments: post.comments || [],
              userId: post.user_id // Pass the actual user_id
            }}
            onLike={onLike}
            onSave={onSave}
            onComment={onComment}
            onShare={onShare}
            onPostClick={onPostClick}
            onEdit={onEdit}
            onDelete={onDelete}
            onInfo={onInfo}
          />
        </div>
      ))}
    </div>
  );
};

export default PostList;
