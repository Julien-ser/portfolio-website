import axios from 'axios';
import { env } from '@/lib/env';

// Types for Google Custom Search API response
export interface GoogleSearchItem {
  title: string;
  link: string;
  displayLink: string;
  snippet?: string;
  pagemap?: {
    cse_image?: Array<{ src: string }>;
    metatags?: Array<Record<string, string>>;
  };
}

export interface GoogleSearchResponse {
  items?: GoogleSearchItem[];
  searchInformation?: {
    totalResults: string;
    searchTime: number;
  };
  error?: {
    code: number;
    message: string;
  };
}

export interface SearchResult {
  answer: string;
  source?: string;
  sourceUrl?: string;
  relatedTopics?: Array<{
    title: string;
    url: string;
    snippet?: string;
    image?: string;
  }>;
  image?: string;
}

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 60; // 60 requests per minute (1 per second average)
const BURST_CAPACITY = 5; // Allow bursts of up to 5 requests

// Simple in-memory rate limiter (note: resets on serverless function cold starts)
class RateLimiter {
  private requests: number[] = [];
  private lastCleanup: number = Date.now();

  private cleanup() {
    const now = Date.now();
    if (now - this.lastCleanup > 10000) { // Cleanup every 10 seconds
      const windowStart = now - RATE_LIMIT_WINDOW_MS;
      this.requests = this.requests.filter(time => time > windowStart);
      this.lastCleanup = now;
    }
  }

  async tryAcquire(): Promise<boolean> {
    this.cleanup();
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW_MS;
    
    // Count requests in current window
    const recentRequests = this.requests.filter(time => time > windowStart);
    
    if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
      return false;
    }

    // Add current request timestamp
    this.requests.push(now);
    return true;
  }

  getRemainingRequests(): number {
    this.cleanup();
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW_MS;
    const recentRequests = this.requests.filter(time => time > windowStart);
    return Math.max(0, MAX_REQUESTS_PER_WINDOW - recentRequests.length);
  }

  getResetTime(): number {
    if (this.requests.length === 0) return Date.now();
    const oldestRequest = Math.min(...this.requests);
    return oldestRequest + RATE_LIMIT_WINDOW_MS;
  }
}

// Create a singleton rate limiter instance
const rateLimiter = new RateLimiter();

/**
 * Google Custom Search API client
 * Provides web search using Google's Custom Search JSON API
 * Includes rate limiting to stay within free tier limits
 */
export async function searchGoogle(query: string, numResults: number = 5): Promise<SearchResult> {
  const apiKey = env.GOOGLE_SEARCH_API_KEY;
  const cx = env.GOOGLE_SEARCH_CX;

  if (!apiKey || !cx) {
    throw new Error(
      'Google Search credentials not configured. Please set GOOGLE_SEARCH_API_KEY and GOOGLE_SEARCH_CX environment variables'
    );
  }

  // Check rate limit before making request
  if (!(await rateLimiter.tryAcquire())) {
    const resetTime = rateLimiter.getResetTime();
    const waitTime = resetTime - Date.now();
    throw new Error(
      `Rate limit exceeded. Please try again in ${Math.ceil(waitTime / 1000)} seconds.`
    );
  }

  try {
    const response = await axios.get<GoogleSearchResponse>('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: apiKey,
        cx: cx,
        q: query,
        num: Math.min(numResults, 10), // Max 10 per request for free tier
        fields: 'items(title,link,displayLink,snippet,pagemap/cse_image/src),searchInformation(totalResults,searchTime)',
        safe: 'active',
      },
      timeout: 10000, // 10 second timeout
    });

    const data = response.data;

    // Check for API error in response
    if (data.error) {
      if (data.error.code === 403) {
        throw new Error('Google Search API quota exceeded or API key invalid');
      }
      throw new Error(`Google Search API error: ${data.error.message}`);
    }

    if (!data.items || data.items.length === 0) {
      return {
        answer: `No results found for: ${query}`,
        relatedTopics: [],
      };
    }

    // Transform Google Search results into our standard format
    const relatedTopics: SearchResult['relatedTopics'] = data.items.map(item => ({
      title: item.title,
      url: item.link,
      snippet: item.snippet,
      image: item.pagemap?.cse_image?.[0]?.src,
    }));

    // Build answer from top result
    const topResult = data.items[0];
    let answer = topResult.snippet || topResult.title;

    // If we have a snippet, prepend the result count
    if (data.searchInformation) {
      const count = parseInt(data.searchInformation.totalResults || '0', 10);
      answer = `Found ${count.toLocaleString()} results. Top result: ${answer}`;
    }

    return {
      answer,
      relatedTopics,
      source: 'Google Custom Search',
      sourceUrl: topResult.link,
      image: topResult.pagemap?.cse_image?.[0]?.src,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        throw new Error('Google Search API quota exceeded or API key invalid');
      }
      console.error('Google Search API error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.message,
      });
    } else {
      console.error('Unexpected error:', error);
    }

    throw new Error(`Google search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get rate limit status
 */
export function getGoogleRateLimitStatus() {
  return {
    remaining: rateLimiter.getRemainingRequests(),
    resetTime: rateLimiter.getResetTime(),
    windowMs: RATE_LIMIT_WINDOW_MS,
    maxRequests: MAX_REQUESTS_PER_WINDOW,
  };
}

/**
 * Simple search that returns just the answer and first URL
 */
export async function simpleGoogleSearch(query: string): Promise<{ answer: string; url?: string }> {
  const result = await searchGoogle(query, 1);
  return {
    answer: result.answer,
    url: result.sourceUrl,
  };
}
