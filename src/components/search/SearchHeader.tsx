import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchHeaderProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearch: () => void;
}

const SearchHeader = ({ searchQuery, onSearchQueryChange, onSearch }: SearchHeaderProps) => {
  return (
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
            onChange={(e) => onSearchQueryChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSearch();
              }
            }}
            className="pl-10 pr-12 glass-card border-gray-200 focus:border-nature-green"
          />
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={onSearch}
          >
            <Search className="w-4 h-4 text-gray-400" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;