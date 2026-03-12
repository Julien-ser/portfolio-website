'use client';

import { useEffect, useReducer, useRef, useMemo } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { Trie, createCompletionTrie } from '../../lib/terminal/trie';

interface XTerminalProps {
  prompt?: string;
  onCommand: (command: string) => Promise<string | void> | string | void;
  onWrite?: (text: string) => void;
}

type HistoryState = {
  commands: string[];
  currentIndex: number;
};

type HistoryAction =
  | { type: 'ADD_COMMAND'; payload: string }
  | { type: 'NAVIGATE_UP' }
  | { type: 'NAVIGATE_DOWN' }
  | { type: 'RESET_INDEX' };

const MAX_HISTORY = 100;

function historyReducer(state: HistoryState, action: HistoryAction): HistoryState {
  switch (action.type) {
    case 'ADD_COMMAND': {
      const newCommands = [...state.commands, action.payload];
      if (newCommands.length > MAX_HISTORY) {
        newCommands.shift();
      }
      return { commands: newCommands, currentIndex: newCommands.length };
    }
    case 'NAVIGATE_UP': {
      if (state.currentIndex > 0) {
        return { ...state, currentIndex: state.currentIndex - 1 };
      }
      return state;
    }
    case 'NAVIGATE_DOWN': {
      if (state.currentIndex < state.commands.length - 1) {
        return { ...state, currentIndex: state.currentIndex + 1 };
      }
      return { ...state, currentIndex: state.commands.length };
    }
    case 'RESET_INDEX':
      return { ...state, currentIndex: state.commands.length };
    default:
      return state;
  }
}

export default function XTerminal({ prompt = '$ ', onCommand }: XTerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstance = useRef<XTerm | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const currentLine = useRef<string>('');
  const [history, dispatch] = useReducer(historyReducer, {
    commands: [],
    currentIndex: 0,
  });

  // Command and process definitions for tab completion
  const commands = useMemo(() => ['help', 'clear', 'ls', 'run', 'sh', 'about', 'projects'], []);
  const processes = useMemo(() => ['about.exe', 'projects.exe', 'contact.exe', 'resume.exe'], []);
  
  // Initialize completion trie with both commands and processes
  const completionTrie = useMemo(() => 
    createCompletionTrie(commands, processes), 
    [commands, processes]
  );

  // Helper to get current word at cursor position
  const getCurrentWord = (line: string): { word: string; start: number; end: number } => {
    // Word end is at the current cursor position (end of line)
    const end = line.length;
    
    // Find the start of the current word (go backwards until we hit space or start)
    let start = end - 1;
    while (start >= 0 && line[start] !== ' ' && line[start] !== '\t') {
      start--;
    }
    start++;
    
    return {
      word: line.substring(start, end),
      start,
      end
    };
  };

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new XTerm({
      cursorBlink: true,
      theme: {
        background: '#1e1e1e',
        foreground: '#f0f0f0',
        cursor: '#ffffff',
      },
      fontSize: 14,
      fontFamily: 'monospace',
    });
    terminalInstance.current = term;

    const fit = new FitAddon();
    fitAddon.current = fit;
    term.loadAddon(fit);

    term.open(terminalRef.current);
    fit.fit();

    term.writeln('Welcome to the portfolio terminal. Type "help" for available commands.');
    term.write(prompt);
    currentLine.current = '';

    const handleData = async (data: string) => {
      if (data === '\r') {
        term.writeln('\r\n');
        const command = currentLine.current.trim();
        if (command) {
          dispatch({ type: 'ADD_COMMAND', payload: command });
          try {
            const result = onCommand(command);
            if (result instanceof Promise) {
              const output = await result;
              if (typeof output === 'string') {
                term.writeln(output);
              }
            } else if (typeof result === 'string') {
              term.writeln(result);
            }
          } catch (error) {
            term.writeln(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
        currentLine.current = '';
        dispatch({ type: 'RESET_INDEX' });
        term.write(prompt);
      } else if (data === '\u007F' || data === '\b') {
        if (currentLine.current.length > 0) {
          currentLine.current = currentLine.current.slice(0, -1);
          redrawInputLine(term, prompt, currentLine.current);
        }
      } else if (data === '\u001b[A') {
        // Up arrow - navigate history backward (older commands)
        if (history.currentIndex > 0) {
          dispatch({ type: 'NAVIGATE_UP' });
          const command = history.commands[history.currentIndex - 1];
          currentLine.current = command;
          redrawInputLine(term, prompt, currentLine.current);
        }
      } else if (data === '\u001b[B') {
        // Down arrow - navigate history forward (newer commands)
        if (history.currentIndex < history.commands.length - 1) {
          dispatch({ type: 'NAVIGATE_DOWN' });
          const command = history.commands[history.currentIndex + 1];
          currentLine.current = command;
          redrawInputLine(term, prompt, currentLine.current);
        } else if (history.currentIndex === history.commands.length - 1) {
          // At the end, clear the line
          dispatch({ type: 'NAVIGATE_DOWN' });
          currentLine.current = '';
          redrawInputLine(term, prompt, currentLine.current);
        }
      } else if (data === '\t') {
        // Tab - perform completion
        const { word, start } = getCurrentWord(currentLine.current);
        
        if (word.length > 0) {
          const completion = completionTrie.complete(word);
          
          if (completion) {
            if (completion.suggestions.length === 0) {
              // Single completion - auto-complete
              currentLine.current = 
                currentLine.current.substring(0, start) + 
                completion.completed;
              redrawInputLine(term, prompt, currentLine.current);
            } else {
              // Multiple completions - show suggestions
              term.writeln('');
              const maxWidth = Math.max(...completion.suggestions.map(s => s.length));
              const cols = Math.floor(term.cols / (maxWidth + 2));
              
              // Display suggestions in columns
              for (let i = 0; i < completion.suggestions.length; i += cols) {
                const row = completion.suggestions.slice(i, i + cols);
                term.writeln('  ' + row.map(s => s.padEnd(maxWidth + 2)).join(''));
              }
              
              // Redraw the current input line
              redrawInputLine(term, prompt, currentLine.current);
              
              // If we can auto-complete to common prefix (and it's longer than current), do it
              if (completion.completed.length > word.length) {
                currentLine.current = 
                  currentLine.current.substring(0, start) + 
                  completion.completed;
                redrawInputLine(term, prompt, currentLine.current);
              }
            }
          }
        }
        // If no word or no completions, do nothing (just stay on same line)
      } else if (data >= ' ' && data <= '~') {
        // Only add printable characters
        currentLine.current += data;
        // Reset history index when manually typing
        if (history.currentIndex < history.commands.length) {
          dispatch({ type: 'RESET_INDEX' });
        }
        redrawInputLine(term, prompt, currentLine.current);
      }
    };

    term.onData(handleData);

    const handleResize = () => {
      fit.fit();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
    };
  }, [prompt, onCommand]);

  const redrawInputLine = (term: XTerm, prompt: string, line: string) => {
    term.write('\r\x1b[2K');
    term.write(`${prompt}${line}`);
  };

  return <div ref={terminalRef} style={{ width: '100%', height: '100%' }} />;
}
