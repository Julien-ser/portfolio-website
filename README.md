# Portfolio Terminal

An interactive portfolio website that simulates a desktop environment with a terminal interface. Users can launch applications as draggable windows, use a natural language chatbot (`sh`) for interview questions, and explore projects in a nostalgic computing interface.

## Features

- **Interactive Terminal**: Full-featured terminal with command history, tab completion, and command parsing
- **Draggable Windows**: Launch applications as windows that can be dragged, minimized, maximized, and closed
- **AI Chatbot**: The `sh` command answers general questions and interview queries using GPT-4 with fallbacks
- **Dynamic OG Images**: Automatically generated Open Graph images for social sharing of portfolio projects
- **Integrations**: LinkedIn, Twitter/X, Y Combinator profiles and custom search capabilities
- **Responsive Design**: Works on desktop and mobile with CRT visual effects

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

Create a `.env.local` file with the following variables:

\`\`\`env
# OpenAI API (required for chatbot)
OPENAI_API_KEY=your_openai_api_key_here

# Optional: LinkedIn OAuth (for about process)
LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret
LINKEDIN_REFRESH_TOKEN=your_refresh_token

# Optional: Twitter/X API (for social process)
TWITTER_API_KEY=your_api_key
TWITTER_API_SECRET=your_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_SECRET=your_access_secret

# Optional: Google Custom Search (for web search fallback)
GOOGLE_SEARCH_API_KEY=your_api_key
GOOGLE_SEARCH_ENGINE_ID=your_engine_id
\`\`\`

Visit [localhost:3000](http://localhost:3000) to see the terminal.

## Open Graph Images

This project uses **@vercel/og** to generate dynamic Open Graph images for portfolio projects on-demand.

### Endpoint

- **URL**: `/api/og?project=<project-id>`
- **Size**: 1200x630 pixels (standard OG image dimensions)
- **Style**: Terminal-themed with project-specific information

### How It Works

The OG image generator creates branded images featuring:
- Terminal window aesthetic with green-on-black color scheme
- Project title and description
- Technology stack as tags
- Prompt line showing \`./run_portfolio.sh\`
- Footer with name and title

### Usage in HTML

\`\`\`html
<meta property="og:image" content="https://your-site.vercel.app/api/og?project=portfolio-terminal" />
\`\`\`

Dynamic images are cached by Vercel's edge network for optimal performance.

## Project Structure

```
portfolio-website/
├── app/
│   ├── api/
│   │   ├── chat/          # LLM-powered chatbot endpoint
│   │   ├── linkedin/      # LinkedIn profile integration
│   │   ├── twitter/       # Twitter/X feed integration
│   │   ├── yc/            # Y Combinator data scraper
│   │   ├── sh/            # Shell command handler
│   │   └── og/            # Open Graph image generator
│   ├── layout.tsx
│   └── page.tsx           # Main terminal page
├── components/
│   ├── terminal/
│   │   └── Terminal.tsx   # Xterm.js terminal component
│   ├── windows/
│   │   ├── ProcessWindow.tsx  # Draggable window component
│   │   └── WindowRenderer.tsx # Window manager renderer
│   └── processes/
│       ├── About.tsx      # About window component
│       ├── Projects.tsx   # Projects list window
│       ├── Contact.tsx    # Contact information
│       └── Resume.tsx     # Resume viewer
├── data/
│   ├── projects.ts        # Project data definitions
│   └── interview.json     # Static interview Q&A
├── lib/
│   ├── windows/
│   │   ├── processRegistry.tsx  # Process registry
│   │   └── WindowManager.tsx    # Window state management
│   └── api/
│       ├── duckduckgo.ts  # Web search fallback
│       ├── search.ts      # Google Custom Search
│       └── linkedin.ts    # LinkedIn API client
└── TASKS.md               # Development task tracking
```

## Available Terminal Commands

- `help` - Show available commands
- `clear` - Clear terminal output
- `ls` - List available processes
- `run <process>` - Launch a window (e.g., \`run about\`, \`run projects\`)
- `sh <question>` - Ask the AI chatbot a question
- `about` - Show information about the developer
- `projects` - List all portfolio projects
- `contact` - Show contact information
- `resume` - View resume

## Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run Playwright E2E tests
npx playwright test
```

## Deployment

Deploy to Vercel for optimal performance:

1. Push your code to GitHub
2. Import repository in [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy

The OG image generation uses Vercel's Edge runtime for sub-second response times.

## Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript, Tailwind CSS
- **Terminal**: xterm.js with custom addons
- **AI/LLM**: LangChain.js with OpenAI GPT-4
- **Styling**: CRT effects, phosphor glow, scanlines
- **Deployment**: Vercel Edge Functions

## License

MIT

---

Built with ❤️ by Julien Serbanescu
