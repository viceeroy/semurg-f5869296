import { useState, useEffect } from "react";
import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EducationalPostCard from "./EducationalPostCard";
import ExpandedPostView from "./ExpandedPostView";
import LoadingSpinner from "./LoadingSpinner";
import EducationalPostComments from "./EducationalPostComments";
import { categories } from "./search/searchData";
import { useEducationalPosts } from "@/hooks/useEducationalPosts";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { EducationalPost } from "@/services/educationalPostService";

const CollectionsPage = () => {
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
      const {
        data,
        error
      } = await supabase.functions.invoke('generate-species-info', {
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

  return (
    <div className="max-w-md mx-auto px-4 py-6 pb-32">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Educational Collection</h1>
        <p className="text-gray-600">Discover amazing facts about nature</p>
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <Input 
          type="text" 
          placeholder="Search for animals, plants, or interesting facts..." 
          value={searchQuery} 
          onChange={e => setSearchQuery(e.target.value)} 
          onKeyPress={e => e.key === 'Enter' && handleSpeciesSearch()} 
          className="pl-10 pr-14 py-3 bg-white/80 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-nature-green/20 focus:border-nature-green rounded-xl mx-0" 
        />
        {searchQuery.trim() && (
          <Button
            onClick={handleSpeciesSearch}
            disabled={searchingSpecies}
            size="icon"
            variant="ghost"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10 z-10 rounded-lg"
          >
            {searchingSpecies ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600" />
            ) : (
              <Search className="h-5 w-5 text-emerald-600 hover:scale-110 transition-transform duration-200" />
            )}
          </Button>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button 
              key={category.id} 
              onClick={() => setSelectedCategory(category.id)} 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:bg-white/50 hover:backdrop-blur-sm ${
                selectedCategory === category.id ? `${category.color} scale-110 shadow-lg` : category.color
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {(loading || isGeneratingFromNoResults) && <LoadingSpinner />}

      {isGeneratingFromNoResults && !loading && (
        <div className="text-center py-8">
          <div className="animate-pulse">
            <Sparkles className="w-8 h-8 mx-auto mb-3 text-emerald-600" />
            <p className="text-gray-600 font-medium">Generating content about "{searchQuery}"...</p>
            <p className="text-sm text-gray-500 mt-2">Creating educational information just for you!</p>
          </div>
        </div>
      )}

      {!loading && !isGeneratingFromNoResults && (
        <div className="space-y-4">
          {posts.length === 0 && hasSearched && searchQuery.trim() && (
            <div className="text-center py-8">
              <div className="animate-bounce">
                <Search className="w-8 h-8 mx-auto mb-3 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">No results found for "{searchQuery}"</p>
              <p className="text-sm text-gray-500 mt-2">Don't worry - we're generating content for you!</p>
            </div>
          )}
          
           {posts.map(post => (
             <EducationalPostCard 
               key={post.id} 
               post={post} 
               onLike={handleLike} 
               onComment={handleComment} 
               onShare={handleShare}
               onClick={() => handlePostClick(post)}
             />
           ))}
          
          {/* More Facts Button - placed after all posts */}
          <div className="pt-6 text-center">
            <Button 
              onClick={async () => {
                try {
                  setGeneratingPost(true);
                  const {
                    data,
                    error
                  } = await supabase.functions.invoke('generate-educational-post', {
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
              }} 
              disabled={generatingPost} 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Search className="w-4 h-4 mr-2" />
              {generatingPost ? 'Generating...' : 'More interesting facts'}
            </Button>
          </div>
        </div>
      )}

      {/* Expanded Post View */}
      {expandedPost && (
        <ExpandedPostView
          post={expandedPost}
          onClose={handleCloseExpanded}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
        />
      )}

      {/* Comments Modal */}
      {commentsOpen && (
        <EducationalPostComments
          postId={commentsOpen}
          isOpen={true}
          onClose={handleCloseComments}
        />
      )}
    </div>
  );
};

export default CollectionsPage;