import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto mb-8 group">
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full blur opacity-40 group-hover:opacity-60 transition duration-300"></div>
      <div className="relative flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-3 shadow-lg">
        <svg 
          className="w-5 h-5 text-white/70 ml-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search your universe..."
          className="w-full bg-transparent border-none text-white placeholder-white/50 focus:ring-0 focus:outline-none px-4 text-lg"
        />
        {value && (
          <button 
            onClick={() => onChange('')}
            className="text-white/50 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
