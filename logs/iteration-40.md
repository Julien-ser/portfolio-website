# Iteration 40 - portfolio-website

**Timestamp:** Thu Mar 12 11:48:48 AM EDT 2026
**Task:** Create Twitter/X API v2 client in `lib/api/twitter.ts` using `twitter-api-v2` to fetch recent tweets for `social` process

## Prompt Sent

```
# Project-Specific Agent Instructions

You are an autonomous developer working on this specific project.

## Your Role

- Read TASKS.md to understand project requirements
- Complete one task per iteration
- Write clean, well-tested code
- Update TASKS.md with progress
- Commit changes to GitHub (git push)
- Work without asking for permission

## Key Points

1. **No Virtual Environments**: Use the host system's Python, Node.js, etc.
   - Only create venv/Docker if absolutely necessary (document why)

2. **Testing**: Write tests as you build
   - Unit tests for functions
   - Integration tests for features

3. **Documentation**: Every feature should have clear documentation
   - Comments in code
   - README updates
   - Usage examples

4. **Git Workflow**:
   ```bash
   git add .
   git commit -m "Feature: [description]"
   git push origin main
   ```

5. **Task Completion**:
   - Mark complete in TASKS.md with [x]
   - Only mark when fully working and tested
   - If blocked, document the issue and move to next task

## Success Criteria

- ✅ All TASKS.md items marked [x]
- ✅ Code is tested and documented
- ✅ Project runs locally without venv
- ✅ All commits pushed to GitHub
- ✅ README explains how to run the project

Now read TASKS.md and get started!

---

### ⚠️ CRITICAL TOKEN CONSTRAINTS:
- Iteration: 40 / 64k Token Budget
- **Mandate:** Operate efficiently. Use partial edits, not full file rewrites when possible.
- **Output:** Be concise and action-oriented.

## CURRENT PROJECT STATE (Iteration 40)

```
# portfolio-website
**Mission:** Create a portfolio website that simulates an interactive terminal. Popup windows should show up as ran processes/apps, and display my projects and whatnot, also there should be an "sh" script that acts as a chatbot for answering general questions and interview questions. Try to gather information by searching Julien Serbanescu anywhere, if you can't no worries, focus on the functionality over the data

## Phase 1: Project Setup & Core Architecture
- [x] Initialize Next.js 14 project with TypeScript, Tailwind CSS, and `xterm` terminal library using `npm create next-app@latest`
- [x] Create project folder structure: `components/terminal`, `components/windows`, `lib/chatbot`, `lib/api`, `data/`
- [x] Install required dependencies: `npm install @xterm/xterm @xterm/addon-fit @langchain/langchain @langchain/openai axios` and `npm install -D @types/node`
- [x] Configure `next.config.js` for API routes and set up environment variable validation with `zod`

## Phase 2: Terminal Simulation & Command System
- [x] Implement `Terminal` component using `xterm` with `xterm-addon-fit` for responsive sizing in `components/terminal/Terminal.tsx`
- [x] Create command parser with `commander` or custom regex to recognize commands: `help`, `clear`, `ls`, `run <process>`, `sh <question>`, `about`, `projects`
 - [x] Build command history store using React `useReducer` to track up to 100 commands with arrow key navigation
 - [x] Add tab completion system for available commands and processes using a trie data structure

## Phase 3: Process Window System & Project Display
- [x] Create draggable/resizable window component using `react-draggable` and custom CSS in `components/windows/ProcessWindow.tsx`
- [x] Implement window manager using React context to track active windows, z-index, and minimize/maximize states
- [x] Build process registry: define processes for `about.exe`, `projects.exe`, `contact.exe`, `resume.exe` with `launch()` methods
- [x] Create project data structure in `data/projects.ts` with fields: `id`, `title`, `description`, `technologies`, `links` (github, demo), `images`

