
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { mockSearchPosts, categorizedPosts, SearchPost } from "@/data/mockSearchPosts";
import SearchResultCard from "./SearchResultCard";
import SearchResultDetailModal from "./SearchResultDetailModal";
import { useToast } from "@/hooks/use-toast";

const SearchPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchResults, setSearchResults] = useState<SearchPost[]>(mockSearchPosts);
  const [selectedPost, setSelectedPost] = useState<SearchPost | null>(null);
  const [showNoResults, setShowNoResults] = useState(false);

  const categories = [
    { id: "all", label: "All", color: "bg-gray-100 text-gray-700" },
    { id: "birds", label: "Birds", color: "bg-blue-100 text-blue-700" },
    { id: "mammals", label: "Mammals", color: "bg-orange-100 text-orange-700" },
    { id: "insects", label: "Insects", color: "bg-green-100 text-green-700" },
    { id: "plants", label: "Plants", color: "bg-emerald-100 text-emerald-700" },
    { id: "reptiles", label: "Reptiles", color: "bg-yellow-100 text-yellow-700" },
  ];

  const recentSearches = [
    "Northern Red Cardinal",
    "White Oak Tree",
    "Eastern Gray Squirrel",
    "White-tailed Deer",
    "Great Blue Heron",
    "Wild Sunflower",
    "Red-winged Blackbird",
    "American Robin"
  ];

  const trendingSpecies = [
    { name: "Northern Cardinal", count: "1,247 posts" },
    { name: "White Oak Tree", count: "1,156 posts" },
    { name: "Blue Jay", count: "987 posts" },
    { name: "Red-tailed Hawk", count: "854 posts" },
    { name: "White-tailed Deer", count: "723 posts" },
    { name: "Wild Rose", count: "698 posts" },
    { name: "Eastern Gray Squirrel", count: "634 posts" },
    { name: "American Robin", count: "567 posts" },
    { name: "Black Bear", count: "523 posts" },
    { name: "Purple Coneflower", count: "489 posts" }
  ];

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults(categorizedPosts[selectedCategory as keyof typeof categorizedPosts]);
      setShowNoResults(false);
      return;
    }

    // Search across all categories if "all" is selected, otherwise search within selected category
    const searchData = selectedCategory === 'all' ? mockSearchPosts : categorizedPosts[selectedCategory as keyof typeof categorizedPosts];
    
    const filtered = searchData.filter(post =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.scientific_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-4">Search</h1>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search species, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-12 glass-card border-gray-200 focus:border-nature-green"
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={handleSearch}
            >
              <Search className="w-4 h-4 text-gray-400" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 pb-24">
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? "bg-nature-green text-white shadow-md"
                    : category.color
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Searches */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Searches</h2>
          <div className="space-y-2">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                className="flex items-center w-full p-3 glass-card rounded-lg text-left hover:bg-white/80 transition-colors duration-200"
              >
                <Search className="w-4 h-4 text-gray-400 mr-3" />
                <span className="text-gray-700">{search}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Search Results {searchResults.length > 0 && `(${searchResults.length})`}
            </h2>
            {showNoResults ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No results found for "{searchQuery}"</p>
                <p className="text-sm text-gray-500 mt-2">Try searching for different keywords or browse categories above</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {searchResults.map((post) => (
                  <SearchResultCard
                    key={post.id}
                    post={post}
                    onClick={() => setSelectedPost(post)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Category Results */}
        {!searchQuery && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedCategory === 'all' ? 'All Species' : categories.find(c => c.id === selectedCategory)?.label} ({searchResults.length})
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {searchResults.map((post) => (
                <SearchResultCard
                  key={post.id}
                  post={post}
                  onClick={() => setSelectedPost(post)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Trending */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Trending Species</h2>
          <div className="space-y-3">
            {trendingSpecies.map((species, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 glass-card rounded-lg hover:bg-white/80 transition-colors duration-200 cursor-pointer"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{species.name}</h3>
                  <p className="text-sm text-gray-600">{species.count}</p>
                </div>
                <div className="w-8 h-8 bg-nature-green/20 rounded-full flex items-center justify-center">
                  <span className="text-nature-green font-bold text-sm">#{index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SearchResultDetailModal
        post={selectedPost}
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </div>
  );
};

export default SearchPage;
