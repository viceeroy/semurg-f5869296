
import { useState, useEffect } from "react";
import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EducationalPostCard from "./EducationalPostCard";
import LoadingSpinner from "./LoadingSpinner";
import { categories } from "./search/searchData";
import { useEducationalPosts } from "@/hooks/useEducationalPosts";
import { toast } from "sonner";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [generatingPost, setGeneratingPost] = useState(false);
  const { posts, loading, loadPosts, handleLike, handleComment, handleShare } = useEducationalPosts();

  useEffect(() => {
    loadPosts(searchQuery, selectedCategory === 'all' ? undefined : selectedCategory);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="max-w-md mx-auto px-4 py-6 pb-32">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Search</h1>
        <p className="text-gray-600">Discover amazing facts about nature</p>
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search for animals, plants, or interesting facts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 py-3 bg-white/80 backdrop-blur-sm border-gray-200 rounded-lg focus:ring-2 focus:ring-nature-green/20 focus:border-nature-green"
        />
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:bg-white/50 hover:backdrop-blur-sm ${
                selectedCategory === category.id
                  ? `${category.color} scale-110 shadow-lg`
                  : category.color
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {loading && <LoadingSpinner />}

      {/* More Facts Button */}
      <div className="mb-6 text-center">
        <Button
          onClick={async () => {
            try {
              setGeneratingPost(true);
              const response = await fetch(`https://mpmweyfstejwjesvgguh.supabase.co/functions/v1/generate-educational-post`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              
              const data = await response.json();
              
              if (data.success) {
                toast.success(data.message);
                // Reload posts to show the new one
                loadPosts(searchQuery, selectedCategory === 'all' ? undefined : selectedCategory);
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
          <Sparkles className="w-4 h-4 mr-2" />
          {generatingPost ? 'Generating...' : 'More interesting facts'}
        </Button>
      </div>

      {!loading && (
        <div className="space-y-4">
          {posts.map((post) => (
            <EducationalPostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
