import React, { useState } from 'react';
import { CategoryCount } from '../types';

interface CategoryPillsProps {
  categories: CategoryCount[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onCreateFolder: (name: string) => void;
}

const CategoryPills: React.FC<CategoryPillsProps> = ({ categories, selectedCategory, onSelectCategory, onCreateFolder }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName('');
      setIsCreating(false);
    }
  };

  return (
    <div className="flex flex-wrap justify-center items-center gap-3 mb-8">
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

      {/* Add Folder Button */}
      {isCreating ? (
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            autoFocus
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder name..."
            className="w-32 px-3 py-2 rounded-l-full bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:bg-white/20"
            onBlur={() => !newFolderName && setIsCreating(false)}
          />
          <button 
            type="submit"
            className="px-3 py-2 rounded-r-full bg-green-500/80 hover:bg-green-500 text-white text-sm font-bold border-y border-r border-white/20"
          >
            ✓
          </button>
        </form>
      ) : (
        <button
          onClick={() => setIsCreating(true)}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/20 transition-all"
          title="Create new folder"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default CategoryPills;