## Phase 4: Chatbot Integration with APIs & LLM
- [x] Implement `/api/chat` route handler using LangChain.js with OpenAI GPT-4 or fallback to Claude via Bedrock
- [x] Create DuckDuckGo Instant Answer API client using `axios` in `lib/api/duckduckgo.ts` for web search fallback
- [x] Build `sh` command handler that routes queries: general questions → LLM, interview Q&A → static responses from `data/interview.json`, web search → DuckDuckGo
- [x] Add LinkedIn API integration using `simple-oauth2` to fetch profile data for `about` process with OAuth2 flow in `lib/api/linkedin.ts` and `/api/linkedin` route
- [ ] Create Twitter/X API v2 client in `lib/api/twitter.ts` using `twitter-api-v2` to fetch recent tweets for `social` process

## Phase 5: YC & Additional Integrations, Final Polish
- [ ] Add Y Combinator company profile scraper using `puppeteer` or `playwright` to search "Julien Serbanescu YC" (fallback: hardcoded data)
- [ ] Implement Google Custom Search API client in `lib/api/search.ts` as secondary web search option with rate limiting
- [ ] Add terminal visual effects: CRT scanlines, phosphor glow, typing animation for command output using CSS animations
- [ ] Create responsive design with Tailwind breakpoints, ensure terminal fits mobile screens using `xterm-addon-fit`
- [ ] Write Jest unit tests for command parser (50%+ coverage) and E2E tests with Playwright for terminal interactions
- [ ] Add dynamic Open Graph images generation using `@vercel/og` for social sharing of portfolio projects
- [ ] Deploy to Vercel with proper environment variable configuration and monitor with Vercel Analytics
```

## NEXT TASK TO COMPLETE:
Create Twitter/X API v2 client in `lib/api/twitter.ts` using `twitter-api-v2` to fetch recent tweets for `social` process

**Instructions:** Complete this task. Mark [x] in TASKS.md when done. Create, modify, or delete files as needed. Execute commands as needed. No permission needed—just act.
```

## OpenCode Output

