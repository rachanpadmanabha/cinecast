import React from 'react';
import { Grid, List } from 'lucide-react';

interface CategoryFiltersProps {
  categories: string[];
  activeCategory: string;
  viewMode: 'grid' | 'list';
  onCategoryChange: (category: string) => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  categories,
  activeCategory,
  viewMode,
  onCategoryChange,
  onViewModeChange
}) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-6 py-3 rounded-2xl whitespace-nowrap transition-all font-semibold ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 shadow-xl shadow-cyan-500/30'
                : 'bg-white/5 hover:bg-white/10 border border-indigo-500/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
        <button
          onClick={() => onViewModeChange('grid')}
          className={`p-2 rounded-lg transition-all ${
            viewMode === 'grid' ? 'bg-gradient-to-r from-cyan-600 to-blue-600' : 'hover:bg-white/10'
          }`}
          title="Grid View"
        >
          <Grid className="w-5 h-5" />
        </button>
        <button
          onClick={() => onViewModeChange('list')}
          className={`p-2 rounded-lg transition-all ${
            viewMode === 'list' ? 'bg-gradient-to-r from-cyan-600 to-blue-600' : 'hover:bg-white/10'
          }`}
          title="List View"
        >
          <List className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CategoryFilters;

