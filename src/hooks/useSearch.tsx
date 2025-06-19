import { useState } from "react";
import { mockSearchPosts, SearchPost } from "@/data/mockSearchPosts";
import { DetailedPost } from "@/types/detailedPost";
import { useAuth } from "@/hooks/useAuth";

export const useSearch = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPost, setSelectedPost] = useState<DetailedPost | null>(null);
  const [loading, setLoading] = useState(false);

  // Filter posts based on search and category using mockSearchPosts
  const filteredPosts = mockSearchPosts.filter(post => {
    const matchesSearch = !searchQuery.trim() || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.scientific_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || 
      post.category?.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  const handlePostClick = (post: SearchPost) => {
    // Convert SearchPost to DetailedPost format
    const detailedPost: DetailedPost = {
      id: post.id,
      image: post.image_url,
      speciesName: post.title,
      scientificName: post.scientific_name,
      aiInfo: post.description,
      userNotes: '', // SearchPost doesn't have caption
      userName: post.profiles.username,
      userAvatar: post.profiles.avatar_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
      likes: 0, // Mock data doesn't have likes count
      isLiked: false,
      isSaved: false,
      tags: [`#${post.title.replace(/\s+/g, '')}`, `#${post.category}`],
      comments: [],
      userId: 'mock-user',
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