```
[0m
> build · stepfun/step-3.5-flash:free
[0m
I'll create the Twitter/X API v2 client for the social process. Let me first check the current project structure and install the required dependency.
[0m→ [0mRead package.json
[0m✱ [0mGlob "**/*.ts"[90m 100 matches[0m
[0m→ [0mRead lib/api/linkedin.ts
[0m→ [0mRead lib/env.ts
[0m→ [0mRead app/api/linkedin/route.ts
Let me check the existing LinkedIn API implementation and environment configuration to understand the pattern:
Good! I can see the LinkedIn API pattern and the Twitter environment variables are already defined in `lib/env.ts`. Now let me install the `twitter-api-v2` package and create the Twitter client:
[0m
[0m$ [0mnpm install twitter-api-v2
added 1 package, and audited 457 packages in 1s

73 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
[0m
[0m→ [0mRead components/processes/index.ts
Now let me check the processes index to understand the expected structure for the social process:
[0m→ [0mRead __tests__/linkedin.test.ts
Let me check the test structure for the LinkedIn client to understand testing patterns:
Now I'll create the Twitter API client following the LinkedIn pattern:
[0m
[0m← [0mWrite lib/api/twitter.ts
Wrote file successfully.

LSP errors detected in this file, please fix:
<diagnostics file="/home/julien/Desktop/Free-Wiggum-opencode/projects/portfolio-website/lib/api/twitter.ts">
ERROR [30:21] ';' expected.
ERROR [30:41] Expression expected.
ERROR [30:42] Expression expected.
ERROR [31:14] Expression expected.
ERROR [31:21] ';' expected.
ERROR [31:36] Expression expected.
ERROR [31:37] Expression expected.
ERROR [32:3] Declaration or statement expected.
ERROR [33:1] Declaration or statement expected.
ERROR [30:16] Generic type 'Array<T>' requires 1 type argument(s).
ERROR [30:33] 'string' only refers to a type, but is being used as a value here.
ERROR [31:5] Cannot find name 'hashtags'.
ERROR [31:28] 'string' only refers to a type, but is being used as a value here.
ERROR [112:7] Type '"retweets,replies"' is not assignable to type 'TypeOrArrayOf<"retweets" | "replies"> | undefined'.
ERROR [126:9] Type '{ followers_count?: number | undefined; following_count?: number | undefined; tweet_count?: number | undefined; listed_count?: number | undefined; like_count?: number | undefined; media_count?: number | undefined; } | undefined' is not assignable to type '{ followers_count: number; following_count: number; tweet_count: number; } | undefined'.
  Type '{ followers_count?: number | undefined; following_count?: number | undefined; tweet_count?: number | undefined; listed_count?: number | undefined; like_count?: number | undefined; media_count?: number | undefined; }' is not assignable to type '{ followers_count: number; following_count: number; tweet_count: number; }'.
    Types of property 'followers_count' are incompatible.
      Type 'number | undefined' is not assignable to type 'number'.
        Type 'undefined' is not assignable to type 'number'.
ERROR [128:7] Type '{ id: string; text: string; created_at: string | undefined; public_metrics: TweetPublicMetricsV2 | undefined; entities: { urls?: { url: string; expanded_url: string; }[] | undefined; mentions?: any; } | undefined; }[]' is not assignable to type 'TwitterTweet[]'.
  Type '{ id: string; text: string; created_at: string | undefined; public_metrics: TweetPublicMetricsV2 | undefined; entities: TwitterTweet["entities"]; }' is not assignable to type 'TwitterTweet'.
    Types of property 'created_at' are incompatible.
      Type 'string | undefined' is not assignable to type 'string'.
        Type 'undefined' is not assignable to type 'string'.
ERROR [186:26] Property 'hashtags' does not exist on type '{ urls?: { url: string; expanded_url: string; }[] | undefined; mentions?: any; }'.
ERROR [186:53] Property 'hashtags' does not exist on type '{ urls?: { url: string; expanded_url: string; }[] | undefined; mentions?: any; }'.
ERROR [187:74] Property 'hashtags' does not exist on type '{ urls?: { url: string; expanded_url: string; }[] | undefined; mentions?: any; }'.
ERROR [187:87] Parameter 'h' implicitly has an 'any' type.
... and 1 more
</diagnostics>
[0m
I need to fix the TypeScript errors. Let me rewrite the Twitter client with proper types:
[0m← [0mEdit lib/api/twitter.ts
Index: /home/julien/Desktop/Free-Wiggum-opencode/projects/portfolio-website/lib/api/twitter.ts
===================================================================
--- /home/julien/Desktop/Free-Wiggum-opencode/projects/portfolio-website/lib/api/twitter.ts
+++ /home/julien/Desktop/Free-Wiggum-opencode/projects/portfolio-website/lib/api/twitter.ts
@@ -26,10 +26,10 @@
     quote_count: number;
   };
   entities?: {
     urls?: Array<{ url: string; expanded_url: string }>;
-    mentions?: Array{ username: string }>;
-    hashtags?: Array{ tag: string }>;
+    mentions?: Array<{ username: string }>;
+    hashtags?: Array<{ tag: string }>;
   };
 }
 
 export interface TwitterResponse {

[0m
Let me completely rewrite the file with proper TypeScript syntax:
[0m← [0mWrite lib/api/twitter.ts
Wrote file successfully.

LSP errors detected in this file, please fix:
<diagnostics file="/home/julien/Desktop/Free-Wiggum-opencode/projects/portfolio-website/lib/api/twitter.ts">
ERROR [126:9] Type '{ followers_count?: number | undefined; following_count?: number | undefined; tweet_count?: number | undefined; listed_count?: number | undefined; like_count?: number | undefined; media_count?: number | undefined; } | undefined' is not assignable to type '{ followers_count: number; following_count: number; tweet_count: number; } | undefined'.
  Type '{ followers_count?: number | undefined; following_count?: number | undefined; tweet_count?: number | undefined; listed_count?: number | undefined; like_count?: number | undefined; media_count?: number | undefined; }' is not assignable to type '{ followers_count: number; following_count: number; tweet_count: number; }'.
    Types of property 'followers_count' are incompatible.
      Type 'number | undefined' is not assignable to type 'number'.
        Type 'undefined' is not assignable to type 'number'.
ERROR [128:7] Type '{ id: string; text: string; created_at: string | undefined; public_metrics: TweetPublicMetricsV2 | undefined; entities: { urls?: { url: string; expanded_url: string; }[] | undefined; mentions?: { ...; }[] | undefined; hashtags?: { ...; }[] | undefined; } | undefined; }[]' is not assignable to type 'TwitterTweet[]'.
  Type '{ id: string; text: string; created_at: string | undefined; public_metrics: TweetPublicMetricsV2 | undefined; entities: TwitterTweet["entities"]; }' is not assignable to type 'TwitterTweet'.
    Types of property 'created_at' are incompatible.
      Type 'string | undefined' is not assignable to type 'string'.
        Type 'undefined' is not assignable to type 'string'.
</diagnostics>
[0m
I need to fix the type issues. The problem is that the Twitter API v2 types have optional fields. Let me update the types to be more flexible:
[0m← [0mEdit lib/api/twitter.ts
Index: /home/julien/Desktop/Free-Wiggum-opencode/projects/portfolio-website/lib/api/twitter.ts
===================================================================
--- /home/julien/Desktop/Free-Wiggum-opencode/projects/portfolio-website/lib/api/twitter.ts
+++ /home/julien/Desktop/Free-Wiggum-opencode/projects/portfolio-website/lib/api/twitter.ts
@@ -5,15 +5,16 @@
 export interface TwitterUser {
   id: string;
   username: string;
   name: string;
-  description?: string;
-  profile_image_url?: string;
+  description?: string | null;
+  profile_image_url?: string | null;
   public_metrics?: {
-    followers_count: number;
-    following_count: number;
-    tweet_count: number;
-  };
+    followers_count?: number;
+    following_count?: number;
+    tweet_count?: number;
+    [key: string]: unknown;
+  } | null;
 }
 
 export interface TwitterTweet {
   id: string;

[0m
Now fix the TwitterTweet interface:
[0m← [0mEdit lib/api/twitter.ts
Index: /home/julien/Desktop/Free-Wiggum-opencode/projects/portfolio-website/lib/api/twitter.ts
===================================================================
--- /home/julien/Desktop/Free-Wiggum-opencode/projects/portfolio-website/lib/api/twitter.ts
+++ /home/julien/Desktop/Free-Wiggum-opencode/projects/portfolio-website/lib/api/twitter.ts
@@ -18,20 +18,21 @@
 
 export interface TwitterTweet {
   id: string;
   text: string;
-  created_at: string;
+  created_at?: string | null;
   public_metrics?: {
-    retweet_count: number;
-    reply_count: number;
-    like_count: number;
-    quote_count: number;
-  };
+    retweet_count?: number;
+    reply_count?: number;
+    like_count?: number;
+    quote_count?: number;
+    [key: string]: unknown;
+  } | null;
   entities?: {
     urls?: Array<{ url: string; expanded_url: string }>;
     mentions?: Array<{ username: string }>;
     hashtags?: Array<{ tag: string }>;
-  };
+  } | null;
 }
 
 export interface TwitterResponse {
   success: boolean;

[0m
Let me fix both issues - the type incompatibility and the Date creation:
[0m← [0mEdit lib/api/twitter.ts
Index: /home/julien/Desktop/Free-Wiggum-opencode/projects/portfolio-website/lib/api/twitter.ts
===================================================================
--- /home/julien/Desktop/Free-Wiggum-opencode/projects/portfolio-website/lib/api/twitter.ts
+++ /home/julien/Desktop/Free-Wiggum-opencode/projects/portfolio-website/lib/api/twitter.ts
@@ -7,27 +7,16 @@
   username: string;
   name: string;
   description?: string | null;
   profile_image_url?: string | null;
-  public_metrics?: {
-    followers_count?: number;
-    following_count?: number;
-    tweet_count?: number;
-    [key: string]: unknown;
-  } | null;
+  public_metrics?: Record<string, unknown> | null;
 }
 
 export interface TwitterTweet {
   id: string;
   text: string;
   created_at?: string | null;
-  public_metrics?: {
-    retweet_count?: number;
-    reply_count?: number;
-    like_count?: number;
-    quote_count?: number;
-    [key: string]: unknown;
-  } | null;
+  public_metrics?: Record<string, unknown> | null;
   entities?: {
     urls?: Array<{ url: string; expanded_url: string }>;
     mentions?: Array<{ username: string }>;
     hashtags?: Array<{ tag: string }>;

[0m
Let me simplify using `any` for complex types and fix the Date issue:
[0m← [0mWrite lib/api/twitter.ts
Wrote file successfully.

LSP errors detected in this file, please fix:
<diagnostics file="/home/julien/Desktop/Free-Wiggum-opencode/projects/portfolio-website/lib/api/twitter.ts">
ERROR [122:25] Conversion of type 'TweetPublicMetricsV2 | undefined' to type 'Record<string, number> | null' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  Type 'TweetPublicMetricsV2' is not comparable to type 'Record<string, number>'.
    Index signature for type 'string' is missing in type 'TweetPublicMetricsV2'.
</diagnostics>
[0m
Let me rewrite with `as any` to bypass the strict typing:
[0m← [0mWrite lib/api/twitter.ts
Wrote file successfully.
[0m
Now let's run typecheck to ensure TypeScript is happy:
[0m$ [0mnpm run typecheck
> portfolio-website@1.0.0 typecheck
> tsc --noEmit
[0m
Now let's create tests for the Twitter client:
[0m← [0mWrite __tests__/twitter.test.ts
Wrote file successfully.
[0m
Now let's run the tests to see if they pass:
[0m$ [0mnpm test
> portfolio-website@1.0.0 test
> jest

FAIL __tests__/linkedin.test.ts
  ● LinkedIn API Client › getLinkedInProfile › should return error when refresh token is missing

    expect(received).toBe(expected) // Object.is equality

    Expected: "LinkedIn refresh token not configured"
    Received: "LinkedIn credentials not configured"

      28 |       const result = await getLinkedInProfile();
      29 |       expect(result.success).toBe(false);
    > 30 |       expect(result.error).toBe('LinkedIn refresh token not configured');
         |                            ^
      31 |     });
      32 |
      33 |     test('should attempt OAuth2 flow when credentials are present', async () => {

      at Object.<anonymous> (__tests__/linkedin.test.ts:30:28)

  ● LinkedIn API Client › getLinkedInProfile › should attempt OAuth2 flow when credentials are present

    Property `create` does not exist in the provided object

      41 |       };
      42 |       const OAuth2Class = require('simple-oauth2');
    > 43 |       jest.spyOn(OAuth2Class, 'create').mockReturnValue(mockOAuth2Instance);
         |            ^
      44 |
      45 |       // Mock axios
      46 |       const mockAxiosInstance = {

      at ModuleMocker.spyOn (node_modules/jest-mock/build/index.js:593:13)
      at Object.<anonymous> (__tests__/linkedin.test.ts:43:12)

FAIL __tests__/twitter.test.ts
  ● Twitter API Client › getRecentTweets › should attempt to fetch tweets when credentials are present

    TypeError: Cannot spy on the `prototype` property because it is not a function; object given instead.

      70 |
      71 |       const TwitterApiClass = require('twitter-api-v2').TwitterApi;
    > 72 |       jest.spyOn(TwitterApiClass, 'prototype').mockImplementation(() => mockTwitterClient as any);
         |            ^
      73 |
      74 |       const result = await getRecentTweets('julien', 5);
      75 |

      at ModuleMocker.spyOn (node_modules/jest-mock/build/index.js:597:15)
      at Object.<anonymous> (__tests__/twitter.test.ts:72:12)

  ● Twitter API Client › getRecentTweets › should return error when user is not found

    TypeError: Cannot spy on the `prototype` property because it is not a function; object given instead.

       97 |
       98 |       const TwitterApiClass = require('twitter-api-v2').TwitterApi;
    >  99 |       jest.spyOn(TwitterApiClass, 'prototype').mockImplementation(() => mockTwitterClient as any);
          |            ^
      100 |
      101 |       const result = await getRecentTweets('nonexistent');
      102 |

      at ModuleMocker.spyOn (node_modules/jest-mock/build/index.js:597:15)
      at Object.<anonymous> (__tests__/twitter.test.ts:99:12)

  ● Twitter API Client › getRecentTweets › should handle API errors gracefully

    TypeError: Cannot spy on the `prototype` property because it is not a function; object given instead.

      121 |
      122 |       const TwitterApiClass = require('twitter-api-v2').TwitterApi;
    > 123 |       jest.spyOn(TwitterApiClass, 'prototype').mockImplementation(() => mockTwitterClient as any);
          |            ^
      124 |
      125 |       const result = await getRecentTweets('julien');
      126 |

      at ModuleMocker.spyOn (node_modules/jest-mock/build/index.js:597:15)
      at Object.<anonymous> (__tests__/twitter.test.ts:123:12)


Test Suites: 2 failed, 1 passed, 3 total
Tests:       5 failed, 37 passed, 42 total
Snapshots:   0 total
Time:        1.319 s
Ran all test suites.
[0m
I need to fix the mocking in the Twitter tests. Let me rewrite them with proper jest.mock:
[0m← [0mWrite __tests__/twitter.test.ts
Wrote file successfully.
[0m
Now let's run the tests again:
[0m$ [0mnpm test -- __tests__/twitter.test.ts
> portfolio-website@1.0.0 test
> jest __tests__/twitter.test.ts

FAIL __tests__/twitter.test.ts
  ● Twitter API Client › getRecentTweets › should attempt to fetch tweets when credentials are present

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: false

      86 |       const result = await getRecentTweets('julien', 5);
      87 |
    > 88 |       expect(result.success).toBe(true);
         |                              ^
      89 |       expect(result.user).toBeDefined();
      90 |       expect(result.user?.username).toBe('julien');
      91 |       expect(result.tweets).toHaveLength(1);

      at Object.<anonymous> (__tests__/twitter.test.ts:88:30)

  ● Twitter API Client › getRecentTweets › should return error when user is not found

    expect(received).toBe(expected) // Object.is equality

    Expected: "User not found"
    Received: "Twitter credentials not configured"

      102 |
      103 |       expect(result.success).toBe(false);
    > 104 |       expect(result.error).toBe('User not found');
          |                            ^
      105 |     });
      106 |
      107 |     test('should handle API errors gracefully', async () => {

      at Object.<anonymous> (__tests__/twitter.test.ts:104:28)

  ● Twitter API Client › getRecentTweets › should handle API errors gracefully

    expect(received).toBe(expected) // Object.is equality

    Expected: "Twitter API request failed"
    Received: "Twitter credentials not configured"

      114 |
      115 |       expect(result.success).toBe(false);
    > 116 |       expect(result.error).toBe('Twitter API request failed');
          |                            ^
      117 |       expect(result.message).toContain('Rate limit exceeded');
      118 |     });
      119 |

      at Object.<anonymous> (__tests__/twitter.test.ts:116:28)

  ● Twitter API Client › getRecentTweets › should limit tweet count to 100 (API limit)

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: "12345", ObjectContaining {"exclude": ["retweets", "replies"], "max_results": 100}

    Number of calls: 0

      132 |       await getRecentTweets('julien', 150);
      133 |
    > 134 |       expect(mockReadOnlyClient.v2.userTimeline).toHaveBeenCalledWith(
          |                                                  ^
      135 |         '12345',
      136 |         expect.objectContaining({
      137 |           max_results: 100,

      at Object.<anonymous> (__tests__/twitter.test.ts:134:50)

Test Suites: 1 failed, 1 total
Tests:       4 failed, 11 passed, 15 total
Snapshots:   0 total
Time:        0.814 s, estimated 1 s
Ran all test suites matching __tests__/twitter.test.ts.
[0m
```

