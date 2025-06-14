import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostEngagement from "./PostEngagement";
import PostComments from "./PostComments";
import AppHeader from "./AppHeader";
import { handleShare } from "@/utils/postUtils";
import { DetailedPost } from "@/types/detailedPost";

interface DetailedPostViewProps {
  post: DetailedPost;
  onClose: () => void;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  onShare: (postId: string) => void;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onInfo?: (postId: string) => void;
}

const DetailedPostView = ({ 
  post, 
  onClose, 
  onLike, 
  onSave, 
  onComment, 
  onShare, 
  onEdit, 
  onDelete, 
  onInfo 
}: DetailedPostViewProps) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleShareClick = () => {
    handleShare(post.speciesName, post.aiInfo, post.id, onShare);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const currentScrollY = container.scrollTop;
      const scrollingDown = currentScrollY > lastScrollY;
      const scrollingUp = currentScrollY < lastScrollY;

      console.log('DetailedView Scroll:', { currentScrollY, lastScrollY, scrollingDown, scrollingUp, headerVisible });

      if (scrollingDown && currentScrollY > 100) {
        setHeaderVisible(false);
        console.log('DetailedView: Hiding header');
      } else if (scrollingUp || currentScrollY <= 50) {
        setHeaderVisible(true);
        console.log('DetailedView: Showing header');
      }

      setLastScrollY(currentScrollY);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div className="fixed inset-0 bg-background z-40">
      <AppHeader isVisible={headerVisible} />
      <PostHeader
        onClose={onClose}
        onEdit={onEdit}
        onDelete={onDelete}
        onInfo={onInfo}
        postId={post.id}
        postUserId={post.userId}
      />

      {/* Scrollable Content */}
      <div 
        ref={scrollContainerRef}
        className="overflow-y-auto transition-all duration-300 ease-in-out"
        style={{ 
          height: 'calc(100vh - 60px)',
          paddingTop: headerVisible ? '64px' : '16px'
        }}
      >
        {/* Dominant Image */}
        <div className="w-full">
          <img
            src={post.image}
            alt={post.speciesName}
            className="w-full h-80 sm:h-96 object-cover"
          />
        </div>

        <PostContent post={post} />

        <PostComments
          postId={post.id}
          comments={post.comments}
          showComments={showComments}
          onComment={onComment}
        />

        <PostEngagement
          postId={post.id}
          likes={post.likes}
          isLiked={post.isLiked}
          isSaved={post.isSaved}
          commentsCount={post.comments.length}
          onLike={onLike}
          onSave={onSave}
          onShare={handleShareClick}
          onToggleComments={() => setShowComments(!showComments)}
        />
      </div>
    </div>
  );
};

export default DetailedPostView;