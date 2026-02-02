export interface Link {
  id: string;
  url: string;
  title: string;
  description?: string;
  tags: string[];
  folder?: string;
  createdAt: Date;
  updatedAt: Date;
  favorite: boolean;
  archived: boolean;
  metadata?: {
    image?: string;
    siteName?: string;
    author?: string;
    readTime?: number; // in minutes
  };
}

export interface Folder {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  linkCount: number;
  createdAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
  linkCount: number;
}

export type SortOption = 'createdAt' | 'updatedAt' | 'title' | 'url';
export type SortDirection = 'asc' | 'desc';

export interface FilterOptions {
  search?: string;
  tags?: string[];
  folder?: string;
  favorite?: boolean;
  archived?: boolean;
  sortBy: SortOption;
  sortDirection: SortDirection;
}

export type LinkFormData = Omit<Link, 'id' | 'createdAt' | 'updatedAt'>;