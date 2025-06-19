import { useState, useEffect } from "react";
import { useEducationalPosts } from "@/hooks/useEducationalPosts";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { EducationalPost } from "@/services/educationalPostService";

export const useCollections = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [generatingPost, setGeneratingPost] = useState(false);
  const [searchingSpecies, setSearchingSpecies] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isGeneratingFromNoResults, setIsGeneratingFromNoResults] = useState(false);
  const [expandedPost, setExpandedPost] = useState<EducationalPost | null>(null);
  
  const {
    posts,
    loading,
    loadPosts,
    handleLike,
    handleComment,
    handleShare,
    commentsOpen,
    handleCloseComments
  } = useEducationalPosts();

  const handlePostClick = (post: EducationalPost) => {
    setExpandedPost(post);
  };

  const handleCloseExpanded = () => {
    setExpandedPost(null);
  };

  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim()) {
        await loadPosts(searchQuery, selectedCategory === 'all' ? undefined : selectedCategory, language);
        setHasSearched(true);
      } else {
        await loadPosts(undefined, selectedCategory === 'all' ? undefined : selectedCategory, language);
        setHasSearched(false);
      }
    };
    
    performSearch();
  }, [searchQuery, selectedCategory, language]);

  // Auto-generate content when no results found
  useEffect(() => {
    const shouldAutoGenerate = hasSearched && 
                               searchQuery.trim() && 
                               !loading && 
                               posts.length === 0 && 
                               !isGeneratingFromNoResults;
    
    if (shouldAutoGenerate) {
      handleAutoGenerateContent();
    }
  }, [hasSearched, searchQuery, loading, posts.length, isGeneratingFromNoResults]);

  const handleAutoGenerateContent = async () => {
    if (!searchQuery.trim()) return;
    
    setIsGeneratingFromNoResults(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-species-info', {
        body: {
          speciesName: searchQuery
        }
      });
      
      if (error) {
        console.error('Error generating content:', error);
      } else if (data?.success) {
        toast.success(`Generated new content about ${searchQuery}!`);
        // Reload posts to show the new content
        await loadPosts(searchQuery, selectedCategory === 'all' ? undefined : selectedCategory, language);
      }
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGeneratingFromNoResults(false);
    }
  };

  const handleSpeciesSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearchingSpecies(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-species-info', {
        body: {
          speciesName: searchQuery
        }
      });
      if (error) {
        console.error('Error searching species:', error);
        toast.error('Failed to find species information');
      } else if (data?.success) {
        toast.success('Species information found!');
        // Reload posts to show the new species info
        loadPosts(searchQuery, selectedCategory === 'all' ? undefined : selectedCategory, language);
      } else {
        toast.error('No information found for this species');
      }
    } catch (error) {
      console.error('Error searching species:', error);
      toast.error('Failed to search species');
    } finally {
      setSearchingSpecies(false);
    }
  };

  const handleGenerateMoreFacts = async () => {
    try {
      setGeneratingPost(true);
      const { data, error } = await supabase.functions.invoke('generate-educational-post', {
        body: { 
          language: language === 'uz' ? 'uzbek' : 'english',
          count: 12
        }
      });
      if (error) {
        console.error('Error generating post:', error);
        toast.error('Failed to generate new post');
      } else if (data?.success) {
        toast.success(data.message);
        // Reload posts to show the new one
        loadPosts(searchQuery, selectedCategory === 'all' ? undefined : selectedCategory, language);
      } else {
        toast.error('Failed to generate new post');
      }
    } catch (error) {
      console.error('Error generating post:', error);
      toast.error('Failed to generate new post');
    } finally {
      setGeneratingPost(false);
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    generatingPost,
    searchingSpecies,
    hasSearched,
    isGeneratingFromNoResults,
    expandedPost,
    posts,
    loading,
    commentsOpen,
    handlePostClick,
    handleCloseExpanded,
    handleSpeciesSearch,
    handleGenerateMoreFacts,
    handleLike,
    handleComment,
    handleShare,
    handleCloseComments
  };
};