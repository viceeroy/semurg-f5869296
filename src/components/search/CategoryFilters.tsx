
import { Filter } from "lucide-react";

interface CategoryFilter {
  id: string;
  label: string;
  color: string;
}

interface CategoryFiltersProps {
  categories: CategoryFilter[];
  selectedCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

const CategoryFilters = ({ categories, selectedCategory, onCategoryClick }: CategoryFiltersProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Categories</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button 
            key={category.id} 
            onClick={() => onCategoryClick(category.id)} 
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 ${
              selectedCategory === category.id ? `${category.color} ring-2 ring-emerald-500/30` : category.color
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilters;
