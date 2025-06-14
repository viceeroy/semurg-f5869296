
import { SearchPost } from "@/data/mockSearchPosts";
import SearchResultDetailModal from "./SearchResultDetailModal";
import SearchHeader from "./search/SearchHeader";
import CategoryFilter from "./search/CategoryFilter";
import RecentSearches from "./search/RecentSearches";
import SearchResults from "./search/SearchResults";
import CategoryResults from "./search/CategoryResults";
import TrendingSpecies from "./search/TrendingSpecies";
import { useSearch } from "@/hooks/useSearch";
import { categories, recentSearches, trendingSpecies } from "./search/searchData";

const SearchPage = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    searchResults,
    selectedPost,
    setSelectedPost,
    showNoResults,
    handleSearch,
    handleCategoryChange
  } = useSearch();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <SearchHeader
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSearch={handleSearch}
      />

      <div className="max-w-md mx-auto px-4 py-6 pb-24">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        <RecentSearches searches={recentSearches} />

        <SearchResults
          searchQuery={searchQuery}
          searchResults={searchResults}
          showNoResults={showNoResults}
          onPostSelect={setSelectedPost}
        />

        <CategoryResults
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          categories={categories}
          searchResults={searchResults}
          onPostSelect={setSelectedPost}
        />

        <TrendingSpecies species={trendingSpecies} />
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
