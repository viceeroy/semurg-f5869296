
import { useState, useEffect } from "react";
import { Search, Filter, Lightbulb } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DetailedPostView from "./DetailedPostView";
import LoadingSpinner from "./LoadingSpinner";
import OptimizedPostImage from "./OptimizedPostImage";
import { Post } from "@/types/post";
import { DetailedPost } from "@/types/detailedPost";
import { useAuth } from "@/hooks/useAuth";
import { useSearch } from "@/hooks/useSearch";

interface CategoryFilter {
  id: string;
  label: string;
  color: string;
}

const categoryFilters: CategoryFilter[] = [
  { id: "all", label: "All", color: "bg-gray-100 text-gray-800" },
  { id: "birds", label: "Birds", color: "bg-blue-100 text-blue-800" },
  { id: "mammals", label: "Mammals", color: "bg-orange-100 text-orange-800" },
  { id: "plants", label: "Plants", color: "bg-green-100 text-green-800" },
  { id: "reptiles", label: "Reptiles", color: "bg-yellow-100 text-yellow-800" },
  { id: "insects", label: "Insects", color: "bg-purple-100 text-purple-800" },
  { id: "fish", label: "Fish", color: "bg-cyan-100 text-cyan-800" }
];

interface SearchPageProps {
  searchData: ReturnType<typeof useSearch>;
}

const SearchPage = ({ searchData }: SearchPageProps) => {
  const {
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
  } = searchData;

  const [currentFact, setCurrentFact] = useState(0);

  const facts = [
    {
      title: "Arctic Fox",
      fact: "Arctic foxes can survive temperatures as low as -70°C (-94°F) thanks to their incredibly thick fur and compact body shape.",
      icon: "🦊"
    },
    {
      title: "Blue Whale", 
      fact: "A blue whale's heart alone can weigh as much as an automobile, and its tongue can weigh as much as an elephant.",
      icon: "🐋"
    },
    {
      title: "Monarch Butterfly",
      fact: "Monarch butterflies migrate up to 3,000 miles, using a combination of air currents and thermals to travel efficiently.",
      icon: "🦋"
    },
    {
      title: "Octopus",
      fact: "Octopuses have three hearts and blue blood. Two hearts pump blood to the gills, while the third pumps blood to the rest of the body.",
      icon: "🐙"
    },
    {
      title: "Hummingbird",
      fact: "Hummingbirds are the only birds that can fly backwards and upside down, beating their wings up to 80 times per second.",
      icon: "🦜"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % facts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [facts.length]);

  const getRandomHeight = (index: number) => {
    const heights = ['h-48', 'h-56', 'h-64', 'h-52', 'h-60'];
    return heights[index % heights.length];
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Clear search query when selecting a category to show category-based results
    if (searchQuery) {
      setSearchQuery("");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 pb-32">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Visual Search</h1>
        <p className="text-gray-600">Discover wildlife through images</p>
      </div>
      
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <Input 
          type="text" 
          placeholder="Search wildlife, plants, or discoveries..." 
          value={searchQuery} 
          onChange={e => setSearchQuery(e.target.value)} 
          className="pl-10 py-3 bg-white/80 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 rounded-xl" 
        />
      </div>

      {/* Category Filters */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Categories</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categoryFilters.map(category => (
            <button 
              key={category.id} 
              onClick={() => handleCategoryClick(category.id)} 
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 ${
                selectedCategory === category.id ? `${category.color} ring-2 ring-emerald-500/30` : category.color
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Did You Know Facts */}
      <div className="mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <span className="text-sm font-semibold text-emerald-700">Did You Know?</span>
        </div>
        <div className="transition-all duration-500 ease-in-out">
          <h3 className="font-semibold text-emerald-800 mb-1 flex items-center gap-2">
            <span className="text-lg">{facts[currentFact].icon}</span>
            {facts[currentFact].title}
          </h3>
          <p className="text-sm text-gray-700">{facts[currentFact].fact}</p>
        </div>
      </div>

      {/* Results Info */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          {searchQuery ? (
            `Found ${filteredPosts.length} results for "${searchQuery}"`
          ) : selectedCategory === "all" ? (
            `Showing ${filteredPosts.length} wildlife discoveries`
          ) : (
            `Showing ${filteredPosts.length} ${categoryFilters.find(c => c.id === selectedCategory)?.label?.toLowerCase() || 'results'}`
          )}
        </p>
      </div>

      {loading && <LoadingSpinner />}

      {!loading && (
        <>
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="animate-bounce">
                <Search className="w-8 h-8 mx-auto mb-3 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">No results found</p>
              <p className="text-sm text-gray-500 mt-2">
                {searchQuery ? "Try different keywords or browse all categories" : "Try selecting a different category or search for specific wildlife"}
              </p>
            </div>
          ) : (
            <div className="columns-2 gap-3 space-y-3">
              {filteredPosts.map((post, index) => (
                <div 
                  key={post.id} 
                  className="break-inside-avoid cursor-pointer group"
                  onClick={() => handlePostClick(post)}
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
                    <div className="relative">
                      <OptimizedPostImage 
                        src={post.image_url} 
                        alt={post.title || 'Wildlife discovery'} 
                        className={`${getRandomHeight(index)} group-hover:brightness-110 transition-all duration-300`}
                        width={400}
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                            {post.title || 'Wildlife Discovery'}
                          </h3>
                          <div className="flex items-center gap-2">
                            <img 
                              src={post.profiles?.avatar_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100'} 
                              alt={post.profiles?.username || 'User'} 
                              className="w-5 h-5 rounded-full border border-white/30"
                              loading="lazy"
                            />
                            <span className="text-white/90 text-xs">{post.profiles?.username || 'Anonymous'}</span>
                          </div>
                        </div>
                      </div>

                      {post.category && (
                        <div className="absolute top-2 right-2">
                          <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs px-2 py-1 rounded-full font-medium capitalize">
                            {post.category}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-3">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            ❤️ {post.likes?.length || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            💬 {post.comments?.length || 0}
                          </span>
                        </div>
                        <span>📍 Discovery</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {selectedPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <DetailedPostView
              post={selectedPost}
              onClose={handleCloseDetails}
              onLike={handleLike}
              onSave={handleSave}
              onComment={handleComment}
              onShare={handleShare}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onInfo={handleInfo}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
