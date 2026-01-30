export interface Bookmark {
  id: string;
  title: string;
  url: string;
  dateAdded?: number;
  category?: string;
  parentId?: string;
}

export interface CategoryCount {
  name: string;
  count: number;
}

export enum ViewMode {
  GRID = 'GRID',
  LIST = 'LIST'
}
