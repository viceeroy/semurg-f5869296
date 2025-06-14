import { useState } from "react";
import { mockSearchPosts, categorizedPosts, SearchPost } from "@/data/mockSearchPosts";
import { useToast } from "@/hooks/use-toast";

export const useSearch = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchResults, setSearchResults] = useState<SearchPost[]>(mockSearchPosts);
  const [selectedPost, setSelectedPost] = useState<SearchPost | null>(null);
  const [showNoResults, setShowNoResults] = useState(false);

  const handleSearch = () => {
    console.log('Search triggered with query:', searchQuery);
    console.log('Selected category:', selectedCategory);
    
    if (!searchQuery.trim()) {
      console.log('Empty search query, showing category results');
      setSearchResults(categorizedPosts[selectedCategory as keyof typeof categorizedPosts]);
      setShowNoResults(false);
      return;
    }

    // Search across all categories if "all" is selected, otherwise search within selected category
    const searchData = selectedCategory === 'all' ? mockSearchPosts : categorizedPosts[selectedCategory as keyof typeof categorizedPosts];
    console.log('Search data source:', searchData.length, 'posts');
    
    const filtered = searchData.filter(post =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.scientific_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    console.log('Filtered results:', filtered.length, 'posts found');
    console.log('First few results:', filtered.slice(0, 3).map(p => p.title));

    setSearchResults(filtered);
    setShowNoResults(filtered.length === 0);
    
    // Show toast notification if no results found
    if (filtered.length === 0) {
      toast({
        title: "No results found",
        description: `No animals found matching "${searchQuery}". Try different keywords or browse categories.`,
        variant: "destructive"
      });
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery("");
    setSearchResults(categorizedPosts[category as keyof typeof categorizedPosts]);
    setShowNoResults(false);
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    searchResults,
    selectedPost,
    setSelectedPost,
    showNoResults,
    handleSearch,
    handleCategoryChange
  };
};