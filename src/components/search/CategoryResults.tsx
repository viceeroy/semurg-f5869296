import { SearchPost } from "@/data/mockSearchPosts";
import SearchResultCard from "../SearchResultCard";

interface Category {
  id: string;
  label: string;
  color: string;
}

interface CategoryResultsProps {
  searchQuery: string;
  selectedCategory: string;
  categories: Category[];
  searchResults: SearchPost[];
  onPostSelect: (post: SearchPost) => void;
}

const CategoryResults = ({ searchQuery, selectedCategory, categories, searchResults, onPostSelect }: CategoryResultsProps) => {
  if (searchQuery) return null;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        {selectedCategory === 'all' ? 'All Species' : categories.find(c => c.id === selectedCategory)?.label} ({searchResults.length})
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {searchResults.map((post) => (
          <SearchResultCard
            key={post.id}
            post={post}
            onClick={() => onPostSelect(post)}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryResults;