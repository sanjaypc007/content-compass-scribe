
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Platform = 'linkedin' | 'quora';

export interface ContentItem {
  id: string;
  platform: Platform;
  topic: string;
  content: string;
  createdAt: string;
  isPinned?: boolean;
}

export interface CalendarItem extends ContentItem {
  scheduledDate: string;
}

interface ContentStore {
  contentHistory: ContentItem[];
  calendarItems: CalendarItem[];
  addToHistory: (item: ContentItem) => void;
  removeFromHistory: (id: string) => void;
  togglePinContent: (id: string) => void;
  addToCalendar: (item: CalendarItem) => void;
  removeFromCalendar: (id: string) => void;
  updateCalendarItem: (item: CalendarItem) => void;
  clearContentHistory: () => void;
  clearCalendarItems: () => void;
}

export const useContentStore = create<ContentStore>()(
  persist(
    (set) => ({
      contentHistory: [],
      calendarItems: [],
      
      addToHistory: (item) => set((state) => ({ 
        contentHistory: [item, ...state.contentHistory].slice(0, 100)
      })),
      
      removeFromHistory: (id) => set((state) => ({ 
        contentHistory: state.contentHistory.filter(item => item.id !== id) 
      })),

      togglePinContent: (id) => set((state) => ({
        contentHistory: state.contentHistory.map(item => 
          item.id === id ? { ...item, isPinned: !item.isPinned } : item
        )
      })),
      
      addToCalendar: (item) => set((state) => ({ 
        calendarItems: [...state.calendarItems, item] 
      })),
      
      removeFromCalendar: (id) => set((state) => ({ 
        calendarItems: state.calendarItems.filter(item => item.id !== id) 
      })),
      
      updateCalendarItem: (updatedItem) => set((state) => ({
        calendarItems: state.calendarItems.map(item => 
          item.id === updatedItem.id ? updatedItem : item
        )
      })),

      clearContentHistory: () => set({ contentHistory: [] }),
      
      clearCalendarItems: () => set({ calendarItems: [] }),
    }),
    {
      name: 'content-compass-store',
    }
  )
);
