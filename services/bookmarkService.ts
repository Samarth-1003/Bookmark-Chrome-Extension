import { Bookmark, Folder } from '../types';

// Declare chrome to avoid TypeScript errors when accessing extension APIs
declare const chrome: any;

// Mock data for development outside of extension environment
const MOCK_BOOKMARKS: Bookmark[] = [
  { id: '101', title: 'React Documentation', url: 'https://reactjs.org', category: 'Development', dateAdded: 1678880000000, parentId: '1' },
  { id: '102', title: 'Tailwind CSS', url: 'https://tailwindcss.com', category: 'Design', dateAdded: 1678890000000, parentId: '2' },
  { id: '103', title: 'Google Gemini', url: 'https://deepmind.google/technologies/gemini/', category: 'AI', dateAdded: 1678900000000, parentId: '1' },
];

const MOCK_FOLDERS: Folder[] = [
  { id: '1', title: 'Development' },
  { id: '2', title: 'Design' },
  { id: '3', title: 'AI' },
  { id: '4', title: 'General' } // Simulating Bookmarks Bar
];

export const isChromeExtension = (): boolean => {
  return typeof chrome !== 'undefined' && !!chrome.bookmarks;
};

// Recursive function to flatten the bookmark tree and extract folders
const processBookmarkNodes = (nodes: any[], foldersAcc: Folder[], currentCategory: string = 'General', currentFolderId: string = '1'): Bookmark[] => {
  let bookmarks: Bookmark[] = [];
  
  for (const node of nodes) {
    if (node.url) {
      // It's a bookmark
      bookmarks.push({
        id: node.id,
        title: node.title,
        url: node.url,
        dateAdded: node.dateAdded,
        category: currentCategory,
        parentId: node.parentId || currentFolderId
      });
    } else if (node.children) {
      // It's a folder
      // Skip the root '0' folder, but process '1' (Bar) and '2' (Other)
      const isRoot = node.id === '0';
      const folderName = node.title || 'General';
      
      // If it's a user-visible folder, add to folders list
      if (!isRoot) {
        foldersAcc.push({ id: node.id, title: folderName });
      }

      // Determine category name for children
      // If it's the Bookmarks Bar or Other Bookmarks, we might want to keep the generic category or use the folder name
      // For this app, let's use the folder name as the category
      bookmarks = bookmarks.concat(processBookmarkNodes(node.children, foldersAcc, folderName, node.id));
    }
  }
  return bookmarks;
};

export const getBookmarksData = (): Promise<{ bookmarks: Bookmark[], folders: Folder[] }> => {
  return new Promise((resolve) => {
    if (isChromeExtension()) {
      chrome.bookmarks.getTree((tree: any) => {
        const folders: Folder[] = [];
        const bookmarks = processBookmarkNodes(tree, folders);
        // Filter out duplicate folders if any
        const uniqueFolders = Array.from(new Map(folders.map(f => [f.id, f])).values());
        resolve({ bookmarks, folders: uniqueFolders });
      });
    } else {
      setTimeout(() => {
        resolve({ bookmarks: MOCK_BOOKMARKS, folders: MOCK_FOLDERS });
      }, 500);
    }
  });
};

export const searchBookmarks = (query: string, bookmarks: Bookmark[]): Bookmark[] => {
  const lowerQuery = query.toLowerCase();
  return bookmarks.filter(b => 
    b.title.toLowerCase().includes(lowerQuery) || 
    b.url.toLowerCase().includes(lowerQuery) ||
    b.category?.toLowerCase().includes(lowerQuery)
  );
};

export const openBookmark = (url: string) => {
  if (isChromeExtension()) {
    chrome.tabs.create({ url });
  } else {
    window.open(url, '_blank');
  }
};

export const deleteBookmark = (id: string): Promise<void> => {
  return new Promise((resolve) => {
    if (isChromeExtension()) {
      chrome.bookmarks.remove(id, () => resolve());
    } else {
      console.log('Mock delete bookmark', id);
      resolve();
    }
  });
};

export const moveBookmark = (id: string, parentId: string): Promise<void> => {
  return new Promise((resolve) => {
    if (isChromeExtension()) {
      chrome.bookmarks.move(id, { parentId }, () => resolve());
    } else {
      console.log('Mock move bookmark', id, 'to', parentId);
      resolve();
    }
  });
};

export const createFolder = (title: string): Promise<Folder | null> => {
  return new Promise((resolve) => {
    if (isChromeExtension()) {
      // Create in "Other Bookmarks" (id 2) by default, or "Bookmarks Bar" (id 1)
      // Usually '1' is the bar.
      chrome.bookmarks.create({ parentId: '1', title }, (node: any) => {
        resolve({ id: node.id, title: node.title });
      });
    } else {
      console.log('Mock create folder', title);
      resolve({ id: Math.random().toString(), title });
    }
  });
};