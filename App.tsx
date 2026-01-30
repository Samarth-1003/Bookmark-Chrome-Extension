import React, { useState, useEffect, useMemo } from 'react';
import { Bookmark, CategoryCount } from './types';
import { getBookmarks, searchBookmarks, isChromeExtension } from './services/bookmarkService';
import { categorizeBookmarksWithGemini } from './services/geminiService';
import SearchBar from './components/SearchBar';
import CategoryPills from './components/CategoryPills';
import BookmarkCard from './components/BookmarkCard';

const App: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [organizing, setOrganizing] = useState(false);
  const [isExtensionMode, setIsExtensionMode] = useState(false);

  // Load bookmarks on mount
  useEffect(() => {
    setIsExtensionMode(isChromeExtension());
    const fetchBookmarks = async () => {
      setLoading(true);
      const data = await getBookmarks();
      setBookmarks(data);
      setLoading(false);
    };
    fetchBookmarks();
  }, []);

  // Filter logic
  const filteredBookmarks = useMemo(() => {
    let result = bookmarks;

    if (searchQuery) {
      result = searchBookmarks(searchQuery, result);
    }

    if (selectedCategory !== 'All') {
      result = result.filter(b => b.category === selectedCategory);
    }

    return result;
  }, [bookmarks, searchQuery, selectedCategory]);

  // Extract categories dynamically
  const categories: CategoryCount[] = useMemo(() => {
    const counts: Record<string, number> = {};
    bookmarks.forEach(b => {
      const cat = b.category || 'Uncategorized';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count); // Sort by popularity
  }, [bookmarks]);

  // AI Organize Handler
  const handleSmartOrganize = async () => {
    if (!process.env.API_KEY) {
      alert("Please configure your Gemini API Key in the environment to use this feature.");
      return;
    }
    setOrganizing(true);
    const newCategoriesMap = await categorizeBookmarksWithGemini(bookmarks);
    
    // Update local state with new categories
    const updatedBookmarks = bookmarks.map(b => ({
      ...b,
      category: newCategoriesMap[b.id] || b.category
    }));

    setBookmarks(updatedBookmarks);
    setOrganizing(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white selection:bg-pink-500 selection:text-white flex flex-col">
      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-600/30 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-indigo-600/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-10 max-w-7xl flex-grow">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-12 text-center">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 mb-4 tracking-tight">
            Bookmark Cosmos
          </h1>
          <p className="text-white/60 text-lg max-w-lg mb-8">
            Organize your digital universe. Fast, beautiful, and intuitive.
          </p>

          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          {/* AI Button */}
          {process.env.API_KEY && (
            <button 
              onClick={handleSmartOrganize}
              disabled={organizing}
              className="flex items-center space-x-2 text-sm text-purple-300 hover:text-white transition-colors disabled:opacity-50 mb-6"
            >
              {organizing ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Gemini is thinking...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4V20M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span>Auto-Organize with AI</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Categories */}
        <CategoryPills 
          categories={categories} 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
        />

        {/* Grid Content */}
        {loading ? (
           <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
           </div>
        ) : (
          <>
            {filteredBookmarks.length === 0 ? (
              <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                <svg className="w-16 h-16 text-white/20 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-xl font-medium text-white/50">No bookmarks found</h3>
                <p className="text-white/30 mt-2">Try adjusting your search or category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                {filteredBookmarks.map((bm) => (
                  <BookmarkCard key={bm.id} bookmark={bm} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Environment Footer */}
      <footer className="relative z-10 py-4 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-black/20 backdrop-blur-md border border-white/5">
          <div className={`w-2 h-2 rounded-full ${isExtensionMode ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-amber-500'}`}></div>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-white/40">
            {isExtensionMode ? 'Extension Mode (Live Data)' : 'Preview Mode (Mock Data)'}
          </span>
        </div>
      </footer>
    </div>
  );
};

export default App;