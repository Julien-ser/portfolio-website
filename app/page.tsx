'use client';

import { useEffect } from 'react';
import XTerminal from '@/components/terminal/Terminal';
import WindowRenderer from '@/components/windows/WindowRenderer';
import { useProcessRegistry } from '@/lib/windows/processRegistry';
import { About, Projects, Contact, Resume } from '@/components/processes';
import { parser } from '@/lib/terminal/parser';
import { handleShCommand } from '@/lib/terminal/sh-handler';
import type { ShResult } from '@/lib/terminal/sh-handler';

export default function Home() {
  const { registerProcess, launchProcess } = useProcessRegistry();

  // Register processes on mount
  useEffect(() => {
    registerProcess({
      id: 'about.exe',
      title: 'About Me',
      component: About,
      initialPosition: { x: 200, y: 150 },
      initialSize: { width: 500, height: 450 },
    });

    registerProcess({
      id: 'projects.exe',
      title: 'Projects',
      component: Projects,
      initialPosition: { x: 150, y: 100 },
      initialSize: { width: 700, height: 500 },
    });

    registerProcess({
      id: 'contact.exe',
      title: 'Contact',
      component: Contact,
      initialPosition: { x: 300, y: 200 },
      initialSize: { width: 450, height: 400 },
    });

    registerProcess({
      id: 'resume.exe',
      title: 'Resume',
      component: Resume,
      initialPosition: { x: 250, y: 120 },
      initialSize: { width: 550, height: 550 },
    });
  }, [registerProcess]);

  const handleCommand = async (command: string): Promise<string | void> => {
    const parsed = parser.parse(command);
    if (!parsed || parsed.command === 'unknown') {
      return `Unknown command: ${command}. Type 'help' for available commands.`;
    }

    const { command: cmd, args } = parsed;
    const argString = args.join(' ');

    switch (cmd) {
      case 'help':
        return `Available commands:
  help   - Show this help message
  clear  - Clear the terminal screen
  ls     - List available commands and processes
  run    - Launch a process (e.g., run about.exe)
  sh     - Ask a question (e.g., sh "What is React?")
  about  - Open About Me window
  projects - Open Projects window

Use 'sh' to ask general questions, interview Q&A, or web search.
`;

      case 'clear':
        return '\x1b[2J\x1b[H'; // ANSI clear screen

      case 'ls':
        return `Commands:
  help, clear, ls, run, sh, about, projects

Processes (launch with 'run <process>.exe'):
  about.exe    - About Me
  projects.exe - Projects
  contact.exe  - Contact
  resume.exe   - Resume
`;

      case 'run':
        if (argString) {
          const processId = argString.endsWith('.exe') ? argString : `${argString}.exe`;
          launchProcess(processId);
        } else {
          return 'Usage: run <process>\nExample: run about.exe';
        }
        break;

      case 'sh':
        if (!argString) {
          return 'Usage: sh <question>\nExample: sh "What is React?"';
        }
        const result: ShResult = await handleShCommand(argString);
        if (result.success) {
          return result.answer;
        } else {
          return `Error: ${result.answer}`;
        }

      case 'about':
        launchProcess('about.exe');
        break;

      case 'projects':
        launchProcess('projects.exe');
        break;

      default:
        return `Unknown command: ${cmd}. Type 'help' for available commands.`;
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono relative overflow-hidden">
      {/* Terminal at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-96 border-t border-green-900/50">
        <XTerminal 
          prompt="$ " 
          onCommand={handleCommand}
        />
      </div>

      {/* Window renderer for popup windows */}
      <div className="absolute inset-0 pointer-events-none" style={{ paddingBottom: '384px' }}>
        <div className="pointer-events-auto">
          <WindowRenderer />
        </div>
      </div>

      {/* Welcome message overlay (shows initially, can be dismissed) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-green-400">Julien Serbanescu</h1>
          <p className="text-xl text-gray-400">Full-Stack Developer & Problem Solver</p>
        </div>
      </div>
    </div>
  );
}
