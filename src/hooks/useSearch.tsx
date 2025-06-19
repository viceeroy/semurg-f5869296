import { useState, useMemo } from "react";
import { Post } from "@/types/post";
import { DetailedPost } from "@/types/detailedPost";
import { useAuth } from "@/hooks/useAuth";

interface UseSearchProps {
  posts?: Post[];
}

export const useSearch = (homePosts: Post[] = []) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPost, setSelectedPost] = useState<DetailedPost | null>(null);
  const [loading, setLoading] = useState(false);

  // Convert home posts to search format and filter based on search and category
  const filteredPosts = useMemo(() => {
    return homePosts.filter(post => {
      const matchesSearch = !searchQuery.trim() || 
        post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.scientific_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.caption?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || 
        post.category?.toLowerCase() === selectedCategory.toLowerCase();
      
      return matchesSearch && matchesCategory;
    });
  }, [homePosts, searchQuery, selectedCategory]);

  const handlePostClick = (post: Post) => {
    // Convert Post to DetailedPost format
    const detailedPost: DetailedPost = {
      id: post.id,
      image: post.image_url,
      speciesName: post.title,
      scientificName: post.scientific_name || '',
      aiInfo: post.description || '',
      userNotes: post.caption || '',
      userName: post.profiles?.username || 'Anonymous',
      userAvatar: post.profiles?.avatar_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
      likes: post.likes?.length || 0,
      isLiked: post.likes?.some(like => like.user_id === user?.id) || false,
      isSaved: false,
      tags: [`#${post.title?.replace(/\s+/g, '')}`, `#${post.category || 'Wildlife'}`],
      comments: post.comments || [],
      userId: post.user_id,
      uploadDate: post.created_at,
      characteristics: post.identification_notes ? [post.identification_notes] : undefined,
      habitat: post.habitat,
      diet: post.diet,
      behavior: post.behavior,
      conservationStatus: post.conservation_status,
      badge: undefined
    };
    setSelectedPost(detailedPost);
  };

  const handleLike = (postId: string) => {
    console.log('Like post:', postId);
  };

  const handleSave = (postId: string) => {
    console.log('Save post:', postId);
  };

  const handleComment = (postId: string, content: string) => {
    console.log('Comment on post:', postId, content);
  };

  const handleCloseDetails = () => {
    setSelectedPost(null);
  };

  const handleShare = (postId: string) => {
    console.log('Share post:', postId);
  };

  const handleEdit = (postId: string) => {
    console.log('Edit post:', postId);
  };

  const handleDelete = (postId: string) => {
    console.log('Delete post:', postId);
  };

  const handleInfo = (postId: string) => {
    console.log('Info for post:', postId);
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedPost,
    loading,
    filteredPosts,
    handlePostClick,
    handleLike,
    handleSave,
    handleComment,
    handleCloseDetails,
    handleShare,
    handleEdit,
    handleDelete,
    handleInfo
  };
};