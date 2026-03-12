'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface WindowStateData {
  state: 'normal' | 'minimized' | 'maximized';
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  zIndex: number;
}

interface WindowManagerContextType {
  windows: Map<string, WindowStateData>;
  activeWindowId: string | null;
  setWindowState: (id: string, state: Partial<WindowStateData>) => void;
  setActiveWindow: (id: string) => void;
  getWindowState: (id: string) => WindowStateData | undefined;
  registerWindow: (id: string, initialState?: WindowStateData) => void;
  unregisterWindow: (id: string) => void;
}

const WindowManagerContext = createContext<WindowManagerContextType | null>(null);

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<Map<string, WindowStateData>>(new Map());
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);

  const getWindowState = (id: string) => {
    return windows.get(id);
  };

  const setWindowState = (id: string, updates: Partial<WindowStateData>) => {
    setWindows(prev => {
      const newWindows = new Map(prev);
      const current = newWindows.get(id);
      if (current) {
        newWindows.set(id, { ...current, ...updates });
      } else {
        newWindows.set(id, updates as WindowStateData);
      }
      return newWindows;
    });
  };

  const setActiveWindow = (id: string) => {
    setActiveWindowId(id);
    // Bring window to front by increasing its z-index
    setWindows(prev => {
      const newWindows = new Map(prev);
      const current = newWindows.get(id);
      if (current) {
        const maxZIndex = Array.from(newWindows.values()).reduce((max, w) => Math.max(max, w.zIndex), 0);
        newWindows.set(id, { ...current, zIndex: maxZIndex + 1 });
      }
      return newWindows;
    });
  };

  const registerWindow = (id: string, initialState?: WindowStateData) => {
    setWindows(prev => {
      const newWindows = new Map(prev);
      if (!newWindows.has(id)) {
        // Calculate next z-index (max + 1)
        const maxZIndex = Array.from(newWindows.values()).reduce((max, w) => Math.max(max, w.zIndex), 0);
        newWindows.set(id, {
          state: 'normal',
          zIndex: maxZIndex + 1,
          ...initialState,
        });
      }
      return newWindows;
    });
  };

  const unregisterWindow = (id: string) => {
    setWindows(prev => {
      const newWindows = new Map(prev);
      newWindows.delete(id);
      return newWindows;
    });
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  return (
    <WindowManagerContext.Provider
      value={{
        windows,
        activeWindowId,
        getWindowState,
        setWindowState,
        setActiveWindow,
        registerWindow,
        unregisterWindow,
      }}
    >
      {children}
    </WindowManagerContext.Provider>
  );
}

export function useWindowManager() {
  const context = useContext(WindowManagerContext);
  if (!context) {
    throw new Error('useWindowManager must be used within WindowManagerProvider');
  }
  return context;
}
