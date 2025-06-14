import { SearchPost } from "@/data/mockSearchPosts";
import SearchResultCard from "../SearchResultCard";

interface SearchResultsProps {
  searchQuery: string;
  searchResults: SearchPost[];
  showNoResults: boolean;
  onPostSelect: (post: SearchPost) => void;
}

const SearchResults = ({ searchQuery, searchResults, showNoResults, onPostSelect }: SearchResultsProps) => {
  if (!searchQuery) return null;

  return (
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
              onClick={() => onPostSelect(post)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;