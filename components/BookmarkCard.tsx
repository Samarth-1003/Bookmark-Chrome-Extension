import React from 'react';
import { Bookmark } from '../types';
import { openBookmark } from '../services/bookmarkService';

// Declare chrome for extension API access
declare const chrome: any;

interface BookmarkCardProps {
  bookmark: Bookmark;
}

const BookmarkCard: React.FC<BookmarkCardProps> = ({ bookmark }) => {
  // Extract domain for favicon
  const getFavicon = (url: string) => {
    // Check for Chrome Extension environment (MV3)
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
      // Use the _favicon helper available in MV3 with 'favicon' permission
      return chrome.runtime.getURL(`_favicon/?pageUrl=${encodeURIComponent(url)}&size=64`);
    }

    // Fallback for web preview
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch (e) {
      return '';
    }
  };

  return (
    <div 
      onClick={() => openBookmark(bookmark.url)}
      className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 cursor-pointer hover:bg-white/10 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:-translate-y-1 overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </div>

      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-pink-500/20 flex items-center justify-center border border-white/10 group-hover:border-white/30 transition-colors">
            <img 
              src={getFavicon(bookmark.url)} 
              alt="" 
              className="w-6 h-6 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-lg truncate pr-4 group-hover:text-pink-300 transition-colors">
            {bookmark.title || "Untitled"}
          </h3>
          <p className="text-white/40 text-sm truncate mt-1">
            {bookmark.url.replace(/^https?:\/\//, '')}
          </p>
          <div className="mt-3 flex items-center">
             <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-white/5 text-indigo-300 border border-indigo-500/20">
                {bookmark.category || 'General'}
             </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookmarkCard;