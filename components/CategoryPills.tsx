import React from 'react';
import { CategoryCount } from '../types';

interface CategoryPillsProps {
  categories: CategoryCount[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

const CategoryPills: React.FC<CategoryPillsProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      <button
        onClick={() => onSelectCategory('All')}
        className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${
          selectedCategory === 'All'
            ? 'bg-white text-purple-900 border-white shadow-[0_0_15px_rgba(255,255,255,0.5)]'
            : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/20 hover:border-white/30'
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.name}
          onClick={() => onSelectCategory(cat.name)}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 border backdrop-blur-sm ${
            selectedCategory === cat.name
              ? 'bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white border-transparent shadow-lg transform scale-105'
              : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:border-white/30'
          }`}
        >
          {cat.name}
          <span className={`ml-2 text-xs py-0.5 px-1.5 rounded-full ${
             selectedCategory === cat.name ? 'bg-white/20 text-white' : 'bg-black/20 text-white/50'
          }`}>
            {cat.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default CategoryPills;
