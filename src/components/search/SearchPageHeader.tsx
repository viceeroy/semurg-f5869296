
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchPageHeaderProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
}

const SearchPageHeader = ({ searchQuery, onSearchQueryChange }: SearchPageHeaderProps) => {
  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Visual Search</h1>
        <p className="text-gray-600">Discover wildlife through images</p>
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <Input 
          type="text" 
          placeholder="Search wildlife, plants, or discoveries..." 
          value={searchQuery} 
          onChange={e => onSearchQueryChange(e.target.value)} 
          className="pl-10 py-3 bg-white/80 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 rounded-xl" 
        />
      </div>
    </>
  );
};

export default SearchPageHeader;
