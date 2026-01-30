import React, { useState } from 'react';
import { Bookmark, Folder } from '../types';
import { openBookmark } from '../services/bookmarkService';

// Declare chrome for extension API access
declare const chrome: any;

interface BookmarkCardProps {
  bookmark: Bookmark;
  folders: Folder[];
  onDelete: (id: string) => void;
  onMove: (bookmarkId: string, folderId: string) => void;
}

const BookmarkCard: React.FC<BookmarkCardProps> = ({ bookmark, folders, onDelete, onMove }) => {
  const [showMoveMenu, setShowMoveMenu] = useState(false);

  // Extract domain for favicon
  const getFavicon = (url: string) => {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
      return chrome.runtime.getURL(`_favicon/?pageUrl=${encodeURIComponent(url)}&size=64`);
    }
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch (e) {
      return '';
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${bookmark.title}"?`)) {
      onDelete(bookmark.id);
    }
  };

  const handleMoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMoveMenu(!showMoveMenu);
  };

  const handleSelectFolder = (e: React.MouseEvent, folderId: string) => {
    e.stopPropagation();
    onMove(bookmark.id, folderId);
    setShowMoveMenu(false);
  };

  return (
    <div 
      className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 cursor-pointer hover:bg-white/10 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:-translate-y-1 overflow-visible"
      onClick={() => openBookmark(bookmark.url)}
    >
      {/* Action Buttons (Visible on Hover) */}
      <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        
        {/* Move Button */}
        <div className="relative">
          <button 
            onClick={handleMoveClick}
            className="p-2 bg-black/40 hover:bg-indigo-600 rounded-full text-white/70 hover:text-white transition-colors backdrop-blur-sm"
            title="Move to folder"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>
          
          {/* Dropdown Menu */}
          {showMoveMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 max-h-60 overflow-y-auto bg-slate-800 border border-white/10 rounded-xl shadow-2xl z-30">
               <div className="p-2 text-xs text-white/50 uppercase font-bold tracking-wider sticky top-0 bg-slate-800">Move to...</div>
               {folders.map(f => (
                 <button
                   key={f.id}
                   onClick={(e) => handleSelectFolder(e, f.id)}
                   className={`w-full text-left px-3 py-2 text-sm hover:bg-white/10 truncate transition-colors ${bookmark.parentId === f.id ? 'text-indigo-400 font-medium' : 'text-white/80'}`}
                 >
                   {bookmark.parentId === f.id && "✓ "}
                   {f.title}
                 </button>
               ))}
            </div>
          )}
        </div>

        {/* Delete Button */}
        <button 
          onClick={handleDelete}
          className="p-2 bg-black/40 hover:bg-red-500 rounded-full text-white/70 hover:text-white transition-colors backdrop-blur-sm"
          title="Delete bookmark"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
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
             <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-white/5 text-indigo-300 border border-indigo-500/20 truncate max-w-[150px]">
                {bookmark.category || 'General'}
             </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookmarkCard;