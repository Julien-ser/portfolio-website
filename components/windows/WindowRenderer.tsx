'use client';

import { useWindowManager } from '@/lib/windows/WindowManager';
import { useProcessRegistry } from '@/lib/windows/processRegistry';
import ProcessWindow from '@/components/windows/ProcessWindow';
import { useEffect } from 'react';

export default function WindowRenderer() {
  const { windows, unregisterWindow, setActiveWindow, activeWindowId } = useWindowManager();
  const { getProcess, closeProcess } = useProcessRegistry();

  // Handle window close
  const handleClose = (windowId: string) => {
    closeProcess(windowId);
  };

  // Render each window
  const windowEntries = Array.from(windows.entries());

  return (
    <div className="window-container">
      {windowEntries.map(([windowId, windowState]) => {
        const process = getProcess(windowId);
        if (!process) return null;

        const ContentComponent = process.component;

        return (
          <ProcessWindow
            key={windowId}
            id={windowId}
            title={process.title}
            initialPosition={windowState.position}
            initialSize={windowState.size}
            onClose={handleClose}
          >
            <ContentComponent onClose={() => handleClose(windowId)} />
          </ProcessWindow>
        );
      })}
    </div>
  );
}
