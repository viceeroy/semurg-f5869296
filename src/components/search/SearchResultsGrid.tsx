
import { Search } from "lucide-react";
import { memo } from "react";
import OptimizedPostImage from "../OptimizedPostImage";
import { Post } from "@/types/post";

interface SearchResultsGridProps {
  filteredPosts: Post[];
  searchQuery: string;
  selectedCategory: string;
  categoryFilters: Array<{ id: string; label: string; color: string }>;
  loading: boolean;
  onPostClick: (post: Post) => void;
}

// Memoized post card component
const PostCard = memo(({ post, index, onPostClick }: { 
  post: Post; 
  index: number; 
  onPostClick: (post: Post) => void;
}) => {
  const getRandomHeight = (index: number) => {
    const heights = ['h-48', 'h-56', 'h-64', 'h-52', 'h-60'];
    return heights[index % heights.length];
  };

  return (
    <div 
      className="break-inside-avoid cursor-pointer group"
      onClick={() => onPostClick(post)}
    >
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 group-hover:scale-[1.01]">
        <div className="relative">
          <OptimizedPostImage 
            src={post.image_url} 
            alt={post.title || 'Wildlife discovery'} 
            className={`${getRandomHeight(index)}`}
            width={320}
            priority={index < 4}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                {post.title || 'Wildlife Discovery'}
              </h3>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-white/20 border border-white/30"></div>
                <span className="text-white/90 text-xs">
                  {post.profiles?.username || 'Anonymous'}
                </span>
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
              <span>❤️ {post.likes?.length || 0}</span>
              <span>💬 {post.comments?.length || 0}</span>
            </div>
            <span>📍 Discovery</span>
          </div>
        </div>
      </div>
    </div>
  );
});

PostCard.displayName = 'PostCard';

const SearchResultsGrid = ({ 
  filteredPosts, 
  searchQuery, 
  selectedCategory, 
  categoryFilters, 
  loading, 
  onPostClick 
}: SearchResultsGridProps) => {
  return (
    <>
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

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
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
              {filteredPosts.slice(0, 20).map((post, index) => (
                <PostCard
                  key={post.id}
                  post={post}
                  index={index}
                  onPostClick={onPostClick}
                />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default memo(SearchResultsGrid);
