'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useWindowManager } from './WindowManager';

export interface ProcessDefinition {
  id: string;
  title: string;
  component: React.ComponentType<{ onClose?: () => void }>;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
}

interface ProcessRegistryContextType {
  processes: Map<string, ProcessDefinition>;
  registerProcess: (process: ProcessDefinition) => void;
  unregisterProcess: (id: string) => void;
  getProcess: (id: string) => ProcessDefinition | undefined;
  launchProcess: (id: string) => void;
  closeProcess: (id: string) => void;
}

const ProcessRegistryContext = createContext<ProcessRegistryContextType | null>(null);

export function ProcessRegistryProvider({ children }: { children: ReactNode }) {
  const [processes, setProcesses] = useState<Map<string, ProcessDefinition>>(new Map());
  const { registerWindow, unregisterWindow, setWindowState, activeWindowId, setActiveWindow } = useWindowManager();

  const registerProcess = useCallback((process: ProcessDefinition) => {
    setProcesses(prev => {
      const newProcesses = new Map(prev);
      newProcesses.set(process.id, process);
      return newProcesses;
    });
  }, []);

  const unregisterProcess = useCallback((id: string) => {
    setProcesses(prev => {
      const newProcesses = new Map(prev);
      newProcesses.delete(id);
      return newProcesses;
    });
  }, []);

  const getProcess = useCallback((id: string) => {
    return processes.get(id);
  }, [processes]);

  const launchProcess = useCallback((id: string) => {
    const process = processes.get(id);
    if (!process) {
      console.warn(`Process ${id} not found in registry`);
      return;
    }

    // Register the window with the window manager
    registerWindow(id, {
      state: 'normal',
      position: process.initialPosition,
      size: process.initialSize,
      zIndex: 1, // Will be auto-adjusted by setActiveWindow
    });

    // Set as active window
    setActiveWindow(id);
  }, [processes, registerWindow, setActiveWindow]);

  const closeProcess = useCallback((id: string) => {
    unregisterWindow(id);
  }, [unregisterWindow]);

  const value: ProcessRegistryContextType = {
    processes,
    registerProcess,
    unregisterProcess,
    getProcess,
    launchProcess,
    closeProcess,
  };

  return (
    <ProcessRegistryContext.Provider value={value}>
      {children}
    </ProcessRegistryContext.Provider>
  );
}

export function useProcessRegistry() {
  const context = useContext(ProcessRegistryContext);
  if (!context) {
    throw new Error('useProcessRegistry must be used within ProcessRegistryProvider');
  }
  return context;
}
