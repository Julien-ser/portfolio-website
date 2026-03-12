export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  links: {
    github?: string;
    demo?: string;
  };
  images: string[];
  featured: boolean;
  date: string;
}

export const projects: Project[] = [
  {
    id: 'portfolio-terminal',
    title: 'Portfolio Terminal',
    description: 'An interactive terminal-style portfolio website with draggable windows and a chatbot.',
    longDescription: 'A unique portfolio website that simulates a desktop environment with an interactive terminal. Users can launch applications as draggable windows, use natural language chat for interview questions, and explore projects in a nostalgic computing interface.',
    technologies: ['Next.js', 'React', 'TypeScript', 'xterm.js', 'LangChain', 'Tailwind CSS'],
    links: {
      github: 'https://github.com/jserbanescu/portfolio-terminal',
      demo: 'https://portfolio-terminal.vercel.app',
    },
    images: [],
    featured: true,
    date: '2024-03',
  },
  {
    id: 'ai-code-reviewer',
    title: 'AI Code Reviewer',
    description: 'An intelligent code review assistant that uses AI to provide feedback on pull requests.',
    longDescription: 'A GitHub app that automatically reviews code changes, suggests improvements, detects potential bugs, and ensures code quality using advanced language models. Integrates seamlessly into the PR workflow.',
    technologies: ['Python', 'FastAPI', 'OpenAI GPT-4', 'GitHub Apps', 'PostgreSQL'],
    links: {
      github: 'https://github.com/jserbanescu/ai-code-reviewer',
    },
    images: [],
    featured: true,
    date: '2024-01',
  },
  {
    id: 'realtime-collab-editor',
    title: 'Real-time Collaborative Editor',
    description: 'A Google Docs-like collaborative text editor with real-time synchronization.',
    longDescription: 'A web-based collaborative editor allowing multiple users to edit documents simultaneously with real-time updates. Features include version history, user presence indicators, and conflict resolution.',
    technologies: ['React', 'Node.js', 'Socket.io', 'Redis', 'MongoDB'],
    links: {
      github: 'https://github.com/jserbanescu/realtime-collab-editor',
      demo: 'https://collab-editor.demo.com',
    },
    images: [],
    featured: false,
    date: '2023-11',
  },
  {
    id: 'ml-pipeline-orchestrator',
    title: 'ML Pipeline Orchestrator',
    description: 'A platform for managing and orchestrating machine learning training pipelines.',
    longDescription: 'A comprehensive tool for data scientists to define, schedule, and monitor ML pipelines. Supports distributed training, hyperparameter tuning, and experiment tracking with a beautiful UI.',
    technologies: ['Python', 'Airflow', 'Kubernetes', 'TensorFlow', 'React', 'PostgreSQL'],
    links: {
      github: 'https://github.com/jserbanescu/ml-pipeline-orchestrator',
    },
    images: [],
    featured: true,
    date: '2023-09',
  },
  {
    id: 'crypto-wallet-tracker',
    title: 'Cryptocurrency Wallet Tracker',
    description: 'A dashboard for tracking cryptocurrency balances across multiple wallets and chains.',
    longDescription: 'A comprehensive cryptocurrency tracking application that aggregates balances from multiple wallets across different blockchains. Provides real-time price updates, transaction history, and portfolio analytics.',
    technologies: ['React', 'TypeScript', 'Web3.js', 'Ethers.js', 'Tailwind CSS', 'Node.js'],
    links: {
      github: 'https://github.com/jserbanescu/crypto-wallet-tracker',
    },
    images: [],
    featured: false,
    date: '2023-07',
  },
];

export function getProjectById(id: string): Project | undefined {
  return projects.find(p => p.id === id);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter(p => p.featured);
}
