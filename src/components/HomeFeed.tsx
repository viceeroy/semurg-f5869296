import { useState, useEffect, useRef, Suspense, lazy } from "react";
import LoadingSpinner from "./LoadingSpinner";
import AppHeader from "./AppHeader";
import PostList from "./PostList";
import ErrorBoundary from "./ErrorBoundary";
import { useSimplePosts } from "@/hooks/useSimplePosts";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Lazy load heavy components
const DetailedPostView = lazy(() => import("./DetailedPostView"));
const EditCaptionModal = lazy(() => import("./EditCaptionModal"));
const DeleteConfirmDialog = lazy(() => import("./DeleteConfirmDialog"));
const PostInfoModal = lazy(() => import("./PostInfoModal"));

interface HomeFeedProps {
  postsData: ReturnType<typeof useSimplePosts>;
  onProfileClick?: () => void;
}

const HomeFeed = ({ postsData, onProfileClick }: HomeFeedProps) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { trackUserAction, trackApiCall, logPerformanceReport } = usePerformanceMonitor('HomeFeed');
  
  const { 
    posts, 
    loading, 
    refreshing, 
    loadingMore,
    hasMore,
    refreshPosts,
    loadMorePosts,
    handleLike, 
    handleSave, 
    handleComment, 
    handleEditPost, 
    handleDeletePost 
  } = postsData;

  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set());
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const currentY = useRef(0);
  
  // Performance optimized scroll restoration
  const savedScrollPosition = useRef<number>(0);
  const isRestoringScroll = useRef(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const editingPost = editingPostId ? posts.find(p => p.id === editingPostId) : null;

  // Helper function to get display name
  const getDisplayName = (profile: any) => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return profile?.username || 'Anonymous';
  };

  // Save scroll position before navigation
  const saveScrollPosition = () => {
    if (scrollContainerRef.current) {
      savedScrollPosition.current = scrollContainerRef.current.scrollTop;
      sessionStorage.setItem('feedScrollPosition', savedScrollPosition.current.toString());
    }
  };

  // Restore scroll position
  const restoreScrollPosition = () => {
    const savedPosition = sessionStorage.getItem('feedScrollPosition');
    if (savedPosition && scrollContainerRef.current && !isRestoringScroll.current) {
      isRestoringScroll.current = true;
      requestAnimationFrame(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = parseInt(savedPosition);
          setTimeout(() => {
            isRestoringScroll.current = false;
          }, 100);
        }
      });
    }
  };

  // Handle post click with scroll position saving
  const handlePostClick = (postId: string) => {
    saveScrollPosition();
    setSelectedPostId(postId);
  };

  // Handle close with scroll position restoration
  const handlePostClose = () => {
    setSelectedPostId(null);
    // Restore scroll position after component re-renders
    setTimeout(() => {
      restoreScrollPosition();
    }, 50);
  };

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

  // Restore scroll position when returning to feed
  useEffect(() => {
    if (!selectedPostId && !loading) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        restoreScrollPosition();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedPostId, loading]);

  // Save scroll position on scroll for other interactions
  useEffect(() => {
    const handleScroll = () => {
      if (!selectedPostId && scrollContainerRef.current && !isRestoringScroll.current) {
        savedScrollPosition.current = scrollContainerRef.current.scrollTop;
        sessionStorage.setItem('feedScrollPosition', savedScrollPosition.current.toString());
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [selectedPostId]);

  // Listen for share fallback events
  useEffect(() => {
    const handleShareFallback = (event: CustomEvent) => {
      toast.success(event.detail.message);
    };

    window.addEventListener('share-fallback', handleShareFallback as EventListener);
    return () => window.removeEventListener('share-fallback', handleShareFallback as EventListener);
  }, []);

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


  // Pull to refresh functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    if (scrollContainerRef.current?.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling || scrollContainerRef.current?.scrollTop !== 0) return;
    
    currentY.current = e.touches[0].clientY;
    const distance = Math.max(0, currentY.current - startY.current);
    setPullDistance(Math.min(distance, 100)); // Max pull distance of 100px
  };

  const handleTouchEnd = async () => {
    if (isPulling && pullDistance > 60) { // Trigger refresh if pulled more than 60px
      await refreshPosts(true);
      toast.success(t.feed.refreshFeed);
    }
    setIsPulling(false);
    setPullDistance(0);
  };

  // Enhanced error handling
  const handleError = (error: Error, context: string) => {
    console.error(`Error in ${context}:`, error);
    toast.error(`Something went wrong with ${context}. Please try again.`);
  };

  // Optimized refresh with error handling
  const handleRefreshClick = async () => {
    const endTracking = trackUserAction('manual-refresh');
    
    try {
      await refreshPosts(true);
      toast.success(t.feed.refreshFeed);
    } catch (error) {
      handleError(error as Error, 'refresh');
    } finally {
      endTracking();
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

  // Performance monitoring on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      logPerformanceReport();
    }, 5000);

    return () => clearTimeout(timer);
  }, [logPerformanceReport]);

  const selectedPost = selectedPostId ? posts.find(p => p.id === selectedPostId) : null;

  // Loading state handling
  if (loading) {
    return <LoadingSpinner text={t.feed.loadingFeed} />;
  }

  if (selectedPost) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-100">
          <AppHeader onRefresh={handleRefreshClick} refreshing={refreshing} onProfileClick={onProfileClick} />
          <Suspense fallback={<LoadingSpinner />}>
            <DetailedPostView
        post={{
          id: selectedPost.id,
          image: selectedPost.image_url,
          speciesName: selectedPost.title,
          scientificName: selectedPost.scientific_name,
          aiInfo: selectedPost.description || '',
          userNotes: selectedPost.caption || '', // Use caption field for user notes
          userName: getDisplayName(selectedPost.profiles),
          userAvatar: selectedPost.profiles?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
          userId: selectedPost.user_id,
          likes: selectedPost.likes.length,
          isLiked: selectedPost.likes.some(like => like.user_id === user?.id),
          isSaved: savedPostIds.has(selectedPost.id),
          tags: [`#${selectedPost.title.replace(/\s+/g, '')}`, selectedPost.category ? `#${selectedPost.category}` : '#Wildlife'],
          comments: selectedPost.comments || [],
          uploadDate: selectedPost.created_at,
          characteristics: selectedPost.identification_notes ? [selectedPost.identification_notes] : undefined,
          habitat: selectedPost.habitat,
          diet: selectedPost.diet,
          behavior: selectedPost.behavior,
          conservationStatus: selectedPost.conservation_status,
          badge: selectedPost.confidence ? `${selectedPost.confidence.charAt(0).toUpperCase() + selectedPost.confidence.slice(1)} Confidence` : undefined
        }}
        onClose={handlePostClose}
        onLike={handleLike}
        onSave={handleSaveWithRefresh}
        onComment={handleComment}
        onShare={() => {}}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onInfo={handleInfo}
        />
          </Suspense>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100">
        <AppHeader onRefresh={handleRefreshClick} refreshing={refreshing} onProfileClick={onProfileClick} />
        
        {/* Pull to refresh indicator */}
        {isPulling && (
          <div 
            className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white px-4 py-2 rounded-full text-sm z-30 transition-all duration-200"
            style={{ transform: `translate(-50%, ${Math.min(pullDistance - 20, 40)}px)` }}
          >
            {pullDistance > 60 ? t.common.loading : t.feed.pullToRefresh}
          </div>
        )}
        
        <div 
          ref={scrollContainerRef}
          className="overflow-auto"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ 
            height: '100vh', 
            paddingTop: isPulling ? `${Math.min(pullDistance * 0.5, 50)}px` : '0',
            transition: isPulling ? 'none' : 'padding-top 0.3s ease-out'
          }}
        >
          <PostList
            posts={posts.map(post => ({
              ...post,
              isSaved: savedPostIds.has(post.id)
            }))}
            onLike={handleLike}
            onSave={handleSaveWithRefresh}
            onComment={handleComment}
            onShare={() => {}}
            onPostClick={handlePostClick}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onInfo={handleInfo}
            loadingMore={loadingMore}
            hasMore={hasMore}
            onLoadMore={loadMorePosts}
          />
        </div>
        
        {/* Lazy loaded modals */}
        <Suspense fallback={null}>
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

          <DeleteConfirmDialog
            isOpen={deleteDialogOpen}
            onClose={() => {
              setDeleteDialogOpen(false);
              setEditingPostId(null);
            }}
            onConfirm={handleConfirmDelete}
            postTitle={editingPost?.title || ''}
          />

          <PostInfoModal
            isOpen={infoModalOpen}
            onClose={() => {
              setInfoModalOpen(false);
              setEditingPostId(null);
            }}
            post={{
              id: editingPost?.id || '',
              title: editingPost?.title || '',
              userName: getDisplayName(editingPost?.profiles),
              userAvatar: editingPost?.profiles?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
              uploadDate: editingPost?.created_at || '',
              aiSource: 'OpenAI Vision API'
            }}
          />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};

export default HomeFeed;
