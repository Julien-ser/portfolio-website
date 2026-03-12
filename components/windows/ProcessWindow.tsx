'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import Draggable from 'react-draggable';
import { useWindowManager } from '../../lib/windows/WindowManager';

interface ProcessWindowProps {
  id: string;
  title: string;
  children: ReactNode;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  onClose?: (id: string) => void;
  onMinimize?: (id: string) => void;
  onMaximize?: (id: string) => void;
}

type WindowState = 'normal' | 'minimized' | 'maximized';

const WINDOW_MIN_WIDTH = 400;
const WINDOW_MIN_HEIGHT = 300;
const TITLE_BAR_HEIGHT = 36;

export default function ProcessWindow({
  id,
  title,
  children,
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 600, height: 400 },
  onClose,
  onMinimize,
  onMaximize,
}: ProcessWindowProps) {
  const { getWindowState, setWindowState: setWindowStateInManager, setActiveWindow, activeWindowId } = useWindowManager();
  
  const [windowState, setWindowState] = useState<WindowState>('normal');
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isResizing, setIsResizing] = useState(false);
  const resizeDirection = useRef<string>('');
  const startMousePos = useRef({ x: 0, y: 0 });
  const startWindowSize = useRef({ width: 0, height: 0 });
  const startWindowPos = useRef({ x: 0, y: 0 });
  const nodeRef = useRef<HTMLDivElement>(null);

  // Sync with window manager state
  useEffect(() => {
    const managerState = getWindowState(id);
    if (managerState) {
      setWindowState(managerState.state);
      if (managerState.position) setPosition(managerState.position);
      if (managerState.size) setSize(managerState.size);
    }
  }, [id, getWindowState]);

  const handleStateChange = (newState: WindowState) => {
    setWindowState(newState);
    setWindowStateInManager(id, { state: newState });
  };

  const handleClose = () => {
    if (onClose) onClose(id);
  };

  const handleMinimize = () => {
    handleStateChange('minimized');
    if (onMinimize) onMinimize(id);
  };

  const handleMaximize = () => {
    if (windowState === 'maximized') {
      handleStateChange('normal');
    } else {
      handleStateChange('maximized');
    }
    if (onMaximize) onMaximize(id);
  };

  const handleFocus = () => {
    setActiveWindow(id);
  };

  const handleDrag = (_event: any, data: { x: number; y: number }) => {
    if (windowState === 'maximized') return;
    setPosition({ x: data.x, y: data.y });
    setWindowStateInManager(id, { position: { x: data.x, y: data.y } });
  };

  const startResize = (direction: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (windowState === 'maximized' || windowState === 'minimized') return;
    
    setIsResizing(true);
    resizeDirection.current = direction;
    startMousePos.current = { x: e.clientX, y: e.clientY };
    startWindowSize.current = { width: size.width, height: size.height };
    startWindowPos.current = { x: position.x, y: position.y };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopResize);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;

    const deltaX = e.clientX - startMousePos.current.x;
    const deltaY = e.clientY - startMousePos.current.y;
    const direction = resizeDirection.current;
    
    let newWidth = startWindowSize.current.width;
    let newHeight = startWindowSize.current.height;
    let newX = startWindowPos.current.x;
    let newY = startWindowPos.current.y;

    // Calculate new dimensions based on resize direction
    if (direction.includes('e')) {
      newWidth = Math.max(WINDOW_MIN_WIDTH, startWindowSize.current.width + deltaX);
    }
    if (direction.includes('w')) {
      const potentialWidth = startWindowSize.current.width - deltaX;
      if (potentialWidth >= WINDOW_MIN_WIDTH) {
        newWidth = potentialWidth;
        newX = startWindowPos.current.x + deltaX;
      }
    }
    if (direction.includes('s')) {
      newHeight = Math.max(WINDOW_MIN_HEIGHT, startWindowSize.current.height + deltaY);
    }
    if (direction.includes('n')) {
      const potentialHeight = startWindowSize.current.height - deltaY;
      if (potentialHeight >= WINDOW_MIN_HEIGHT) {
        newHeight = potentialHeight;
        newY = startWindowPos.current.y + deltaY;
      }
    }

    setSize({ width: newWidth, height: newHeight });
    setPosition({ x: newX, y: newY });
     setWindowStateInManager(id, { 
       size: { width: newWidth, height: newHeight },
       position: { x: newX, y: newY }
     });
  };

  const stopResize = () => {
    setIsResizing(false);
    resizeDirection.current = '';
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', stopResize);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', stopResize);
    };
  }, []);

  const getWindowStyle = () => {
    if (windowState === 'maximized') {
      return {
        top: 0,
        left: 0,
        width: '100%',
        height: 'calc(100vh - 40px)', // Leave space for terminal
      };
    }
    
    if (windowState === 'minimized') {
      return {
        display: 'none',
      };
    }
    
    return {
      top: position.y,
      left: position.x,
      width: size.width,
      height: size.height,
    };
  };

  const renderResizeHandles = () => {
    if (windowState !== 'normal') return null;

    const handles = [
      'n', 's', 'e', 'w',
      'ne', 'nw', 'se', 'sw'
    ];

    return (
      <>
        {handles.map(dir => (
          <div
            key={dir}
            className={`resize-handle resize-handle-${dir}`}
            onMouseDown={startResize(dir)}
          />
        ))}
      </>
    );
  };

  const isActiveWindow = activeWindowId === id;

  const wrapperStyle: React.CSSProperties = {
    position: 'absolute' as const,
    zIndex: isActiveWindow ? 1000 : 100,
    ...getWindowStyle(),
  };

  const contentStyle: React.CSSProperties = {
    height: windowState === 'normal' 
      ? `calc(100% - ${TITLE_BAR_HEIGHT}px)`
      : '100%',
  };

  return (
    <Draggable
      handle=".window-title-bar"
      position={windowState === 'normal' ? { x: position.x, y: position.y } : undefined}
      onStop={handleDrag}
      nodeRef={nodeRef}
      disabled={windowState !== 'normal'}
    >
      <div
        ref={nodeRef}
        style={wrapperStyle}
        className={`process-window ${isActiveWindow ? 'active' : 'inactive'}`}
        onClick={handleFocus}
      >
        <div className="window-title-bar">
          <div className="window-title">{title}</div>
          <div className="window-controls">
            <button className="window-control minimize" onClick={handleMinimize} title="Minimize">
              <span>─</span>
            </button>
            <button className="window-control maximize" onClick={handleMaximize} title={windowState === 'maximized' ? 'Restore' : 'Maximize'}>
              <span>{windowState === 'maximized' ? '❐' : '□'}</span>
            </button>
            <button className="window-control close" onClick={handleClose} title="Close">
              <span>×</span>
            </button>
          </div>
        </div>
        
        <div style={contentStyle} className="window-content">
          {children}
        </div>

        {renderResizeHandles()}
      </div>
    </Draggable>
  );
}
