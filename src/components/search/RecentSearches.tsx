import { Search } from "lucide-react";

interface RecentSearchesProps {
  searches: string[];
}

const RecentSearches = ({ searches }: RecentSearchesProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Searches</h2>
      <div className="space-y-2">
        {searches.map((search, index) => (
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
  );
};

export default RecentSearches;