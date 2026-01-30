import { Bookmark } from '../types';

// Declare chrome to avoid TypeScript errors when accessing extension APIs
declare const chrome: any;

// Mock data for development outside of extension environment
const MOCK_BOOKMARKS: Bookmark[] = [
  { id: '1', title: 'React Documentation', url: 'https://reactjs.org', category: 'Development', dateAdded: 1678880000000 },
  { id: '2', title: 'Tailwind CSS', url: 'https://tailwindcss.com', category: 'Design', dateAdded: 1678890000000 },
  { id: '3', title: 'Google Gemini', url: 'https://deepmind.google/technologies/gemini/', category: 'AI', dateAdded: 1678900000000 },
  { id: '4', title: 'GitHub', url: 'https://github.com', category: 'Development', dateAdded: 1678910000000 },
  { id: '5', title: 'Dribbble', url: 'https://dribbble.com', category: 'Design', dateAdded: 1678920000000 },
  { id: '6', title: 'YouTube', url: 'https://youtube.com', category: 'Entertainment', dateAdded: 1678930000000 },
  { id: '7', title: 'Netflix', url: 'https://netflix.com', category: 'Entertainment', dateAdded: 1678940000000 },
  { id: '8', title: 'MDN Web Docs', url: 'https://developer.mozilla.org', category: 'Development', dateAdded: 1678950000000 },
  { id: '9', title: 'Figma', url: 'https://figma.com', category: 'Design', dateAdded: 1678960000000 },
  { id: '10', title: 'Vercel', url: 'https://vercel.com', category: 'Hosting', dateAdded: 1678970000000 },
];

export const isChromeExtension = (): boolean => {
  return typeof chrome !== 'undefined' && !!chrome.bookmarks;
};

// Recursive function to flatten the bookmark tree
const processBookmarkNodes = (nodes: any[], categoryName: string = 'Uncategorized'): Bookmark[] => {
  let results: Bookmark[] = [];
  
  for (const node of nodes) {
    if (node.url) {
      // It's a bookmark
      results.push({
        id: node.id,
        title: node.title,
        url: node.url,
        dateAdded: node.dateAdded,
        category: categoryName,
        parentId: node.parentId
      });
    } else if (node.children) {
      // It's a folder, use its title as the category for children, unless it's root
      // Root folders usually are "Bookmarks Bar", "Other Bookmarks"
      const nextCategory = ['1', '2', '0'].includes(node.id) ? 'General' : node.title;
      results = results.concat(processBookmarkNodes(node.children, nextCategory));
    }
  }
  return results;
};

export const getBookmarks = (): Promise<Bookmark[]> => {
  return new Promise((resolve) => {
    if (isChromeExtension()) {
      chrome.bookmarks.getTree((tree: any) => {
        const flatBookmarks = processBookmarkNodes(tree);
        resolve(flatBookmarks);
      });
    } else {
      // Simulate API delay
      setTimeout(() => {
        resolve(MOCK_BOOKMARKS);
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