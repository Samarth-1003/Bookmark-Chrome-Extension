export interface Bookmark {
  id: string;
  title: string;
  url: string;
  dateAdded?: number;
  category?: string;
  parentId?: string;
}

export interface Folder {
  id: string;
  title: string;
}

export interface CategoryCount {
  name: string;
  count: number;
  id?: string; // Add ID so we can target folders
}

export enum ViewMode {
  GRID = 'GRID',
  LIST = 'LIST'
}