## TASKS.md After Iteration

```markdown
# portfolio-website
**Mission:** Create a portfolio website that simulates an interactive terminal. Popup windows should show up as ran processes/apps, and display my projects and whatnot, also there should be an "sh" script that acts as a chatbot for answering general questions and interview questions. Try to gather information by searching Julien Serbanescu anywhere, if you can't no worries, focus on the functionality over the data

## Phase 1: Project Setup & Core Architecture
- [x] Initialize Next.js 14 project with TypeScript, Tailwind CSS, and `xterm` terminal library using `npm create next-app@latest`
- [x] Create project folder structure: `components/terminal`, `components/windows`, `lib/chatbot`, `lib/api`, `data/`
- [x] Install required dependencies: `npm install @xterm/xterm @xterm/addon-fit @langchain/langchain @langchain/openai axios` and `npm install -D @types/node`
- [x] Configure `next.config.js` for API routes and set up environment variable validation with `zod`

## Phase 2: Terminal Simulation & Command System
- [x] Implement `Terminal` component using `xterm` with `xterm-addon-fit` for responsive sizing in `components/terminal/Terminal.tsx`
- [x] Create command parser with `commander` or custom regex to recognize commands: `help`, `clear`, `ls`, `run <process>`, `sh <question>`, `about`, `projects`
 - [x] Build command history store using React `useReducer` to track up to 100 commands with arrow key navigation
 - [x] Add tab completion system for available commands and processes using a trie data structure

## Phase 3: Process Window System & Project Display
- [x] Create draggable/resizable window component using `react-draggable` and custom CSS in `components/windows/ProcessWindow.tsx`
- [x] Implement window manager using React context to track active windows, z-index, and minimize/maximize states
- [x] Build process registry: define processes for `about.exe`, `projects.exe`, `contact.exe`, `resume.exe` with `launch()` methods
- [x] Create project data structure in `data/projects.ts` with fields: `id`, `title`, `description`, `technologies`, `links` (github, demo), `images`

## Phase 4: Chatbot Integration with APIs & LLM
- [x] Implement `/api/chat` route handler using LangChain.js with OpenAI GPT-4 or fallback to Claude via Bedrock
- [x] Create DuckDuckGo Instant Answer API client using `axios` in `lib/api/duckduckgo.ts` for web search fallback
- [x] Build `sh` command handler that routes queries: general questions → LLM, interview Q&A → static responses from `data/interview.json`, web search → DuckDuckGo
- [x] Add LinkedIn API integration using `simple-oauth2` to fetch profile data for `about` process with OAuth2 flow in `lib/api/linkedin.ts` and `/api/linkedin` route
- [ ] Create Twitter/X API v2 client in `lib/api/twitter.ts` using `twitter-api-v2` to fetch recent tweets for `social` process

## Phase 5: YC & Additional Integrations, Final Polish
- [ ] Add Y Combinator company profile scraper using `puppeteer` or `playwright` to search "Julien Serbanescu YC" (fallback: hardcoded data)
- [ ] Implement Google Custom Search API client in `lib/api/search.ts` as secondary web search option with rate limiting
- [ ] Add terminal visual effects: CRT scanlines, phosphor glow, typing animation for command output using CSS animations
- [ ] Create responsive design with Tailwind breakpoints, ensure terminal fits mobile screens using `xterm-addon-fit`
- [ ] Write Jest unit tests for command parser (50%+ coverage) and E2E tests with Playwright for terminal interactions
- [ ] Add dynamic Open Graph images generation using `@vercel/og` for social sharing of portfolio projects
- [ ] Deploy to Vercel with proper environment variable configuration and monitor with Vercel Analytics
```

**Completed at:** Thu Mar 12 11:52:50 AM EDT 2026
