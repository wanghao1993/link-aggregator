import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, Folder, Tag, FilterOptions } from '@/types';

interface LinkStore {
  // State
  links: Link[];
  folders: Folder[];
  tags: Tag[];
  
  // Actions
  addLink: (link: Omit<Link, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLink: (id: string, updates: Partial<Link>) => void;
  deleteLink: (id: string) => void;
  toggleFavorite: (id: string) => void;
  toggleArchive: (id: string) => void;
  addFolder: (name: string, icon?: string, color?: string) => void;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;
  addTag: (name: string, color?: string) => void;
  
  // Queries
  getLinkById: (id: string) => Link | undefined;
  getLinksByFolder: (folderId: string) => Link[];
  getLinksByTag: (tagName: string) => Link[];
  getFavoriteLinks: () => Link[];
  getArchivedLinks: () => Link[];
  searchLinks: (query: string, linksList?: Link[]) => Link[];
  filterLinks: (options: FilterOptions) => Link[];
  
  // Bulk operations
  clearAllLinks: () => void;
  exportLinks: () => Link[];
  importLinks: (links: Link[]) => void;
}

// Helper function to generate unique ID
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

// Mock initial data
const initialLinks: Link[] = [
  {
    id: generateId(),
    url: 'https://reactnative.dev/docs/getting-started',
    title: 'React Native Documentation',
    description: 'Official React Native documentation for getting started',
    tags: ['react-native', 'documentation', 'mobile'],
    folder: 'Development',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    favorite: true,
    archived: false,
    metadata: {
      image: 'https://reactnative.dev/img/header_logo.svg',
      siteName: 'React Native',
      readTime: 5,
    },
  },
  {
    id: generateId(),
    url: 'https://tailwindcss.com/docs/installation',
    title: 'Tailwind CSS Documentation',
    description: 'A utility-first CSS framework for rapidly building custom designs',
    tags: ['css', 'tailwind', 'webdev'],
    folder: 'Frontend',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    favorite: false,
    archived: false,
    metadata: {
      image: 'https://tailwindcss.com/favicons/favicon-32x32.png',
      siteName: 'Tailwind CSS',
      readTime: 8,
    },
  },
  {
    id: generateId(),
    url: 'https://nextjs.org/docs',
    title: 'Next.js Documentation',
    description: 'The React Framework for Production',
    tags: ['nextjs', 'react', 'fullstack'],
    folder: 'Development',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
    favorite: true,
    archived: false,
  },
];

const initialFolders: Folder[] = [
  { id: generateId(), name: 'Development', icon: 'code', color: '#3B82F6', linkCount: 2, createdAt: new Date() },
  { id: generateId(), name: 'Frontend', icon: 'layout', color: '#10B981', linkCount: 1, createdAt: new Date() },
  { id: generateId(), name: 'Design', icon: 'palette', color: '#8B5CF6', linkCount: 0, createdAt: new Date() },
  { id: generateId(), name: 'Productivity', icon: 'check-circle', color: '#F59E0B', linkCount: 0, createdAt: new Date() },
];

const initialTags: Tag[] = [
  { id: generateId(), name: 'react-native', color: '#61DAFB', linkCount: 1 },
  { id: generateId(), name: 'documentation', color: '#6B7280', linkCount: 2 },
  { id: generateId(), name: 'mobile', color: '#34D399', linkCount: 1 },
  { id: generateId(), name: 'css', color: '#8B5CF6', linkCount: 1 },
  { id: generateId(), name: 'tailwind', color: '#06B6D4', linkCount: 1 },
  { id: generateId(), name: 'webdev', color: '#F59E0B', linkCount: 1 },
  { id: generateId(), name: 'nextjs', color: '#000000', linkCount: 1 },
  { id: generateId(), name: 'react', color: '#61DAFB', linkCount: 1 },
  { id: generateId(), name: 'fullstack', color: '#8B5CF6', linkCount: 1 },
];

export const useLinkStore = create<LinkStore>()(
  persist(
    (set, get) => ({
      // Initial state
      links: initialLinks,
      folders: initialFolders,
      tags: initialTags,
      
      // Add a new link
      addLink: (linkData) => {
        const newLink: Link = {
          id: generateId(),
          ...linkData,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => {
          // Update folder count
          const updatedFolders = linkData.folder 
            ? state.folders.map(folder => 
                folder.name === linkData.folder 
                  ? { ...folder, linkCount: folder.linkCount + 1 }
                  : folder
              )
            : state.folders;
          
          // Update tag counts
          const updatedTags = [...state.tags];
          linkData.tags.forEach(tagName => {
            const existingTag = updatedTags.find(t => t.name === tagName);
            if (existingTag) {
              existingTag.linkCount++;
            } else {
              updatedTags.push({
                id: generateId(),
                name: tagName,
                color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
                linkCount: 1,
              });
            }
          });
          
          return {
            links: [...state.links, newLink],
            folders: updatedFolders,
            tags: updatedTags,
          };
        });
      },
      
      // Update an existing link
      updateLink: (id, updates) => {
        set((state) => ({
          links: state.links.map(link => 
            link.id === id 
              ? { ...link, ...updates, updatedAt: new Date() }
              : link
          ),
        }));
      },
      
      // Delete a link
      deleteLink: (id) => {
        set((state) => {
          const linkToDelete = state.links.find(link => link.id === id);
          if (!linkToDelete) return state;
          
          // Update folder count
          const updatedFolders = linkToDelete.folder 
            ? state.folders.map(folder => 
                folder.name === linkToDelete.folder && folder.linkCount > 0
                  ? { ...folder, linkCount: folder.linkCount - 1 }
                  : folder
              )
            : state.folders;
          
          // Update tag counts
          const updatedTags = [...state.tags];
          linkToDelete.tags.forEach(tagName => {
            const tagIndex = updatedTags.findIndex(t => t.name === tagName);
            if (tagIndex !== -1 && updatedTags[tagIndex].linkCount > 0) {
              updatedTags[tagIndex].linkCount--;
            }
          });
          
          return {
            links: state.links.filter(link => link.id !== id),
            folders: updatedFolders,
            tags: updatedTags.filter(tag => tag.linkCount > 0),
          };
        });
      },
      
      // Toggle favorite status
      toggleFavorite: (id) => {
        set((state) => ({
          links: state.links.map(link => 
            link.id === id 
              ? { ...link, favorite: !link.favorite, updatedAt: new Date() }
              : link
          ),
        }));
      },
      
      // Toggle archive status
      toggleArchive: (id) => {
        set((state) => ({
          links: state.links.map(link => 
            link.id === id 
              ? { ...link, archived: !link.archived, updatedAt: new Date() }
              : link
          ),
        }));
      },
      
      // Add a new folder
      addFolder: (name, icon, color) => {
        const newFolder: Folder = {
          id: generateId(),
          name,
          icon,
          color: color || `#${Math.floor(Math.random()*16777215).toString(16)}`,
          linkCount: 0,
          createdAt: new Date(),
        };
        
        set((state) => ({
          folders: [...state.folders, newFolder],
        }));
      },
      
      // Update a folder
      updateFolder: (id, updates) => {
        set((state) => ({
          folders: state.folders.map(folder => 
            folder.id === id ? { ...folder, ...updates } : folder
          ),
        }));
      },
      
      // Delete a folder (only if empty)
      deleteFolder: (id) => {
        set((state) => {
          const folderToDelete = state.folders.find(f => f.id === id);
          if (!folderToDelete || folderToDelete.linkCount > 0) return state;
          
          return {
            folders: state.folders.filter(folder => folder.id !== id),
          };
        });
      },
      
      // Add a new tag
      addTag: (name, color) => {
        const newTag: Tag = {
          id: generateId(),
          name,
          color: color || `#${Math.floor(Math.random()*16777215).toString(16)}`,
          linkCount: 0,
        };
        
        set((state) => ({
          tags: [...state.tags, newTag],
        }));
      },
      
      // Get link by ID
      getLinkById: (id) => {
        return get().links.find(link => link.id === id);
      },
      
      // Get links by folder
      getLinksByFolder: (folderName) => {
        return get().links.filter(link => link.folder === folderName);
      },
      
      // Get links by tag
      getLinksByTag: (tagName) => {
        return get().links.filter(link => link.tags.includes(tagName));
      },
      
      // Get favorite links
      getFavoriteLinks: () => {
        return get().links.filter(link => link.favorite);
      },
      
      // Get archived links
      getArchivedLinks: () => {
        return get().links.filter(link => link.archived);
      },
      
      // Search links by query
      searchLinks: (query, linksList = get().links) => {
        const searchTerm = query.toLowerCase();
        return linksList.filter(link => 
          link.title.toLowerCase().includes(searchTerm) ||
          link.url.toLowerCase().includes(searchTerm) ||
          link.description?.toLowerCase().includes(searchTerm) ||
          link.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      },
      
      // Filter links with advanced options
      filterLinks: (options) => {
        let filtered = get().links;
        
        if (options.search) {
          filtered = get().searchLinks(options.search, filtered);
        }
        
        if (options.tags && options.tags.length > 0) {
          filtered = filtered.filter(link => 
            options.tags!.some(tag => link.tags.includes(tag))
          );
        }
        
        if (options.folder) {
          filtered = filtered.filter(link => link.folder === options.folder);
        }
        
        if (options.favorite !== undefined) {
          filtered = filtered.filter(link => link.favorite === options.favorite);
        }
        
        if (options.archived !== undefined) {
          filtered = filtered.filter(link => link.archived === options.archived);
        }
        
        // Sort
        filtered.sort((a, b) => {
          const aValue = options.sortBy === 'title' ? a.title.toLowerCase() :
                        options.sortBy === 'url' ? a.url.toLowerCase() :
                        options.sortBy === 'createdAt' ? a.createdAt.getTime() :
                        a.updatedAt.getTime();
          
          const bValue = options.sortBy === 'title' ? b.title.toLowerCase() :
                        options.sortBy === 'url' ? b.url.toLowerCase() :
                        options.sortBy === 'createdAt' ? b.createdAt.getTime() :
                        b.updatedAt.getTime();
          
          if (options.sortDirection === 'asc') {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
          } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
          }
        });
        
        return filtered;
      },
      
      // Clear all links
      clearAllLinks: () => {
        set(() => ({
          links: [],
          folders: initialFolders.map(f => ({ ...f, linkCount: 0 })),
          tags: [],
        }));
      },
      
      // Export all links
      exportLinks: () => {
        return get().links;
      },
      
      // Import links
      importLinks: (links) => {
        set(() => ({
          links,
        }));
      },
    }),
    {
      name: 'link-aggregator-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        links: state.links,
        folders: state.folders,
        tags: state.tags,
      }),
    }
  )
);