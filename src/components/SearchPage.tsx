
import SearchPageHeader from "./search/SearchPageHeader";
import CategoryFilters from "./search/CategoryFilters";
import DidYouKnowFacts from "./search/DidYouKnowFacts";
import SearchResultsGrid from "./search/SearchResultsGrid";
import DetailedPostView from "./DetailedPostView";
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

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (searchQuery) {
      setSearchQuery("");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 pb-32">
      <SearchPageHeader 
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />
      
      <CategoryFilters 
        categories={categoryFilters}
        selectedCategory={selectedCategory}
        onCategoryClick={handleCategoryClick}
      />

      <DidYouKnowFacts />

      <SearchResultsGrid 
        filteredPosts={filteredPosts}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        categoryFilters={categoryFilters}
        loading={loading}
        onPostClick={handlePostClick}
      />

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
